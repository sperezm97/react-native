import React from 'react'
import { Searchbar } from 'react-native-paper'

import { useTheme } from '../../../store'

export default function Search(props) {
  const { placeholder, value, onChangeText, style } = props
  const theme = useTheme()

  const styles = { ...style, elevation: 0, height: 40, backgroundColor: theme.bg, borderRadius: 5 }
  const iconColor = theme.dark ? theme.white : theme.grey
  const inputStyle = {
    color: theme.darkGrey,
    fontSize: 13
  }
  const placeholderTextColor = theme.title

  return <Searchbar placeholder={placeholder} value={value} onChangeText={onChangeText} style={styles} inputStyle={inputStyle} iconColor={iconColor} placeholderTextColor={placeholderTextColor} />
}
