import React, { useState } from 'react'
import { useObserver } from 'mobx-react-lite'
import { View, StyleSheet } from 'react-native'
import { Button, Portal } from 'react-native-paper'

import { useStores } from '../../../store'
import ModalWrap from './ModalWrap'
import ModalHeader from './ModalHeader'
import PIN, { userPinCode } from '../../utils/pin'

export default function PinCodeModal() {
  const { ui } = useStores()

  console.log('ui.pinCodeModal', ui.pinCodeModal)

  function close() {
    ui.setPinCodeModal(false)
  }

  return useObserver(() => (
    <ModalWrap onClose={close} visible={ui.pinCodeModal}>
      <Portal.Host>
        <ModalHeader title='Pin Code' onClose={close} />

        <PIN />
      </Portal.Host>
    </ModalWrap>
  ))
}

const styles = StyleSheet.create({
  modal: {
    margin: 0
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40
  },
  former: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%'
  }
})
