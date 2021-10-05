import { decodeMessages } from 'store/msg-store'
import { normalizeMessage } from 'store/normalize'
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

  // console.tron.display({
  //   name: 'batchDecodeMessages',
  //   value: { decodedMsgs, first10, rest },
  // })

  decodedMsgs.forEach((msg) => {
    const normalizedMessage = normalizeMessage(msg)
    self.setMessage(normalizedMessage)
  })

  console.tron.log('Skipping after the first 10 for now')
  const decodedRest = await decodeMessages(rest)

  decodedRest.forEach((msg) => {
    const normalizedMessage = normalizeMessage(msg)
    self.setMessage(normalizedMessage)
  })

  return true
}
