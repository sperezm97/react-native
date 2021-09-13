import React, { useEffect } from 'react'
import { Animated } from 'react-native'

import { SCREEN_HEIGHT } from '../../../constants'

function SlideUp(props) {
  const { children } = props

  const appearAnim = new Animated.Value(SCREEN_HEIGHT)

  useEffect(() => {
    Animated.timing(appearAnim, {
      toValue: -SCREEN_HEIGHT,
      duration: 600,
      useNativeDriver: true,
    }).start()
  }, [])

  return (
    <Animated.View
      style={{
        transform: [
          {
            translateY: appearAnim,
          },
        ],
      }}
    >
      {children}
    </Animated.View>
  )
}

export default React.memo(SlideUp)
