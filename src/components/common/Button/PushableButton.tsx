import React from 'react'
import { Button as PaperButton } from 'react-native-paper'

import Pushable from '../Pushable'

export default function PushableButton(props) {
  const { mode, accessibilityLabel, style, loading, disabled, onPress, dark, icon, scale, children } = props

  return (
    <Pushable onPress={onPress} scale={scale}>
      <PaperButton mode={mode} accessibilityLabel={accessibilityLabel} loading={loading} disabled={disabled} style={style} dark={dark} icon={icon}>
        {children}
      </PaperButton>
    </Pushable>
  )
}

PushableButton.defaultProps = {
  mode: 'contained',
  scale: 0.9
}
