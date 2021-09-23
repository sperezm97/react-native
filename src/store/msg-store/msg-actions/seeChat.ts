import { MsgStore } from '../msg-store'
import { relay } from 'api'

export const seeChat = async (self: MsgStore, id: number) => {
  if (!id) return
  self.lastSeen[id] = new Date().getTime()
  await relay.post(`messages/${id}/read`)
  // self.persister()
}
