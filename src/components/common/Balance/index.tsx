import React from 'react'
import { Text } from 'react-native'

export default function Balance(props) {
  const { color, style, balance } = props

  return <Text style={{ ...style, color: color }}>{balance} sat</Text>
}
