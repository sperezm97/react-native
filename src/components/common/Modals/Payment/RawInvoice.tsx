import React from 'react'
import { View, Text, StyleSheet, Dimensions, Modal } from 'react-native'
import Share from 'react-native-share'
import Clipboard from '@react-native-community/clipboard'
import Toast from 'react-native-simple-toast'

import { useTheme } from '../../../../store'
import { TOAST_DURATION } from '../../../../constants'
import ModalWrap from '../ModalWrap'
import ModalHeader from '../ModalHeader'
import QRCode from '../../../utils/qrcode'
import Button from '../../Button'

export default function RawInvoice({ visible, onClose, amount, payreq, paid }) {
  const theme = useTheme()

  function copy() {
    Clipboard.setString(payreq)
    Toast.showWithGravity('Payment Request Copied', TOAST_DURATION, Toast.CENTER)
  }

  async function share() {
    try {
      await Share.open({ message: payreq })
    } catch (e) {}
  }

  const { height, width } = Dimensions.get('window')
  const h = height - 280

  return (
    <ModalWrap visible={visible} nopad animationIn={'slideInRight'} animationOut={'slideOutRight'} swipeDirection='right' hasBackdrop={false}>
      <ModalHeader title='Payment Request' onClose={onClose} />
      <View style={{ ...styles.innerWrap }}>
        {amount && (
          <View style={styles.amtWrap}>
            <Text style={{ fontSize: 16, color: theme.title, marginBottom: 12 }}>{`Amount: ${amount} sats`}</Text>
          </View>
        )}
        <View style={styles.qrWrap}>
          <QRCode value={payreq} size={720} />
          {paid && (
            <View style={styles.paidWrap}>
              <Text style={styles.paid}>PAID</Text>
            </View>
          )}
        </View>
        <Text style={{ ...styles.payreqText, color: theme.title }}>{payreq}</Text>
        <View style={styles.buttonsWrap}>
          <Button onPress={() => share()} style={styles.button}>
            Share
          </Button>
          <Button onPress={() => copy()} style={styles.button}>
            Copy
          </Button>
        </View>
      </View>
    </ModalWrap>
  )
}

const styles = StyleSheet.create({
  innerWrap: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
  },
  amtWrap: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  qrWrap: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    alignItems: 'center',
    marginTop: 5,
    position: 'relative'
  },
  payreqText: {
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 40,
    marginBottom: 20,
    width: '100%',
    flexWrap: 'wrap'
  },
  buttonsWrap: {
    marginTop: 20,
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
  },
  paidWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1001
  },
  paid: {
    color: '#55D1A9',
    borderWidth: 4,
    height: 41,
    width: 80,
    borderColor: '#55D1A9',
    backgroundColor: 'white',
    fontWeight: 'bold',
    fontSize: 28,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center'
  }
})
