import React from 'react'
import { StyleSheet } from 'react-native'
import { TextInput } from 'react-native-paper'

import { useTheme } from '../../../store'
import InputAccessoryView from '../../common/Accessories/InputAccessoryView'
import Typography from '../../common/Typography'

export default function NumberInput({
  name,
  label,
  required,
  error,
  handleBlur,
  setValue,
  value,
  displayOnly,
  accessibilityLabel,
  style,
}) {
  const theme = useTheme()
  let lab = `${label.en}${required ? ' *' : ''}`
  if (displayOnly) lab = label.en

  return (
    <>
      <Typography size={14} color={theme.title}>
        {lab}
      </Typography>
      <TextInput
        accessibilityLabel={accessibilityLabel}
        keyboardType='numeric'
        error={error}
        style={{ ...styles.inputStyles, ...style, backgroundColor: theme.bg }}
        onChangeText={(e) => setValue(parseInt(e))}
        onBlur={handleBlur(name)}
        value={value || value === 0 ? value + '' : ''}
        inputAccessoryViewID={name}
        underlineColor={theme.border}
      />

      <InputAccessoryView nativeID={name} />
    </>
  )
}

const styles = StyleSheet.create({
  inputStyles: {
    marginBottom: 16,
    maxHeight: 55,
  },
})
