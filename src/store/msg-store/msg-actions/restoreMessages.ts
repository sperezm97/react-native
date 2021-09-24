import { MsgStore } from '../msg-store'
import { relay } from 'api'
import moment from 'moment'
import { decodeMessages, MAX_MSGS_RESTORE, Msg, orgMsgsFromExisting } from '..'

export const restoreMessages = async (self: MsgStore) => {
  console.tron.display({
    name: 'restoreMessages',
    preview: `Restoring messages...`,
  })
  try {
    let done = false
    let offset = 0
    const dateq = moment.utc(0).format('YYYY-MM-DD%20HH:mm:ss')
    let msgs: { [k: number]: Msg[] } = ({} = {})

    while (!done) {
      const r = await relay.get(`msgs?limit=200&offset=${offset}&date=${dateq}`)

      if (r.new_messages?.length) {
        const decodedMsgs = await decodeMessages(r.new_messages)
        msgs = orgMsgsFromExisting(msgs, decodedMsgs)
        if (r && r.new_messages.length < 200) {
          done = true
        }
      } else {
        done = true
      }

      offset += 200
      if (offset >= MAX_MSGS_RESTORE) done = true
    }

    self.sortAllMsgs(msgs)
    self.lastFetched = new Date().getTime()
    // self.persister()
  } catch (error) {
    console.log('restoreMessages error', error)
  }
}
