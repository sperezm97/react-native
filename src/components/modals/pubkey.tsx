import React, { useEffect } from 'react'
import { useObserver } from 'mobx-react-lite'
import { View, Text, StyleSheet } from 'react-native'
import { Button, Portal } from 'react-native-paper'
import QRCode from '../utils/qrcode'
import Header from './modalHeader'
import Share from 'react-native-share'
import Clipboard from '@react-native-community/clipboard'
import Toast from 'react-native-simple-toast'

import { useTheme } from '../../store'
import ModalWrap from './modalWrap'

export default function PubKeyWrap({ visible, pubkey, close }) {
  return (
    <ModalWrap onClose={close} visible={visible}>
      {visible && <PubKey pubkey={pubkey} close={close} />}
    </ModalWrap>
  )
}

function PubKey({ pubkey, close }) {
  const theme = useTheme()
  function copy() {
    Clipboard.setString(pubkey)
    Toast.showWithGravity('Public Key Copied.', Toast.LONG, Toast.CENTER)
  }
  async function share() {
    try {
      await Share.open({ message: pubkey })
    } catch (e) {}
  }

  return useObserver(() => (
    <Portal.Host>
      <Header title='Public Key' onClose={close} />
      <View style={styles.qrWrap}>
        <QRCode value={pubkey} size={250} />
      </View>
      <Text style={{ ...styles.pubkeyText, color: theme.title }}>{pubkey}</Text>
      <View style={styles.buttonsWrap}>
        <Button mode='contained' dark={true} onPress={() => share()} style={styles.button}>
          Share
        </Button>
        <Button mode='contained' dark={true} style={styles.button} onPress={() => copy()}>
          Copy
        </Button>
      </View>
    </Portal.Host>
  ))
}

const styles = StyleSheet.create({
  qrWrap: {
    display: 'flex',
    flexDirection: 'column',
    padding: 20,
    width: '100%',
    alignItems: 'center',
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
    height: 46,
    borderRadius: 23,
    width: 120,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
})
