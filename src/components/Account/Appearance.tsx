import React from 'react'
import { StyleSheet, View, Text } from 'react-native'

import TabBar from '../common/TabBar'
import Header from '../common/Header'

export default function Network() {
  return (
    <View style={styles.wrap}>
      {/* <Header /> */}
      <View style={styles.content}>
        <Text style={{ fontSize: 18 }}>Apearance</Text>
      </View>
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
