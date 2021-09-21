import React, { useState, useEffect } from 'react'
import { Animated } from 'react-native'

export default function Fade(props) {
  const [fadeAnim] = useState(new Animated.Value(props.opacity)) // Initial value for opacity: 0
  const [hide, setHide] = useState(props.opacity === 0)

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: props.opacity,
      duration: props.duration || 100,
      useNativeDriver: true,
    }).start()
    if (props.opacity > 0 && hide) setHide(false)
    if (props.opacity === 0 && !hide) setHide(true)
  }, [props.opacity])

  if (hide) return <></>
  return (
    <Animated.View
      style={{
        ...props.style,
        opacity: fadeAnim,
      }}
    >
      {props.children}
    </Animated.View>
  )
}
