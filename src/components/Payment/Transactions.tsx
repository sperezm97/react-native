import React, { useState, useEffect } from 'react'
import { useObserver } from 'mobx-react-lite'
import { View, StyleSheet, Text, FlatList } from 'react-native'
import { ActivityIndicator, Title } from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import { useStores, useTheme } from '../../store'
import Empty from '../common/Empty'

export default function Transactions() {
  const { details } = useStores()
  const theme = useTheme()
  const [loading, setLoading] = useState(true)
  const [payments, setPayments] = useState([])

  function isMsgs(msgs): boolean {
    const m = msgs && msgs.length && msgs[0]
    if (m.message_content || m.message_content === '' || m.message_content === null) {
      // needs this field
      return true
    }
    return false
  }

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      const ps = await details.getPayments()

      setLoading(false)
      if (!isMsgs(ps)) return
      setPayments(ps)
    })()
  }, [])

  /**
   * renderItem component
   * @param {object} item - item object getting from map payment array
   * @param {number} index - index of item in the array
   */
  const renderItem: any = ({ item, index }: any) => <Payment key={index} {...item} />

  return useObserver(() => (
    <View style={styles.wrap}>
      <Title style={{ ...styles.title, color: theme.text }}>Payment History</Title>
      {!loading && <FlatList<any> style={{ ...styles.scroller, borderTopColor: theme.border }} data={payments} renderItem={renderItem} keyExtractor={item => String(item.id)} />}
      {!loading && payments.length <= 0 && <Empty text='No transactions found' style={{ alignItems: 'center' }} />}
      {loading && (
        <View style={styles.loading}>
          <ActivityIndicator animating color={theme.darkGrey} />
        </View>
      )}
    </View>
  ))
}

function Payment(props) {
  const { contacts, chats } = useStores()
  const theme = useTheme()
  const { amount, date, sender, chat_id } = props
  const type = sender === 1 ? 'payment' : 'invoice'
  const params = {
    payment: {
      icon: 'arrow-top-right',
      color: '#FFA292',
      background: theme.bg
    },
    invoice: {
      icon: 'arrow-bottom-left',
      color: '#94C4FF',
      background: theme.main
    }
  }

  let text = '-'
  if (type === 'payment') {
    const chat = chats.chats.find(c => c.id === chat_id)
    if (chat && chat.name) text = chat.name
    if (chat && chat.contact_ids && chat.contact_ids.length === 2) {
      const oid = chat.contact_ids.find(id => id !== 1)
      const contact = contacts.contacts.find(c => c.id === oid)
      if (contact) text = contact.alias || contact.public_key
    }
  } else {
    const contact = contacts.contacts.find(c => c.id === sender)
    if (contact) text = contact.alias || contact.public_key
    if (!contact) text = 'Unknown'
  }

  const p = params[type]
  return (
    <View style={{ ...styles.payment, backgroundColor: p.background, borderBottomColor: theme.border }}>
      <Icon name={p.icon} color={p.color} size={32} style={{ marginLeft: 10 }} />
      <View style={styles.mid}>
        <Icon name='message-text-outline' color='#bbb' size={18} style={{ marginLeft: 15 }} />
        <Text style={{ ...styles.contact, color: theme.subtitle }} numberOfLines={1}>
          {text}
        </Text>
      </View>
      <View style={styles.amountWrap}>
        <Text style={{ ...styles.amount, color: theme.title }}>{amount}</Text>
        <Text style={styles.sat}>sat</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    paddingBottom: 40
  },
  title: {
    paddingBottom: 10,
    paddingLeft: 16,
    fontSize: 24
  },
  scroller: {
    // flexGrow: 1,
    // width: '100%',
    // overflow: 'scroll',
    // flexDirection: 'column',
    // borderTopWidth: 1
  },
  payment: {
    width: '100%',
    height: 55,
    maxHeight: 55,
    minHeight: 55,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1
  },
  mid: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  loading: {
    flexGrow: 1,
    width: '100%',
    justifyContent: 'center',
    marginTop: 40
  },
  amountWrap: {
    marginRight: 10,
    marginLeft: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  amount: {
    marginRight: 10,
    fontSize: 14,
    fontWeight: 'bold'
  },
  sat: {
    marginRight: 10,
    color: '#aaa',
    fontSize: 12
  },
  contact: {
    fontSize: 12,
    marginLeft: 10
  }
})
