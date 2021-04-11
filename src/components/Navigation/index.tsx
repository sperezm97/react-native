import React from 'react'

import Modals from '../modals'
import ModalsN from '../common/Modals'
import Dialogs from '../common/Dialogs'
import Root from './Root'

export default function Navigation() {
  return (
    <>
      <Root />
      <Modals />
      <ModalsN />
      <Dialogs />
    </>
  )
}
