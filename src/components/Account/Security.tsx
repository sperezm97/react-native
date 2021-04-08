import React, { useEffect, useState } from 'react'
import { useObserver } from 'mobx-react-lite'
import { StyleSheet, View, Text } from 'react-native'
import Icon from 'react-native-vector-icons/AntDesign'
import Toast from 'react-native-simple-toast'
import Clipboard from '@react-native-community/clipboard'
import Slider from '@react-native-community/slider'
import { encode as btoa } from 'base-64'

import { useStores, useTheme } from '../../store'
import { TOAST_DURATION } from '../../constants'
import { getPinTimeout, updatePinTimeout } from '../utils/pin'
import * as rsa from '../../crypto/rsa'
import * as e2e from '../../crypto/e2e'
import { userPinCode } from '../utils/pin'
import BackHeader from './BackHeader'
import Button from '../common/Button'
import ActionMenu from '../common/ActionMenu'

export default function Security() {
  const [pinTimeout, setPinTimeout] = useState(12)
  const [initialPinTimeout, setInitialPinTimeout] = useState(12)
  const theme = useTheme()
  const { user, contacts, ui } = useStores()

  async function loadPinTimeout() {
    const pt = await getPinTimeout()
    setInitialPinTimeout(pt)
    setPinTimeout(pt)
  }

  useEffect(() => {
    loadPinTimeout()
  }, [])

  async function exportKeys(pin) {
    if (!pin) return
    const thePIN = await userPinCode()
    // if (pin !== thePIN) return
    const priv = await rsa.getPrivateKey()
    const me = contacts.contacts.find(c => c.id === 1)
    const pub = me && me.contact_key
    const ip = user.currentIP
    const token = user.authToken
    if (!priv || !pub || !ip || !token) return
    const str = `${priv}::${pub}::${ip}::${token}`
    const enc = await e2e.encrypt(str, pin)
    const final = btoa(`keys::${enc}`)

    Clipboard.setString(final)
    Toast.showWithGravity('Export Keys Copied.', TOAST_DURATION, Toast.CENTER)
    ui.setPinCodeModal(false, null)
  }

  function pinTimeoutValueUpdated(v) {
    updatePinTimeout(String(v))
  }
  function pinTimeoutValueChange(v) {
    setPinTimeout(v)
  }

  const items = [
    [
      {
        title: 'Set Pin',
        icon: 'ChevronRight',
        action: () => console.log('')
      }
    ]
  ]

  return useObserver(() => {
    if (ui.pinCodeParams) {
      exportKeys(ui.pinCodeParams)
    }

    return (
      <View style={{ ...styles.wrap, backgroundColor: theme.bg }}>
        <BackHeader title='Security' />
        <ActionMenu items={items} />
        <View style={{ padding: 20 }}>
          <View style={styles.pinTimeoutTextWrap}>
            <Text style={{ color: theme.subtitle }}>PIN Timeout</Text>
            <Text style={{ color: theme.title }}>{pinTimeout ? pinTimeout : 'Always Require PIN'}</Text>
          </View>
          <Slider
            minimumValue={0}
            maximumValue={24}
            value={initialPinTimeout}
            step={1}
            minimumTrackTintColor={theme.primary}
            maximumTrackTintColor={theme.primary}
            thumbTintColor={theme.primary}
            onSlidingComplete={pinTimeoutValueUpdated}
            onValueChange={pinTimeoutValueChange}
          />
        </View>

        <View style={styles.box}>
          <View style={{ ...styles.exportWrap }}>
            <Text style={{ ...styles.exportText, color: theme.text }}>Want to switch devices?</Text>
            <Button accessibilityLabel='onboard-welcome-button' onPress={() => ui.setPinCodeModal(true, null)} style={{ backgroundColor: theme.primary }} size='large'>
              <Text>Export keys</Text>
              <View style={{ width: 12, height: 1 }}></View>
              <Icon name='key' color={theme.white} size={18} />
            </Button>
          </View>
        </View>
      </View>
    )
  })
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    flex: 1
  },
  box: {
    flex: 1,
    marginTop: 40,
    paddingRight: 20,
    paddingLeft: 20,
    justifyContent: 'flex-end'
  },
  exportWrap: {
    minHeight: 190,
    display: 'flex',
    justifyContent: 'center',
    paddingTop: 20,
    paddingBottom: 20
  },
  exportText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 14
  },
  pinTimeoutTextWrap: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingRight: 16
    // paddingLeft: 16,
  }
})
