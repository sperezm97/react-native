import React, { useState } from 'react'
import { useObserver } from 'mobx-react-lite'
import { StyleSheet, View } from 'react-native'

import { useStores, useTheme } from '../../store'
import Main from './Main'
import Scan from './Scan'
import FadeView from '../utils/fadeView'
import ShowRawInvoice from '../modals/rawInvoiceModal/showRawInvoice'
import { setTint } from '../utils/statusBar'
const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
const basex = require('bs58-rn')
const base58 = basex(ALPHABET)

export default function Send() {
  const { ui, msg, contacts } = useStores()

  const [next, setNext] = useState('')
  const [loading, setLoading] = useState(false)
  const [rawInvoice, setRawInvoice] = useState(null)
  const [amtToPay, setAmtToPay] = useState(null)
  const [err, setErr] = useState('')
  const theme = useTheme()

  const chat = ui.chatForPayModal

  const contact_id = chat && chat.contact_ids && chat.contact_ids.find(cid => cid !== 1)

  async function payLoopout(addy) {
    // gen msg?
    setErr('')
    console.log('PAY LOOPOUT')
    if (amtToPay < 250000) {
      return setErr('Minimum 250000 required')
    }
    if (amtToPay > 16777215) {
      return setErr('Amount too big')
    }
    try {
      const decodedAddy = base58.decode(addy)
      if (!decodedAddy) return setErr('Wrong address format')
      if (decodedAddy.length !== 25) return setErr('Wrong address format')
    } catch (e) {
      return setErr('Wrong address format')
    }
    const text = `/loopout ${addy} ${amtToPay}`
    setLoading(true)
    await msg.sendMessage({
      contact_id: null,
      chat_id: chat.id,
      text,
      amount: amtToPay,
      reply_uuid: ''
    })
    setLoading(false)
    close()
  }
  async function payContactless(addy) {
    if (ui.payMode === 'loopout') {
      payLoopout(addy)
      return
    }
    setLoading(true)
    await msg.sendPayment({
      contact_id: null,
      chat_id: null,
      destination_key: addy,
      amt: amtToPay,
      memo: ''
    })
    setLoading(false)
    close()
  }

  function clearOut() {
    setTimeout(() => {
      setAmtToPay(null)
      setNext('')
      setRawInvoice(null)
    })
  }

  async function sendPayment(amt, text) {
    if (!amt) return
    setLoading(true)
    await msg.sendPayment({
      contact_id: contact_id || null,
      amt,
      chat_id: (chat && chat.id) || null,
      destination_key: '',
      memo: text
    })
    setLoading(false)
    ui.clearPayModal()
  }

  async function confirmOrContinue(amt, text) {
    await sendPayment(amt, text)
    setTimeout(() => setTint('light'), 150)
    clearOut()
  }

  const isLoopout = ui.payMode === 'loopout'
  const hasRawInvoice = rawInvoice ? true : false

  return useObserver(() => {
    return (
      <View style={{ ...styles.wrap, backgroundColor: theme.bg }}>
        <FadeView opacity={next === '' ? 1 : 0} style={styles.content}>
          <Main confirmOrContinue={confirmOrContinue} />
        </FadeView>

        <FadeView opacity={next === 'invoice' ? 1 : 0} style={styles.content}>
          {hasRawInvoice && <ShowRawInvoice amount={rawInvoice.amount} payreq={rawInvoice.invoice} paid={rawInvoice.invoice === ui.lastPaidInvoice} />}
        </FadeView>

        <FadeView opacity={next === 'payment' || next === 'loopout' ? 1 : 0} style={styles.content}>
          <Scan pay={payContactless} loading={loading} isLoopout={isLoopout} error={err} />
        </FadeView>
      </View>
    )
  })
}

const styles = StyleSheet.create({
  wrap: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1
  },
  content: {
    // flex: 1,
    // width: '100%',
    // alignItems: 'center',
    // justifyContent: 'center',
    // position: 'absolute',
    // top: 50
  }
})
