import React, { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { useObserver } from 'mobx-react-lite'

import { useStores, useTheme, hooks } from '../../store'
import { useSearchTribes } from '../../store/hooks/tribes'
import TabBar from '../common/TabBar'
import Header from './Header'
import Search from '../common/Search'
import List from './List'

const { useTribes } = hooks

export default function Tribes() {
  const [loading, setLoading] = useState(true)
  const { chats } = useStores()
  const theme = useTheme()

  useEffect(() => {
    chats.getTribes().then(() => setLoading(false))
  }, [])

  return useObserver(() => {
    const tribes = useTribes()
    const tribesToShow = useSearchTribes(tribes)

    return (
      <View style={{ ...styles.wrap, backgroundColor: theme.bg }}>
        <Header />
        <List data={tribesToShow} loading={loading} listHeader={<ListHeader />} />
        <TabBar />
      </View>
    )
  })
}

function ListHeader() {
  const theme = useTheme()
  const { ui, chats } = useStores()

  const onTribesSearch = (txt: string) => ui.setTribesSearchTerm(txt)

  return (
    <View style={styles.searchWrap}>
      <Search
        placeholder='Search Communities'
        value={ui.tribesSearchTerm}
        onChangeText={onTribesSearch}
        h={45}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1
  },
  searchWrap: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 14,
    paddingLeft: 14
  }
})
