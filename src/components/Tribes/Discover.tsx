import React from 'react'
import { StyleSheet, View } from 'react-native'
import { useObserver } from 'mobx-react-lite'
import { useNavigation } from '@react-navigation/native'
import { IconButton } from 'react-native-paper'

import { useStores, useTheme, hooks } from '../../store'
import { useSearchTribes } from '../../store/hooks/tribes'
import BackHeader from '../common/BackHeader'
import Pushable from '../common/Pushable'
import Search from '../common/Search'
import List from './List'

const { useTribes } = hooks

export default function Discover() {
  const { ui } = useStores()
  const theme = useTheme()
  const navigation = useNavigation()

  const onTribesSearch = (txt: string) => ui.setTribesSearchTerm(txt)

  return useObserver(() => {
    const tribes = useTribes()
    const tribesToShow = useSearchTribes(tribes)

    return (
      <View style={{ ...styles.wrap, backgroundColor: theme.bg }}>
        <BackHeader title='Discover' navigate={() => navigation.goBack()} action={<HeaderAction />} />
        <View style={styles.searchWrap}>
          <Search placeholder='Search Communities' value={ui.tribesSearchTerm} onChangeText={onTribesSearch} h={45} />
        </View>
        <List data={tribesToShow} />
      </View>
    )
  })
}

function HeaderAction() {
  const { ui } = useStores()
  const theme = useTheme()

  return (
    <Pushable onPress={() => ui.setNewTribeModal(true)}>
      <IconButton icon='plus' color={theme.primary} size={24} style={{ backgroundColor: theme.lightGrey }} />
    </Pushable>
  )
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1
  },
  searchWrap: {
    paddingBottom: 10,
    paddingRight: 14,
    paddingLeft: 14
  }
})
