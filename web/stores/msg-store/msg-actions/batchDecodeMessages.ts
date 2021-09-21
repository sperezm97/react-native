import { decodeMessages, orgMsgsFromExisting } from 'stores/msg-store'
import { Msg, MsgStore } from '..'

export const batchDecodeMessages = async (self: MsgStore, msgs: Msg[]) => {
  console.tron.display({
    name: 'batchDecodeMessages',
    value: { msgs },
  })

  self.setLastFetched(new Date().getTime())
  const first10 = msgs.slice(msgs.length - 10)
  const rest = msgs.slice(0, msgs.length - 10)
  const decodedMsgs = await decodeMessages(first10)

  console.tron.display({
    name: 'batchDecodeMessages',
    value: { decodedMsgs, first10, rest },
  })

  // const self.messages
  // const watsThis = orgMsgsFromExisting(self.messages.values(), decodedMsgs)

  // this.messages = orgMsgsFromExisting(this.messages, decodedMsgs)
  // console.log('OK! FIRST 10!')

  // this.reverseDecodeMessages(rest.reverse())

  return true
}
