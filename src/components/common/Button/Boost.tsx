import React, { useRef } from 'react'
import { StyleSheet, View, Animated } from 'react-native'
import { TouchableRipple } from 'react-native-paper'
import Ionicon from 'react-native-vector-icons/Ionicons'

import { useTheme } from '../../../store'
import CustomIcon from '../../utils/customIcons'

export default function Boost({ onPress }) {
  const theme = useTheme()
  const size = useRef(new Animated.Value(1)).current

  function go() {
    Animated.sequence([
      Animated.timing(size, {
        toValue: 1.5,
        duration: 75,
        useNativeDriver: true
      }),
      Animated.timing(size, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true
      })
    ]).start()
    onPress()
  }

  return (
    <TouchableRipple
      style={styles.rocketWrap}
      rippleColor={theme.accent}
      onPress={go}
      borderless
    >
      <View style={{ ...styles.circle, backgroundColor: theme.primary }}>
        <Animated.View
          style={{
            transform: [{ scale: size }]
          }}
        >
          <Ionicon name='rocket-outline' color={theme.white} size={20} />
        </Animated.View>
      </View>
    </TouchableRipple>
  )
}

const styles = StyleSheet.create({
  rocketWrap: {
    height: 55,
    width: 55,
    borderRadius: 50,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  circle: {
    height: 35,
    width: 35,
    borderRadius: 50,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  }
})
