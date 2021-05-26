import React from 'react'
import { useObserver } from 'mobx-react-lite'
import { StyleSheet, View } from 'react-native'
import Share from 'react-native-share'
import Clipboard from '@react-native-community/clipboard'
import Toast from 'react-native-simple-toast'
import QRCode from 'react-native-qrcode-svg'

import { useTheme } from '../../../store'
import { SCREEN_WIDTH, TOAST_DURATION } from '../../../constants'
import ModalWrap from './ModalWrap'
import ModalHeader from './ModalHeader'
import Button from '../Button'
import Empty from '../Empty'
import Typography from '../Typography'

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

      <View style={styles.wrap}>
        <View
          style={{
            ...styles.content
          }}
        >
          {pubkey && <QRCode value={pubkey} size={SCREEN_WIDTH / 1.3} />}
          {!pubkey && <Empty text='No Public Address found' h={30} />}
          <Typography color={theme.title} style={{ marginTop: 40 }}>
            {pubkey}
          </Typography>
          {pubkey && (
            <View style={styles.buttonsWrap}>
              <Button onPress={() => share()} w={120}>
                Share
              </Button>
              <Button onPress={() => copy()} w={120}>
                Copy
              </Button>
            </View>
          )}
        </View>
      </View>
    </ModalWrap>
  ))
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    paddingTop: 20
  },
  content: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: SCREEN_WIDTH / 1.3
  },
  buttonsWrap: {
    marginTop: 40,
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between'
  }
})