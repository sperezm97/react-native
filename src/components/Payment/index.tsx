import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

import { useStores, useTheme } from '../../store/'
import TabBar from '../common/TabBar'
import Header from './Header'
import Transactions from './Transactions'
import Button from '../common/Button'

export default function Payment() {
  const { details, ui } = useStores()
  const theme = useTheme()

  return (
    <View style={{ ...styles.wrap, backgroundColor: theme.bg }}>
      <Header />
      <View style={{ ...styles.headerActions }}>
        <View style={styles.wallet}>
          <Text style={{ marginBottom: 10, fontSize: 26, fontWeight: '500', color: theme.title }}>My Wallet</Text>
          <Text style={{ fontSize: 16, color: theme.title }}>
            {details.balance} <Text style={{ color: theme.subtitle }}>sat</Text>
          </Text>
        </View>
        <View style={styles.buttonWrap}>
          <Button mode='outlined' icon='arrow-top-right' style={{ width: 130, borderColor: theme.border }} btnHeight={45} onPress={() => ui.setPayMode('payment', null)}>
            SEND
          </Button>
          <Button mode='outlined' icon='arrow-bottom-left' style={{ width: 130, borderColor: theme.border, borderLeftWidth: 0 }} btnHeight={45} onPress={() => ui.setPayMode('invoice', null)}>
            RECEIVE
          </Button>
        </View>
      </View>
      <Transactions />
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
