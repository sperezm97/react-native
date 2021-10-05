import { getRoot } from 'mobx-state-tree'
import { RootStore } from 'store'
import { RelayStore } from '../relay-store'

export const connect = async (self: RelayStore) => {
  console.tron.log('Connecting to relay')
  const root = getRoot(self) as RootStore
  await self.checkInvite(CODE)
  console.tron.log('Fetching all stuff.')
  await root.meme.authenticateAll()
  await Promise.all([
    root.contacts.getContacts(),
    root.msg.getMessages(true),
    root.details.getBalance(),
  ])
  self.setConnected(true)
  console.tron.log('Done!')
  // self.setupWebsocketHandlers
  return true
}

// const CODE =
//   ''

const CODE = '' // MYPLACEHOLDER code here
