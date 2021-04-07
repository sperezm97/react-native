import React from 'react'
import { StyleSheet, View, Text } from 'react-native'

import TabBar from '../common/TabBar'
import Header from '../common/Header'

export default function Home() {
  return (
    <View style={styles.wrap}>
      <Header />
      <View style={styles.content}>
        <Text style={{ fontSize: 18 }}>Feed</Text>
      </View>
      <TabBar />
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    flex: 1
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
})
