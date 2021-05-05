import React from 'react'
import { Text } from 'react-native'

import { useTheme } from '../../../store'

export default function Typography(props) {
  const theme = useTheme()

  let {
    children,
    style,
    color = theme.text,
    size,
    fw,
    ls = 0.5,
    lh,
    numberOfLines,
    onPress
  } = props

  let lineHeight = 20
  if (size >= 15 && size < 20) {
    lineHeight = 26
  } else if (size >= 20) {
    lineHeight = 40
  } else {
    lineHeight = 20
  }

  return (
    <Text
      onPress={onPress}
      style={{
        ...style,
        color,
        fontSize: size,
        fontWeight: fw,
        letterSpacing: ls,
        lineHeight: lh ? lh : lineHeight
      }}
      numberOfLines={numberOfLines}
    >
      {children}
    </Text>
  )
}

Typography.defaultProps = {}
