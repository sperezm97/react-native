import React from 'react'

import { View, Text, StyleSheet } from 'react-native'

import { useTheme } from '../../../store'

export default function Empty(props) {
  const { text, style, h } = props
  const theme = useTheme()

  const emptyBox = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: h ? h : 100
  }

  return (
    <View style={{ ...styles.wrap, ...style, ...emptyBox }}>
      <Text style={{ color: theme.dark ? theme.white : theme.darkGrey }}>{text}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    flexGrow: 1
  }
})

Empty.defaultProps = {
  text: 'Not Found!'
}
