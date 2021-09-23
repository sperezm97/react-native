import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { observer } from 'mobx-react-lite'
import { useNavigation } from '@react-navigation/native'

import { useStores, useTheme } from '../../../store'
import BackHeader from '../../common/BackHeader'
import List from './List'
import Typography from '../../common/Typography'
import Empty from '../../common/Empty'
import Search from '../../common/Search'
import { SCREEN_WIDTH } from '../../../constants'
import { MemberListProps } from './Members'
import { styles } from './styles'

const Members = ({ route }) => {
  const { contacts } = useStores()
  const theme = useTheme()
  const navigation = useNavigation()

  const tribe = route.params.tribe

  useEffect(() => {
    contacts.getContacts()
  })

  const contactsToShow = contacts.contacts.filter((c) => {
    return c.id > 1 && tribe && tribe.chat && tribe.chat.contact_ids.includes(c.id)
  })

  return (
    <View style={{ ...styles.wrap, backgroundColor: theme.bg }}>
      <BackHeader title='Members' navigate={() => navigation.goBack()} />
      <MemberList contactsToShow={contactsToShow} tribe={tribe} />
    </View>
  )
}

const MemberList = ({ contactsToShow, tribe }: MemberListProps) => {
  const [membersSearchText, setMembersSearchText] = useState('')

  const searchedContacts = contactsToShow.filter((m) => {
    if (!membersSearchText) return true
    return m.alias.toLowerCase().includes(membersSearchText.toLowerCase())
  })

  if (!contactsToShow || !contactsToShow.length) {
    return <EmptyMembers tribe={tribe} />
  }

  return (
    <View style={styles.content}>
      <List
        tribe={tribe}
        members={searchedContacts}
        listHeader={<ListHeader searchText={membersSearchText} setSearchText={setMembersSearchText} />}
      />
    </View>
  )
}

const ListHeader = ({ searchText, setSearchText }) => {
  return (
    <View style={{ ...styles.searchWrap }}>
      <Search
        // placeholder={`Search ${tribe.name} Members`}
        placeholder='Search'
        onChangeText={(value) => setSearchText(value)}
        value={searchText}
      />
    </View>
  )
}

const EmptyMembers = ({ tribe }) => {
  const theme = useTheme()

  return (
    <Empty w={SCREEN_WIDTH - 100}>
      <Typography color={theme.subtitle} size={14} textAlign='center'>
        {`There are no members in ${tribe.name}.`}
      </Typography>
    </Empty>
  )
}

export default observer(Members)
