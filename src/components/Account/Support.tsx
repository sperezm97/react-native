import React, { useState, useEffect } from 'react'
import { View, StyleSheet, TextInput, Linking } from 'react-native'
import { useObserver } from 'mobx-react-lite'
import Clipboard from '@react-native-community/clipboard'
import { ActivityIndicator } from 'react-native-paper'
import Toast from 'react-native-simple-toast'

import { useStores, useTheme } from '../../store'
import { TOAST_DURATION } from '../../constants'
import Button from '../common/Button'
import BackHeader from '../common/BackHeader'

export default function Support() {
  const { details } = useStores()
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
    body += details.logs.replace(/(\n)/g, '<br/>')
    const subject = 'N2N2 Support Request'
    Linking.openURL(`mailto:ci@n2n2.co?subject=${subject}&body=${body}`)
  }

  useEffect(() => {
    loadLogs()

    return () => {
      details.clearLogs()
    }
  }, [])

  return useObserver(() => (
    <View style={{ ...styles.wrap, backgroundColor: theme.bg }}>
      <BackHeader title='Support' />
      <View style={{ padding: 18, flex: 1 }}>
        <TextInput
          numberOfLines={4}
          textAlignVertical='top'
          multiline={true}
          placeholder='Describe your problem here...'
          onChangeText={e => setText(e)}
          value={text}
          blurOnSubmit={true}
          style={{
            ...styles.input,
            backgroundColor: theme.bg,
            borderColor: theme.border
          }}
          placeholderTextColor={theme.placeholder}
        />
        {loading && (
          <View style={styles.spinWrap}>
            <ActivityIndicator animating={true} color={theme.icon} />
          </View>
        )}
      </View>

      <View style={styles.bottom}>
        <View style={styles.buttonWrap}>
          <Button disabled={!details.logs} onPress={() => email()} w={160}>
            Send Message
          </Button>
          <Button disabled={!details.logs} onPress={() => copy()} w={160}>
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
    width: '100%'
  },
  bottom: {
    flex: 1,
    marginTop: 40,
    paddingRight: 18,
    paddingLeft: 18,
    justifyContent: 'flex-end'
  },
  buttonWrap: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    minHeight: 200,
    paddingTop: 20,
    paddingBottom: 20
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
    width: '100%'
  },
  logsScroller: {
    flex: 1,
    minHeight: 100,
    padding: 15
  },
  logs: {
    fontSize: 11
  },
  spinWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
