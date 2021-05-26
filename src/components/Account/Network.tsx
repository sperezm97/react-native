import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { TextInput } from 'react-native-paper'
import Clipboard from '@react-native-community/clipboard'
import Toast from 'react-native-simple-toast'

import { useStores, useTheme } from '../../store'
import { TOAST_DURATION } from '../../constants'
import BackHeader from '../common/BackHeader'
import InputAccessoryView from '../common/Accessories/InputAccessoryView'
import Typography from '../common/Typography'

export default function Network() {
  const [serverURL, setServerURL] = useState('')
  const [loading, setLoading] = useState(false)
  const { user } = useStores()
  const theme = useTheme()
  const nativeID = 'serverUrl'

  useEffect(() => {
    setServerURL(user.currentIP)
  }, [])

  function serverURLchange(URL) {
    setServerURL(URL)
  }

  function saveServerURL() {
    setLoading(true)
    user.setCurrentIP(serverURL)
    setLoading(false)
  }

  function handlePress() {
    Clipboard.setString(user.authToken)
    Toast.showWithGravity('Token Copied.', TOAST_DURATION, Toast.CENTER)
  }

  return (
    <View style={{ ...styles.wrap, backgroundColor: theme.bg }}>
      <BackHeader title='Network' />
      <View style={styles.content}>
        <Text style={{ color: theme.text }}>Server URL</Text>
        <TextInput
          inputAccessoryViewID={nativeID}
          placeholder='Server URL'
          value={serverURL}
          onChangeText={serverURLchange}
          style={{ height: 50, textAlign: 'auto', backgroundColor: theme.bg }}
          placeholderTextColor={theme.placeholder}
          underlineColor={theme.border}
        />

        <InputAccessoryView nativeID={nativeID} done={saveServerURL} />

        <View style={{ marginTop: 20 }}>
          <Typography onPress={handlePress}>{user.authToken}</Typography>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1
  },
  content: {
    marginTop: 40,
    paddingRight: 18,
    paddingLeft: 18
  }
})
