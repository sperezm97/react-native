import React from 'react'
import { Text } from 'react-native'

import { useTheme } from '../../../store'

export default function Typography(props) {
  const theme = useTheme()

  let { children, style, color = theme.text, size, fw, ls = 0.5, lh } = props

  if (size >= 15 && size < 20) {
    lh = 26
  } else if (size >= 20) {
    lh = 40
  } else {
    lh = 20
  }

  return <Text style={{ ...style, color, fontSize: size, fontWeight: fw, letterSpacing: ls, lineHeight: lh }}>{children}</Text>
}

Typography.defaultProps = {}
