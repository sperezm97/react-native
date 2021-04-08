import React from 'react'
import { useObserver } from 'mobx-react-lite'

import PinCode from './PinCode'
import { useStores } from '../../../store'

export default function Modals() {
  const { ui } = useStores()

  return useObserver(() => {
    return (
      <>
        <PinCode />
      </>
    )
  })
}
