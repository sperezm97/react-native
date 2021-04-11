import React from 'react'
import { View, StyleSheet, Image } from 'react-native'

import { useTheme } from '../../../store'

export default function Splash() {
  const theme = useTheme()

  return (
    <View style={{ ...styles.wrap, backgroundColor: theme.bg }}>
      <Image source={require('../../../assets/n2n2.png')} style={{ width: 120, height: 120 }} resizeMode={'contain'} />
      <Image source={require('../../../assets/n2n2-text.png')} style={{ width: 120, height: 120 }} resizeMode={'contain'} />
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
})
