import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text, Switch, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { TextInput, IconButton } from 'react-native-paper'
import Clipboard from '@react-native-community/clipboard'
import Toast from 'react-native-simple-toast'

import { useStores, useTheme } from '../../store'
import { TOAST_DURATION } from '../../constants'
import BackHeader from './BackHeader'
import Button from '../common/Button'

export default function AccountDetails() {
  const { user, contacts } = useStores()
  const [tipAmount, setTipAmount] = useState(user.tipAmount + '')
  const [loading, setLoading] = useState(false)
  const [isEnabled, setIsEnabled] = useState(false)
  const me = contacts.contacts.find(c => c.id === 1)

  useEffect(() => {
    setIsEnabled(me?.private_photo || false)
  }, [])

  const theme = useTheme()
  const navigation = useNavigation()

  function tipAmountChange(ta) {
    const int = parseInt(ta)
    setTipAmount(int ? int + '' : '')
  }

  function toggleSwitch() {
    setIsEnabled(previousState => !previousState)
    shareContactKey()
  }

  function save() {
    setLoading(true)
    user.setTipAmount(parseInt(tipAmount))
    setLoading(false)
  }

  async function shareContactKey() {
    const contact_key = me.contact_key
    if (!contact_key) return
    await contacts.updateContact(1, { contact_key })
  }

  function copyAddress() {
    Clipboard.setString(user.publicKey)
    Toast.showWithGravity('Address copid to clipboard', TOAST_DURATION, Toast.CENTER)
  }

  return (
    <View style={{ ...styles.wrap, backgroundColor: theme.bg }}>
      <BackHeader title='Details' />
      <View style={styles.box}>
        <View>
          <Text style={{ marginBottom: 4, color: theme.subtitle }}>Address</Text>
          <View style={{ ...styles.address }}>
            <View
              style={{
                ...styles.addressBar,
                backgroundColor: theme.main
              }}
            >
              <TouchableOpacity style={{ alignSelf: 'center' }} onPress={copyAddress}>
                <Text numberOfLines={1} ellipsizeMode='tail' style={{ color: theme.subtitle }}>
                  {user.publicKey}
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Account')}>
              <IconButton icon='qrcode-scan' size={26} color={theme.primary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.shareWrap}>
          <Text style={{ color: theme.text }}>Share my profile photo with contacts</Text>
          <Switch trackColor={{ false: theme.grey, true: theme.primary }} thumbColor={theme.white} ios_backgroundColor={theme.grey} onValueChange={toggleSwitch} value={isEnabled} />
        </View>

        <Text style={{ marginBottom: 6, color: theme.subtitle }}>Tip Amount</Text>
        <TextInput
          placeholder='Default Tip Amount'
          value={tipAmount + ''}
          onChangeText={tipAmountChange}
          style={{ backgroundColor: theme.bg }}
          placeholderTextColor={theme.subtitle}
          underlineColor={theme.border}
        />
        <View style={styles.btnWrap}>
          <Button onPress={() => navigation.navigate('Account')} size='small' style={{ ...styles.button, marginRight: 20 }}>
            Cancel
          </Button>
          <Button onPress={save} size='small' style={{ ...styles.button }} loading={loading}>
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
  address: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 26
  },
  addressBar: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    height: 40,
    width: '100%',
    paddingLeft: 6,
    paddingRight: 6
  },
  shareWrap: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 22
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
