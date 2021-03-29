import React from 'react'
import { View, StyleSheet, Image } from 'react-native'
import { ActivityIndicator } from 'react-native-paper'

import { useTheme } from '../../../store'

export default function Loading() {
  const theme = useTheme()

  return (
    <View style={{ ...styles.wrap, backgroundColor: theme.bg }}>
      <View style={styles.content}>
        <Image source={require('../../../assets/n2n2.png')} style={{ width: 120, height: 120 }} resizeMode={'contain'} />
        <Image source={require('../../../assets/n2n2-text.png')} style={{ width: 120, height: 120 }} resizeMode={'contain'} />
      </View>
      <View style={styles.spinWrap}>
        <ActivityIndicator animating={true} color={theme.grey} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  spinWrap: {
    height: 20,
    marginTop: 133,
    marginBottom: 150
  }
})
