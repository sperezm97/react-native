import React from 'react'
import { useObserver } from 'mobx-react-lite'
import { View, StyleSheet } from 'react-native'
import { IconButton } from 'react-native-paper'

import { useStores, useTheme } from '../../store'
import ContactList from './contactList'
import Search from '../common/Search'

export default function Contacts() {
  const { ui } = useStores()
  const setAddFriendModalHandler = () => ui.setAddFriendModal(true)
  const onChangeTextHandler = (txt: string) => ui.setContactsSearchTerm(txt)
  const theme = useTheme()

  return useObserver(() => (
    <View style={{ ...styles.main, backgroundColor: theme.bg }}>
      <View style={{ ...styles.searchWrap, backgroundColor: theme.bg }}>
        <View style={{ ...styles.searchBarWrap }}>
          <Search placeholder='Search Contacts' onChangeText={onChangeTextHandler} value={ui.contactsSearchTerm} />
        </View>
        <View style={styles.iconWrap}>
          <IconButton icon='account-plus' color={theme.icon} size={20} onPress={setAddFriendModalHandler} />
        </View>
      </View>
      <ContactList />
    </View>
  ))
}

const styles = StyleSheet.create({
  main: {
    flex: 1
  },
  searchWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },
  searchBarWrap: {
    flex: 1
  },
  iconWrap: {
    width: 50,
    marginLeft: 5
  }
})
