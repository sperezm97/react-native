import React from 'react'
import { StyleSheet, View, Text } from 'react-native'

import BackHeader from './BackHeader'

export default function Security() {
  return (
    <View style={styles.wrap}>
      <BackHeader title='Security' />
      <View style={styles.content}>
        <Text style={{ fontSize: 18 }}>Security</Text>
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
