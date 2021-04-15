import React from 'react'
import { useObserver } from 'mobx-react-lite'
import { StyleSheet, View, Text } from 'react-native'
import Share from 'react-native-share'
import Clipboard from '@react-native-community/clipboard'
import Toast from 'react-native-simple-toast'

import { useTheme } from '../../../store'
import { TOAST_DURATION } from '../../../constants'
import ModalWrap from './ModalWrap'
import ModalHeader from './ModalHeader'
import QRCode from '../../utils/qrcode'
import Button from '../Button'
import Empty from '../Empty'

export default function PubKey({ visible, close, pubkey }) {
  const theme = useTheme()

  function copy() {
    Clipboard.setString(pubkey)
    Toast.showWithGravity('Public Key Copied.', TOAST_DURATION, Toast.CENTER)
  }

  async function share() {
    try {
      await Share.open({ message: pubkey })
    } catch (e) {}
  }

  return useObserver(() => (
    <ModalWrap onClose={close} visible={visible}>
      <ModalHeader title='Public Key' onClose={close} />
      <View style={styles.qrWrap}>
        {pubkey && <QRCode value={pubkey} size={720} />}
        {!pubkey && <Empty text='No Public Address found' />}
      </View>
      <Text style={{ ...styles.pubkeyText, color: theme.title }}>{pubkey}</Text>
      <View style={styles.buttonsWrap}>
        <Button onPress={() => share()} style={styles.button}>
          Share
        </Button>
        <Button style={styles.button} onPress={() => copy()}>
          Copy
        </Button>
      </View>
    </ModalWrap>
  ))
}

const styles = StyleSheet.create({
  qrWrap: {
    display: 'flex',
    flexDirection: 'column',
    padding: 20,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50
  },
  pubkeyText: {
    padding: 20,
    width: '100%'
  },
  buttonsWrap: {
    marginTop: 40,
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around'
  },
  button: {
    borderRadius: 23,
    display: 'flex',
    justifyContent: 'center',
    height: 46,
    width: 120
  }
})
