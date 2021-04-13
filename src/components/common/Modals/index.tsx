import React from 'react'
import { useObserver } from 'mobx-react-lite'

import PinCode from './PinCode'
import ContactSubscribe from './ContactSubscribe'
import AddContact from './AddContact'
import InviteNewUser from './InviteNewUser'
import Payment from './Payment'

export default function Modals() {
  return useObserver(() => {
    return (
      <>
        <PinCode />
        <ContactSubscribe />
        <AddContact />
        <InviteNewUser />
        <Payment />
      </>
    )
  })
}
