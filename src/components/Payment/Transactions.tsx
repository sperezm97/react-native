import React from 'react'
import { StyleSheet, View, FlatList } from 'react-native'
import { useObserver } from 'mobx-react-lite'
import { ActivityIndicator } from 'react-native-paper'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import moment from 'moment'

import { useStores, useTheme } from '../../store'
import Empty from '../common/Empty'
import Icon from '../common/Icon'
import RefreshLoading from '../common/RefreshLoading'
import Typography from '../common/Typography'

export default function Transactions(props) {
  const { data, refreshing, loading, onRefresh, listHeader } = props

  const renderItem: any = ({ item, index }: any) => <Payment key={index} {...item} />

  return useObserver(() => (
    <View style={styles.wrap}>
      {loading ? (
        <View style={{ paddingTop: 20 }}>
          <ActivityIndicator />
        </View>
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          data={data}
          keyExtractor={item => String(item.id)}
          renderItem={renderItem}
          ListHeaderComponent={listHeader}
          ListEmptyComponent={<ListEmpty />}
          refreshing={refreshing}
          onRefresh={onRefresh && onRefresh}
          refreshControl={
            <RefreshLoading refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  ))
}

function ListEmpty() {
  return <Empty text='No transactions found' />
}

function Payment(props) {
  const { user, contacts, chats } = useStores()
  const theme = useTheme()
  const { amount, date, sender, chat_id } = props
  const transactionDate = moment(date).format('dd MMM DD, hh:mm A')
  const myid = user.myid

  const type = sender === myid ? 'payment' : 'invoice'
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
      const oid = chat.contact_ids.find(id => id !== myid)
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
            <Icon name='Invoice' fill={theme.icon} size={14} />
            <Typography style={{ marginLeft: 10 }} numberOfLines={1}>
              {text}
            </Typography>
          </View>
          <View style={styles.amountWrap}>
            <Typography
              size={14}
              style={{
                marginRight: 10
              }}
            >
              {amount}
            </Typography>
            <Typography fw='600' color={theme.subtitle}>
              sat
            </Typography>
          </View>
        </View>
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
          <Typography color={theme.subtitle} size={12}>
            {transactionDate}
          </Typography>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1
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
  contact: {}
})
