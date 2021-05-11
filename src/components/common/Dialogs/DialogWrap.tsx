import React from 'react'
import { Portal, Dialog } from 'react-native-paper'

import { useTheme } from '../../../store'

export default function DialogWrap({ title, visible, onDismiss, children, minH = 200 }) {
  const theme = useTheme()

  return (
    <Portal>
      <Dialog
        visible={visible}
        onDismiss={onDismiss}
        style={{ backgroundColor: theme.bg, minHeight: minH }}
      >
        <Dialog.Title style={{ color: theme.primary, fontWeight: '400' }}>
          {title}
        </Dialog.Title>
        <Dialog.Content>{children}</Dialog.Content>
      </Dialog>
    </Portal>
  )
}
