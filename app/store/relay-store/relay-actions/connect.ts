import { getRoot } from 'mobx-state-tree'
import { RootStore } from 'store'
import { RelayStore } from '../relay-store'
import { display, log } from 'lib/logging'

export const connect = async (self: RelayStore) => {
  log('Connecting to relay')
  const root = getRoot(self) as RootStore
  await self.checkInvite(CODE)
  log('Fetching all stuff.')
  await root.meme.authenticateAll()
  await Promise.all([
    root.contacts.getContacts(),
    root.msg.getMessages(true),
    root.details.getBalance(),
  ])
  self.setConnected(true)
  log('Done!')
  // self.setupWebsocketHandlers
  return true
}

// const CODE =
//   ''

const CODE = '' // MYPLACEHOLDER code here
