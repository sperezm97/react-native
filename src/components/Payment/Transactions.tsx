import React, { useState, useEffect } from 'react'
import { useObserver } from 'mobx-react-lite'
import { View, StyleSheet, Text, FlatList } from 'react-native'
import { ActivityIndicator, Title } from 'react-native-paper'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import moment from 'moment'

import { useStores, useTheme } from '../../store'
import Empty from '../common/Empty'
import Icon from '../common/Icon'

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
  // const renderItem: any = ({ item, index }: any) => <Payment key={index} {...item} />
  // <FlatList<any> style={{ ...styles.scroller, borderTopColor: theme.border }} data={payments} renderItem={renderItem} keyExtractor={item => String(item.id)} />

  return useObserver(() => (
    <View style={styles.wrap}>
      <Title style={{ ...styles.title, color: theme.text }}>Transactions</Title>
      {!loading && payments.map((item, index) => <Payment key={index} {...item} />)}
      {!loading && payments.length <= 0 && <Empty text='No transactions found' />}
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
  const transactionDate = moment(date).format('dd MMM DD, hh:mm A')

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
    <View style={{ backgroundColor: p.background }}>
      <View style={{ ...styles.paymentBox, borderBottomColor: theme.border }}>
        <View style={{ ...styles.payment }}>
          <MaterialCommunityIcon
            name={p.icon}
            color={p.color}
            size={28}
            style={{ marginLeft: 10 }}
          />
          <View style={styles.mid}>
            <Icon name='Invoice' fill={theme.icon} size={16} />
            <Text style={{ ...styles.contact, color: theme.text }} numberOfLines={1}>
              {text}
            </Text>
          </View>
          <View style={styles.amountWrap}>
            <Text style={{ ...styles.amount, color: theme.text }}>{amount}</Text>
            <Text style={{ ...styles.sat, color: theme.subtitle }}>sat</Text>
          </View>
        </View>
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
          <Text style={{ color: theme.subtitle, fontSize: 12 }}>{transactionDate}</Text>
        </View>
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
    paddingBottom: 14,
    paddingLeft: 14,
    fontSize: 24
  },
  paymentBox: {
    height: 70,
    maxHeight: 70,
    minHeight: 70,
    paddingTop: 14,
    paddingRight: 14,
    borderBottomWidth: 1
  },
  payment: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%'
  },
  mid: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16
  },
  loading: {
    flexGrow: 1,
    width: '100%',
    justifyContent: 'center',
    marginTop: 40
  },
  amountWrap: {
    marginLeft: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  amount: {
    marginRight: 10,
    fontSize: 14
  },
  sat: {
    fontSize: 12,
    fontWeight: '600'
  },
  contact: {
    fontSize: 12,
    marginLeft: 10
  }
})
