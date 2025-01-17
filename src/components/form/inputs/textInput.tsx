import React from 'react'
import { StyleSheet } from 'react-native'
import { TextInput } from 'react-native-paper'

import { useTheme } from '../../../store'
import InputAccessoryView from '../../common/Accessories/InputAccessoryView'
import Typography from '../../common/Typography'

export default function TheTextInput({
  mode,
  name,
  label,
  required,
  error,
  handleChange,
  handleBlur,
  value,
  displayOnly,
  accessibilityLabel,
  multiline,
  numberOfLines,
  style,
  hasAccessoryView = true,
}) {
  const theme = useTheme()
  let lab = `${label.en}${required ? ' *' : ''}`
  // if (error) {
  //   lab = `${label.en} - ${error}`
  // }

  if (displayOnly) lab = label.en

  let inputStyles = null
  if (!multiline) {
    inputStyles = {
      height: 50,
      maxHeight: 50,
    }
  }

  return (
    <>
      <Typography size={14} color={theme.title}>
        {lab}
      </Typography>
      <TextInput
        mode={mode}
        accessibilityLabel={accessibilityLabel}
        error={error}
        style={{
          ...styles.inputStyles,
          ...style,
          backgroundColor: theme.bg,
          ...inputStyles,
        }}
        onChangeText={handleChange(name)}
        onBlur={handleBlur(name)}
        value={value}
        placeholderTextColor={theme.placeholder}
        underlineColor={theme.border}
        multiline={multiline}
        numberOfLines={numberOfLines}
        textAlignVertical='auto'
        inputAccessoryViewID={name}
      />
      {hasAccessoryView && <InputAccessoryView nativeID={name} />}
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
  numberOfLines: 0,
}

const styles = StyleSheet.create({
  inputStyles: {
    marginBottom: 16,
    textAlign: 'auto',
  },
})
