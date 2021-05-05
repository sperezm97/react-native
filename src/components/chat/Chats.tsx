import React from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { useObserver } from 'mobx-react-lite'
import { useNavigation } from '@react-navigation/native'
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'

import { useStores, useTheme } from '../../store'
import ChatList from './chatList'
import Search from '../common/Search'
import Header from '../common/Header'
import TabBar from '../common/TabBar'
import Button from '../common/Button'

export default function Chats() {
  const { ui } = useStores()
  const theme = useTheme()

  return useObserver(() => (
    <View
      style={{ ...styles.main, backgroundColor: theme.bg }}
      accessibilityLabel='dashboard'
    >
      <Header />
      <View style={{ ...styles.searchWrap }}>
        <Search
          placeholder='Search'
          value={ui.searchTerm}
          onChangeText={txt => {
            ui.setSearchTerm(txt)
          }}
          h={45}
          style={{ width: '100%' }}
        />
      </View>
      <ChatList listHeader={<ListHeader />} />
      <TabBar />
    </View>
  ))
}

function ListHeader() {
  const { ui } = useStores()
  const theme = useTheme()
  const navigation = useNavigation()

  const onAddFriendPress = () => ui.setAddFriendDialog(true)

  return (
    <View style={{ ...styles.listHeader }}>
      <TouchableOpacity
        onPress={() => navigation.navigate('Contacts')}
        activeOpacity={0.6}
      >
        <Button mode='text' fs={13}>
          Contacts
        </Button>
      </TouchableOpacity>
      <TouchableOpacity onPress={onAddFriendPress} activeOpacity={0.6}>
        <Button
          mode='text'
          icon={() => <MaterialIcon name='plus' color={theme.primary} size={16} />}
          fs={13}
        >
          Add Friend
        </Button>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  main: {
    width: '100%',
    flex: 1
  },
  listHeader: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingBottom: 10
  },
  searchWrap: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingRight: 14,
    paddingLeft: 14,
    paddingBottom: 10
  }
})
