import React, { useEffect, useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { useObserver } from 'mobx-react-lite'
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
import { setTint } from '../common/StatusBar'

export default function Payment() {
  const [scanning, setScanning] = useState(false)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [payments, setPayments] = useState([])

  const { ui, details, chats } = useStores()
  const theme = useTheme()

  function isMsgs(msgs): boolean {
    const m = msgs && msgs.length && msgs[0]
    if (m.message_content || m.message_content === '' || m.message_content === null) {
      // needs this field
      return true
    }
    return false
  }

  useEffect(() => {
    setLoading(true)
    fetchPayments()
    fetchBalance()
    setTimeout(() => {
      setLoading(false)
    }, 400)
  }, [])

  async function fetchBalance() {
    await details.getBalance()
  }
  async function fetchPayments() {
    const ps = await details.getPayments()

    if (!isMsgs(ps)) return
    setPayments(ps)
  }

  async function onRefresh() {
    setRefreshing(true)
    fetchPayments()
    fetchBalance()

    setRefreshing(false)
  }

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
  }

  return useObserver(() => {
    return (
      <View style={{ ...styles.wrap, backgroundColor: theme.bg }}>
        <Header
          onScanClick={() => {
            setTint('dark')
            setScanning(true)
          }}
        />
        <Transactions
          data={payments}
          refreshing={refreshing}
          loading={loading}
          onRefresh={onRefresh}
          listHeader={<ListHeader />}
        />
        <QR
          visible={scanning}
          onCancel={() => {
            setTint(theme.dark ? 'dark' : 'light')
            setScanning(false)
          }}
          confirm={scanningDone}
          showPaster={true}
          inputPlaceholder='Paste Invoice or Subscription code'
        />
        <TabBar />
      </View>
    )
  })
}

const ListHeader = () => {
  const { ui, details, chats } = useStores()
  const theme = useTheme()

  return (
    <>
      <View style={{ ...styles.headerActions }}>
        <View style={styles.wallet}>
          <Typography size={26} fw='500' style={{ marginBottom: 10 }}>
            My Wallet
          </Typography>
          <Typography size={16} fw='500'>
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
        <Typography size={20} style={{ marginLeft: 12, marginBottom: 10 }}>
          Transactions
        </Typography>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1
  },
  headerActions: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    marginTop: 40
    // height: 200,
    // maxHeight: 200,
    // minHeight: 200,
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
    marginVertical: 30
  }
})
