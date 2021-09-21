import { relay } from 'api'
import { MsgStore, putIn } from '..'

export const deleteMessage = async (self: MsgStore, id: number) => {
  if (!id) return console.log('NO ID!')
  const r = await relay.del(`message/${id}`)
  if (!r) return
  if (r.chat_id) {
    putIn(self.messages, r, r.chat_id)
    // self.persister()
  }
}
