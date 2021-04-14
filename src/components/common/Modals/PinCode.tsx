import React from 'react'
// import { Modal } from 'react-native'
import { useObserver } from 'mobx-react-lite'

import { useStores } from '../../../store'
import ModalWrap from './ModalWrap'
import PIN from '../../utils/pin'

export default function PinCodeModal() {
  const { ui } = useStores()

  function close() {
    ui.setPinCodeModal(false, null)
  }

  function finish(pin) {
    ui.setPinCodeModal(false, pin)
  }

  return useObserver(() => (
    <ModalWrap visible={ui.pinCodeModal} onClose={close} noHeader>
      <PIN forceEnterMode={true} onFinish={pin => finish(pin)} />
    </ModalWrap>
  ))
}
