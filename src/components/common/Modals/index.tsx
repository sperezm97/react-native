import React from 'react'
import { useObserver } from 'mobx-react-lite'

import PinCode from './PinCode'
import ContactSubscribe from './ContactSubscribe'

export default function Modals() {
  return useObserver(() => {
    return (
      <>
        <PinCode />
        <ContactSubscribe />
      </>
    )
  })
}
