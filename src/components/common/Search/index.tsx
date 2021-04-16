import React from 'react'
import { Searchbar } from 'react-native-paper'

import { useTheme } from '../../../store'
import Icon from '../Icon'

export default function Search(props) {
  const { placeholder, value, onChangeText, style, h } = props

  const theme = useTheme()

  const styles = { ...style, elevation: 0, height: h, backgroundColor: theme.inputBg, borderRadius: 5 }
  const iconColor = theme.icon
  const inputStyle = {
    color: theme.input,
    fontSize: 15,
    paddingLeft: 0
  }
  const placeholderTextColor = theme.placeholder

  return (
    <Searchbar
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      style={styles}
      inputStyle={inputStyle}
      iconColor={iconColor}
      placeholderTextColor={placeholderTextColor}
      clearIcon={props => <ClearIcon value={value} />}
    />
  )
}

function ClearIcon({ value }) {
  const theme = useTheme()
  return <Icon name='Close' color={value ? theme.icon : 'transparent'} size={22} />
}

Search.defaultProps = {
  h: 40
}
