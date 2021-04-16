import React from 'react'
import { Button as PaperButton } from 'react-native-paper'

import { useTheme } from '../../../store'

export default function Button(props) {
  const theme = useTheme()
  let { pushable, mode, accessibilityLabel, color = theme.primary, style, round, fs, h, w, labelStyle, btnHeight, loading, disabled, onPress, dark, icon, children, size } = props

  let defaultFs = 13
  let defaultHeight = 40

  if (size === 'large') {
    btnHeight = 60
    defaultFs = 14
    defaultHeight = 50
  } else if (size === 'small') {
    btnHeight = 35
    defaultHeight = 35
  } else {
    btnHeight = 40
  }

  const height = h ? h : defaultHeight

  const borderRadius = round ? round : 25
  const fontSize = fs ? fs : defaultFs

  return (
    <PaperButton
      mode={mode}
      accessibilityLabel={accessibilityLabel}
      loading={loading}
      disabled={disabled}
      onPress={!pushable && onPress}
      style={{ ...style, borderRadius, width: w }}
      labelStyle={{ ...labelStyle, fontSize }}
      contentStyle={{ height }}
      dark={dark}
      icon={icon}
      color={color}
    >
      {children}
    </PaperButton>
  )
}

Button.defaultProps = {
  mode: 'contained',
  btnHeight: 60,
  size: 'medium'
}
