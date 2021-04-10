import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { TextInput } from 'react-native-paper'

import { inputStyles } from './shared'

import { useTheme } from '../../../store'

export default function TheTextInput({ name, label, required, error, handleChange, handleBlur, value, displayOnly, accessibilityLabel }) {
  const theme = useTheme()
  let lab = `${label.en}${required ? ' *' : ''}`
  if (error) {
    lab = `${label.en} - ${error}`
  }

  if (displayOnly) lab = label.en

  return (
    <>
      <Text style={{ color: theme.text }}>{lab}</Text>
      <TextInput
        accessibilityLabel={accessibilityLabel}
        error={error}
        style={{ ...styles.inputStyles, backgroundColor: theme.bg }}
        onChangeText={handleChange(name)}
        onBlur={handleBlur(name)}
        value={value}
        placeholderTextColor={theme.placeholder}
        underlineColor={theme.border}
      />
    </>
  )
}

const styles = StyleSheet.create({
  inputStyles: {
    height: 50,
    maxHeight: 50,
    marginBottom: 25
  }
})
