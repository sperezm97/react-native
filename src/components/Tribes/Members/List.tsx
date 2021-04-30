import React, { useState } from 'react'
import { StyleSheet, View, FlatList, ScrollView } from 'react-native'
import { useObserver } from 'mobx-react-lite'
import { useNavigation } from '@react-navigation/native'

import { useStores, useTheme } from '../../../store'
import { constants } from '../../../constants'
import { Contact, DeletableContact, PendingContact } from './Items'
import Typography from '../../common/Typography'

export default function List({ tribe, members }) {
  const { chats } = useStores()

  async function onKickContact(cid) {
    await chats.kick(tribe.id, cid)
  }

  const renderItem: any = ({ item, index }: any) => {
    if (tribe.owner) {
      return <DeletableContact key={index} contact={item} onDelete={onKickContact} />
    }
    return <Contact key={index} contact={item} unselectable={true} />
  }

  return useObserver(() => {
    return (
      <FlatList
        style={styles.wrap}
        data={members}
        renderItem={renderItem}
        keyExtractor={item => String(item.id)}
      />
    )
  })
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    position: 'relative'
  }
})
