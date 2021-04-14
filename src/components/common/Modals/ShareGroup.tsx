import React, { useState } from 'react'
import { useObserver } from 'mobx-react-lite'
import { View, Text, StyleSheet } from 'react-native'
import { Button, Portal } from 'react-native-paper'
import Share from 'react-native-share'
import Clipboard from '@react-native-community/clipboard'
import Toast from 'react-native-simple-toast'

import { useStores, useTheme } from '../../../store'
import { DEFAULT_DOMAIN } from '../../../config'
import QRCode from '../../utils/qrcode'
import ModalWrap from './ModalWrap'
import Header from './ModalHeader'

export default function ShareGroup() {
  const { ui, chats } = useStores()
  const theme = useTheme()
  function copy() {
    Clipboard.setString(uuid)
    Toast.showWithGravity('Tribe QR Copied!', Toast.SHORT, Toast.TOP)
  }

  async function share() {
    try {
      await Share.open({ message: uuid })
    } catch (e) {}
  }

  function close() {
    ui.setShareTribeUUID(null)
  }

  const uuid = ui.shareTribeUUID
  const host = chats.getDefaultTribeServer().host
  const qr = `${DEFAULT_DOMAIN}://?action=tribe&uuid=${uuid}&host=${host}`

  return useObserver(() => (
    <ModalWrap visible={ui.shareTribeUUID ? true : false}>
      <Header title='Join Group QR Code' onClose={close} />
      <View style={styles.qrWrap}>
        <QRCode value={qr} size={250} />
      </View>
      <Text style={{ ...styles.pubkeyText, color: theme.subtitle }}>{qr}</Text>
      <View style={styles.buttonsWrap}>
        <Button mode='contained' dark={true} onPress={() => share()} style={styles.button}>
          Share
        </Button>
        <Button mode='contained' dark={true} style={styles.button} onPress={() => copy()}>
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
