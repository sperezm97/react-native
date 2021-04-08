import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { TextInput } from 'react-native-paper'

import { useStores, useTheme } from '../../store'
import BackHeader from './BackHeader'
import Button from '../common/Button'

export default function Network() {
  const [serverURL, setServerURL] = useState('')
  const [loading, setLoading] = useState(false)
  const { user } = useStores()
  const theme = useTheme()
  const navigation = useNavigation()

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

  return (
    <View style={{ ...styles.wrap, backgroundColor: theme.bg }}>
      <BackHeader title='Network' />
      <View style={styles.box}>
        <Text style={{ color: theme.text }}>Server URL</Text>
        <TextInput
          placeholder='Server URL'
          value={serverURL}
          onChangeText={serverURLchange}
          style={{ height: 50, backgroundColor: theme.bg }}
          placeholderTextColor={theme.subtitle}
          underlineColor={theme.border}
        />
        <View style={styles.btnWrap}>
          <Button onPress={() => navigation.navigate('Account')} size='small' style={{ ...styles.button, marginRight: 20 }}>
            Cancel
          </Button>
          <Button onPress={saveServerURL} size='small' style={{ ...styles.button }} loading={loading}>
            Save
          </Button>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1
  },
  box: {
    marginTop: 40,
    paddingRight: 14,
    paddingLeft: 14
  },
  btnWrap: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 20
  },
  button: {
    minWidth: 90
  }
})
