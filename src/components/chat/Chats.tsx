import React from 'react'
import { View, StyleSheet } from 'react-native'
import { useObserver } from 'mobx-react-lite'

import { useStores, useTheme } from '../../store'
import ChatList from './chatList'
import Search from '../common/Search'
import Header from '../common/Header'
import TabBar from '../common/TabBar'

export default function Chats() {
  const { ui } = useStores()
  const theme = useTheme()

  return useObserver(() => (
    <View style={{ ...styles.main, backgroundColor: theme.bg }} accessibilityLabel='dashboard'>
      <Header />
      <View style={styles.searchWrap}>
        <Search
          placeholder='Search'
          value={ui.searchTerm}
          onChangeText={txt => {
            ui.setSearchTerm(txt)
          }}
        />
      </View>
      <ChatList />
      <TabBar />
    </View>
  ))
}

const styles = StyleSheet.create({
  main: {
    width: '100%',
    flex: 1
  },
  searchWrap: {
    paddingRight: 14,
    paddingLeft: 14,
    marginBottom: 14
  }
})
