import React from 'react'
import { StyleSheet, View } from 'react-native'
import { useObserver } from 'mobx-react-lite'

import { useTheme } from 'store'
import TabBar from '../common/TabBar'
import Header from './Header'
import OwnedTribes from './OwnedTribes'

export default function Tribes() {
  const theme = useTheme()

  return useObserver(() => {
    return (
      <View style={{ ...styles.wrap, backgroundColor: theme.bg }}>
        <Header />
        <OwnedTribes />
        <TabBar />
      </View>
    )
  })
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
  },
  searchWrap: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 14,
    paddingLeft: 14,
  },
})
