import React from 'react'

import { Snackbar } from 'react-native-paper'

export function Toast({ visible, onDismiss, children }) {
  return (
    <Snackbar visible={visible} onDismiss={onDismiss}>
      {children}
    </Snackbar>
  )
}
