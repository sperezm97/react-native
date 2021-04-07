import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import { useTheme } from '../../store'
import BackHeader from './BackHeader'

export default function Security() {
  const theme = useTheme()
  const navigation = useNavigation()

  return (
    <View style={{ ...styles.wrap, backgroundColor: theme.bg }}>
      <BackHeader title='Security' />
      <View style={styles.box}>
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
  box: {
    marginTop: 40,
    paddingRight: 20,
    paddingLeft: 20
  }
})
