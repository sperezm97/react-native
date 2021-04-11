import React from 'react'
import { useObserver } from 'mobx-react-lite'

import AddFriend from './AddFriend'

export default function Dialogs() {
  return useObserver(() => {
    return (
      <>
        <AddFriend />
      </>
    )
  })
}
