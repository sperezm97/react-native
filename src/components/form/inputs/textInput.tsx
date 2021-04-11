import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { TextInput } from 'react-native-paper'

import { useTheme } from '../../../store'

export default function TheTextInput({ mode, name, label, required, error, handleChange, handleBlur, value, displayOnly, accessibilityLabel, multiline, numberOfLines, style }) {
  const theme = useTheme()
  let lab = `${label.en}${required ? ' *' : ''}`
  if (error) {
    lab = `${label.en} - ${error}`
  }

  if (displayOnly) lab = label.en

  let inputStyles = null
  if (!multiline) {
    inputStyles = {
      height: 50,
      maxHeight: 50
    }
  }

  return (
    <>
      <Text style={{ color: theme.text }}>{lab}</Text>
      <TextInput
        mode={mode}
        accessibilityLabel={accessibilityLabel}
        error={error}
        style={{ ...styles.inputStyles, ...style, backgroundColor: theme.bg, ...inputStyles }}
        onChangeText={handleChange(name)}
        onBlur={handleBlur(name)}
        value={value}
        placeholderTextColor={theme.placeholder}
        underlineColor={theme.border}
        multiline={multiline}
        numberOfLines={numberOfLines}
        textAlignVertical='auto'
      />
    </>
  )
}

TheTextInput.defaultProps = {
  mode: 'flat',
  handleBlur: () => {},
  error: false,
  displayOnly: false,
  required: false,
  style: null,
  multiline: false,
  numberOfLines: 0
}

const styles = StyleSheet.create({
  inputStyles: {
    marginBottom: 25
  }
})
