import React from 'react'
import { useObserver } from 'mobx-react-lite'

import { useStores } from '../../../store'
import ModalWrap from './ModalWrap'
import PIN from '../../utils/pin'

export default function PinCodeModal() {
  const { ui } = useStores()

  function close(pin) {
    ui.setPinCodeModal(false, pin)
  }

  return useObserver(() => (
    <ModalWrap onClose={close} visible={ui.pinCodeModal} nopad>
      <PIN forceEnterMode={true} onFinish={pin => close(pin)} />
    </ModalWrap>
  ))
}
