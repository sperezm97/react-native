import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'

import { useStores, useTheme } from '../../store'
import * as utils from '../utils/utils'
import { qrActions } from '../../qrActions'
import { isLN, parseLightningInvoice, removeLightningPrefix } from '../utils/ln'
import TabBar from '../common/TabBar'
import Header from './Header'
import Transactions from './Transactions'
import Button from '../common/Button'
import QR from '../common/Accessories/QR'
import Typography from '../common/Typography'

export default function Payment() {
  const [scanning, setScanning] = useState(false)

  const { ui, details, chats } = useStores()
  const theme = useTheme()

  async function scanningDone(data) {
    if (isLN(data)) {
      const theData = removeLightningPrefix(data)
      const inv = parseLightningInvoice(data)
      if (!(inv && inv.human_readable_part && inv.human_readable_part.amount)) return
      const millisats = parseInt(inv.human_readable_part.amount)
      const sats = millisats && Math.round(millisats / 1000)
      setScanning(false)

      setTimeout(() => {
        ui.setConfirmInvoiceMsg({ payment_request: theData, amount: sats })
      }, 150)
    }

    // else if (data.startsWith('n2n2.chat://')) {
    //   const j = utils.jsonFromUrl(data)
    //   setScanning(false)
    //   setTimeout(async () => {
    //     await qrActions(j, ui, chats)
    //   }, 150)
    // } else if (data.startsWith('action=donation')) {
    //   // this should be already
    //   const nd = 'n2n2.chat://?' + data
    //   const j = utils.jsonFromUrl(nd)
    //   setScanning(false)
    //   setTimeout(async () => {
    //     await qrActions(j, ui, chats)
    //   }, 150)
    // }
  }

  return (
    <View style={{ ...styles.wrap, backgroundColor: theme.bg }}>
      <Header onScanClick={() => setScanning(true)} />
      <ScrollView>
        <View style={{ ...styles.headerActions }}>
          <View style={styles.wallet}>
            <Typography
              size={26}
              fw='500'
              color={theme.text}
              style={{ marginBottom: 10 }}
            >
              My Wallet
            </Typography>
            <Typography size={16} fw='500' color={theme.text}>
              {details.balance} <Typography color={theme.subtitle}> sat</Typography>
            </Typography>
          </View>
          <View style={styles.buttonWrap}>
            <Button
              mode='outlined'
              icon='arrow-bottom-left'
              w={130}
              h={45}
              round={0}
              style={{ borderColor: theme.border }}
              onPress={() => ui.setPayMode('invoice', null)}
            >
              RECEIVE
            </Button>
            <Button
              mode='outlined'
              icon='arrow-top-right'
              w={130}
              h={45}
              round={0}
              style={{ borderColor: theme.border, borderLeftWidth: 0 }}
              onPress={() => ui.setPayMode('payment', null)}
            >
              SEND
            </Button>
          </View>
        </View>
        <Transactions />
      </ScrollView>
      <QR
        visible={scanning}
        onCancel={() => setScanning(false)}
        confirm={scanningDone}
        showPaster={true}
        inputPlaceholder='Paste Invoice or Subscription code'
      />
      <TabBar />
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1
  },
  headerActions: {
    width: '100%',
    height: 250,
    maxHeight: 250,
    minHeight: 250,
    display: 'flex',
    justifyContent: 'center'
  },
  wallet: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonWrap: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // justifyContent: 'space-between',
    // width: 200,
    // marginRight: 'auto',
    // marginLeft: 'auto',
    paddingTop: 30
  }
})
