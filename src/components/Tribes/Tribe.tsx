import React, { useState } from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import { useObserver } from 'mobx-react-lite'

import { useStores, useTheme } from '../../store'
import TabBar from '../common/TabBar'
import Header from './Header'
import Search from '../common/Search'
import TribesList from './TribesList'

export default function Tribe() {
  const { ui } = useStores()
  const theme = useTheme()

  const onTribesSearch = (txt: string) => ui.setTribesSearchTerm(txt)

  return useObserver(() => (
    <View style={{ ...styles.wrap, backgroundColor: theme.bg }}>
      <Header />
      <View style={styles.searchWrap}>
        <Search placeholder='Search' value={ui.tribesSearchTerm} onChangeText={onTribesSearch} h={50} />
      </View>
    </View>
  ))
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1
  },
  searchWrap: {
    paddingTop: 18,
    paddingBottom: 18,
    paddingRight: 14,
    paddingLeft: 14
  }
})
