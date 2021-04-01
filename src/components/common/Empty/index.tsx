import React from 'react'

import { View, Text, StyleSheet } from 'react-native'

import { useTheme } from '../../../store'

export default function Empty(props) {
  const { text } = props
  const theme = useTheme()

  return (
    <View style={{ ...styles.wrap }}>
      <Text style={{ color: theme.dark ? theme.white : theme.grey }}>{text}</Text>
    </View>
  )
}

Empty.defaultProps = {
  text: 'Not Found!'
}

const styles = StyleSheet.create({
  wrap: {
    flexGrow: 1
  }
})
//
