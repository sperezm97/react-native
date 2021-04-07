import React from 'react'
import { Button as PaperButton } from 'react-native-paper'

export default function Button(props) {
  let { mode, accessibilityLabel, style, btnHeight, loading, disabled, onPress, dark, icon, children, size } = props

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
      onPress={onPress}
      style={{ ...style }}
      contentStyle={{ height: btnHeight }}
      dark={dark}
      icon={icon}
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
