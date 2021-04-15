import React from 'react'
import { Button as PaperButton } from 'react-native-paper'

import Pushable from '../Pushable'

export default function PushableButton(props) {
  let { mode, accessibilityLabel, style, loading, disabled, onPress, dark, icon, scale, children, btnHeight, size } = props

  if (size === 'large') {
    btnHeight = 60
  } else if (size === 'small') {
    btnHeight = 35
  } else {
    btnHeight = 50
  }

  return (
    <Pushable onPress={onPress} scale={scale}>
      <PaperButton mode={mode} accessibilityLabel={accessibilityLabel} loading={loading} disabled={disabled} style={style} dark={dark} icon={icon} contentStyle={{ height: btnHeight }}>
        {children}
      </PaperButton>
    </Pushable>
  )
}

PushableButton.defaultProps = {
  mode: 'contained',
  scale: 0.9,
  btnHeight: 60,
  size: 'medium'
}
