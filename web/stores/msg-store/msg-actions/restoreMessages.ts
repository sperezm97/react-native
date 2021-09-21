import { MsgStore } from '../msg-store'
import { relay } from 'api'
import moment from 'moment'

export const restoreMessages = async (self: MsgStore) => {
  console.tron.display({
    name: 'restoreMessages',
    preview: `Restoring messages`,
  })
  return true
}
