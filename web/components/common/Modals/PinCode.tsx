import React from 'react'
import { observer } from 'mobx-react-lite'

import ModalWrap from './ModalWrap'

export const PinCodeModal = observer(({ visible, close, children }: any) => {
  if (!visible) return <></>
  return (
    <ModalWrap visible={visible} onClose={close} noHeader noSwipe>
      {children}
    </ModalWrap>
  )
})

export default PinCodeModal
