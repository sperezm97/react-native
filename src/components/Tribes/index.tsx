import React, { useState } from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'

import { useStores, useTheme } from '../../store'
import TabBar from '../common/TabBar'
import Header from './Header'
import TribesList from './TribesList'

export default function Tribes() {
  const theme = useTheme()

  return (
    <View style={{ ...styles.wrap, backgroundColor: theme.bg }}>
      <Header />
      <ScrollView>
        <View style={{ ...styles.content, backgroundColor: theme.bg }}>
          <TribesList />
        </View>
      </ScrollView>
      <TabBar />
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1
  },
  content: {
    flex: 1,
    paddingTop: 18,
    paddingRight: 18,
    paddingLeft: 18
  }
})
