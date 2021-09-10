import React from 'react'
import { useObserver } from 'mobx-react-lite'

import ModalWrap from './ModalWrap'

export default function PinCodeModal({ visible, close, children }) {
  return useObserver(() => (
    <ModalWrap visible={visible} onClose={close} noHeader noSwipe>
      {children}
    </ModalWrap>
  ))
}

PinCodeModal.defaultProps = {
  close: () => {},
}
