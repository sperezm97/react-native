import React from 'react'
import { Button as PaperButton } from 'react-native-paper'

import { useTheme } from '../../../store'

export default function Button(props) {
  const theme = useTheme()
  let { pushable, mode, accessibilityLabel, color = theme.primary, style, labelStyle, btnHeight, loading, disabled, onPress, dark, icon, children, size } = props

  if (size === 'large') {
    btnHeight = 60
  } else if (size === 'small') {
    btnHeight = 35
  } else {
    btnHeight = 50
  }

  return (
    <PaperButton
      mode={mode}
      accessibilityLabel={accessibilityLabel}
      loading={loading}
      disabled={disabled}
      onPress={!pushable && onPress}
      style={{ ...style }}
      labelStyle={{ ...labelStyle }}
      contentStyle={{ height: btnHeight }}
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
