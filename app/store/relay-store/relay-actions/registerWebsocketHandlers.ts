import { registerWsHandlers } from 'api/ws'
import { RelayStore } from '../relay-store'
import { display, log } from 'lib/logging'

export const registerWebsocketHandlers = async (self: RelayStore) => {
  log('registering websocket handlers.......')

  const handlers = {
    message: (wat) => log('In message handler with', wat, self),
  }

  registerWsHandlers(handlers)
  return true
}
