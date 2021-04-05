import React from 'react'
import { View, StyleSheet } from 'react-native'
import { useObserver } from 'mobx-react-lite'

import { useStores, useTheme } from '../../store'
import ChatList from '../chat/chatList'
import Search from '../common/Search'
// import BottomBar from './bottomBar'
import TabBar from '../common/TabBar'

export default function Dashboard() {
  const { ui } = useStores()
  const theme = useTheme()

  return useObserver(() => (
    <View style={{ ...styles.main, backgroundColor: theme.bg }} accessibilityLabel='dashboard'>
      <Search
        placeholder='Search'
        value={ui.searchTerm}
        onChangeText={txt => {
          ui.setSearchTerm(txt)
        }}
      />
      <ChatList />
      <TabBar />
    </View>
  ))
}

const styles = StyleSheet.create({
  main: {
    width: '100%',
    flex: 1
  }
})
