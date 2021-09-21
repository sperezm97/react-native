import React from 'react'
import { useObserver } from 'mobx-react-lite'
import { StyleSheet, View, Modal } from 'react-native'

import { useTheme } from 'store'
import ModalHeader from '../ModalHeader'

export default function AddMembers({ visible, close, children }) {
  const theme = useTheme()

  return useObserver(() => (
    <Modal visible={visible} animationType='slide' presentationStyle='pageSheet' onDismiss={close}>
      <ModalHeader title='Add Member' onClose={close} />
      <View style={{ ...styles.wrap, backgroundColor: theme.bg }}>{children}</View>
    </Modal>
  ))
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
  },
})
