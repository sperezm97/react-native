import React from 'react'
import { useObserver } from 'mobx-react-lite'

import ContactSubscribe from './ContactSubscribe'
import AddContact from './AddContact'
import InviteNewUser from './InviteNewUser'
import Payment from './Payment'
import ShareGroup from './ShareGroup'

export default function Modals() {
  return useObserver(() => {
    return (
      <>
        <ContactSubscribe />
        <AddContact />
        <InviteNewUser />
        <Payment />
        <ShareGroup />
      </>
    )
  })
}
