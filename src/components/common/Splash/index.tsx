import React from 'react'
import { View, StyleSheet, Image } from 'react-native'

import { useTheme } from '../../../store'
import Wobble from '../Animations/Wobble'

export default function Splash() {
  const theme = useTheme()
  const dark = theme?.dark ?? false
  return (
    <View
      style={{
        ...styles.wrap,
        backgroundColor: dark ? '#141d26' : '#fff',
        // backgroundColor: dark ? theme.mirage : theme.white,
      }}
    >
      <Wobble>
        <Image
          source={require('../../../assets/n2n2.png')}
          style={{ width: 140, height: 140 }}
          resizeMode={'contain'}
        />
      </Wobble>

      <Image
        source={dark ? require('../../../assets/zion-dark-theme.png') : require('../../../assets/zion.png')}
        style={{ width: 120, height: 120 }}
        resizeMode={'contain'}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
