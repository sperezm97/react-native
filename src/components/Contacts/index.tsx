import React from 'react'
import { StyleSheet, View } from 'react-native'
import { useObserver } from 'mobx-react-lite'
import { IconButton } from 'react-native-paper'
import AntDesign from 'react-native-vector-icons/AntDesign'

import { useStores, useTheme } from '../../store'
import ContactList from './ContactList'
import BackHeader from '../common/BackHeader'
import Search from '../common/Search'

export default function Contacts() {
  const { ui } = useStores()
  const theme = useTheme()

  const setAddFriendModalHandler = () => ui.setAddFriendDialog(true)
  const onChangeTextHandler = (txt: string) => ui.setContactsSearchTerm(txt)

  const AddContact = <IconButton icon={({ size, color }) => <AntDesign name='adduser' color={color} size={size} />} color={theme.primary} size={22} onPress={setAddFriendModalHandler} />

  return useObserver(() => (
    <View style={{ ...styles.wrap, backgroundColor: theme.bg }}>
      <BackHeader title='Contacts' action={AddContact} />
      <View style={{ ...styles.content }}>
        <View style={{ ...styles.searchWrap }}>
          <Search placeholder='Search Contacts' onChangeText={onChangeTextHandler} value={ui.contactsSearchTerm} />
        </View>
        <ContactList />
      </View>
    </View>
  ))
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1
  },
  content: {
    flex: 1
  },
  searchWrap: {
    paddingRight: 14,
    paddingLeft: 14,
    marginBottom: 14
  }
})
