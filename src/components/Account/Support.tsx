import React, { useState, useEffect } from 'react'
import { View, StyleSheet, TextInput, Linking, ScrollView } from 'react-native'
import { useObserver } from 'mobx-react-lite'
import Clipboard from '@react-native-community/clipboard'
import { ActivityIndicator } from 'react-native-paper'
import Toast from 'react-native-simple-toast'
import packageJSON from '../../../package.json'

import { useStores, useTheme } from '../../store'
import { TOAST_DURATION } from '../../constants'
import Button from '../common/Button'
import Typography from '../common/Typography'
import BackHeader from '../common/BackHeader'

export default function Support() {
  const { details, user } = useStores()
  const [loading, setLoading] = useState(true)
  const [text, setText] = useState('')
  const theme = useTheme()

  async function loadLogs() {
    setLoading(true)
    await details.getLogs()
    setLoading(false)
  }

  function copy() {
    Clipboard.setString(details.logs)
    Toast.showWithGravity('Logs Copied', TOAST_DURATION, Toast.CENTER)
  }

  function email() {
    let body = text ? `${text}<br/><br/>` : ''
    body += `Server URL (alias) of this user account: ${user.currentIP}<br/><br/>`

    if (details.logs) {
      body += details.logs.replace(/(\n)/g, '<br/>')
    }
    const subject = 'Zion Support Request'
    Linking.openURL(`mailto:support@getzion.zendesk.com?subject=${subject}&body=${body}`)
  }

  useEffect(() => {
    loadLogs()

    return () => {
      details.clearLogs()
    }
  }, [])

  console.log(details.logs.length)

  return useObserver(() => (
    <View style={{ ...styles.wrap, backgroundColor: theme.bg }}>
      <BackHeader title='Support' />
      <View style={{ padding: 18, flex: 1 }}>
        <TextInput
          numberOfLines={4}
          textAlignVertical='top'
          multiline={true}
          placeholder='Describe your problem here...'
          onChangeText={(e) => setText(e)}
          value={text}
          blurOnSubmit={true}
          style={{
            ...styles.input,
            backgroundColor: theme.bg,
            borderColor: theme.border,
          }}
          placeholderTextColor={theme.placeholder}
        />
        <Typography size={14} style={styles.version}>
          {`App version: ${packageJSON.version}`}
        </Typography>
        <View style={{ flex: 1 }}>
          <ScrollView style={styles.scroll} contentContainerStyle={styles.inner}>
            {/* Limits the amount of logs to 10000 characters, if the user wants to see it complete can copy the log */}
            {/* Previously to more than 25k characters was representing a issue of hiding all the messages inside Typography */}
            <Typography>{String(details.logs).slice(0, 10000)}</Typography>
          </ScrollView>
        </View>
        {loading && (
          <View style={styles.spinWrap}>
            <ActivityIndicator animating={true} color={theme.icon} />
          </View>
        )}
      </View>

      <View style={styles.bottom}>
        <View style={styles.buttonWrap}>
          <Button onPress={email} w={160}>
            Send Message
          </Button>
          <Button disabled={!details.logs} onPress={copy} w={160}>
            Copy Logs
          </Button>
        </View>
      </View>
    </View>
  ))
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    width: '100%',
  },
  scroll: {
    flex: 1,
    display: 'flex',
    maxHeight: '90%',
  },
  inner: {
    margin: 2,
    display: 'flex',
    alignItems: 'center',
  },
  version: {
    marginTop: 6,
  },
  bottom: {
    flex: 1,
    marginTop: 40,
    paddingRight: 18,
    paddingLeft: 18,
    justifyContent: 'flex-end',
  },
  buttonWrap: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    minHeight: 200,
    paddingTop: 20,
    paddingBottom: 20,
  },
  input: {
    flex: 1,
    borderRadius: 12,
    paddingTop: 18,
    paddingLeft: 18,
    paddingRight: 18,
    borderWidth: 1,
    fontSize: 15,
    lineHeight: 20,
    minHeight: 100,
    maxHeight: 100,
    width: '100%',
  },
  logsScroller: {
    flex: 1,
    minHeight: 100,
    padding: 15,
  },
  logs: {
    fontSize: 11,
  },
  spinWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
