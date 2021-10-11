import { decodeSingle } from '../msg-helpers'
import { display } from 'lib/logging'
import { MsgStore } from '../msg-store'
import { normalizeMessage } from 'app/store/normalize'

export const gotNewMessageFromWS = async (self: MsgStore, m: any) => {
  let newMsg = await decodeSingle(m)
  const normalizedMessage = normalizeMessage(newMsg)

  display({
    name: 'gotNewMessageFromWS',
    preview: `Decoded and normalized message ${normalizedMessage.id}`,
    value: { m, decoded: newMsg, normalizedMessage },
  })

  self.setMessage(normalizedMessage)
}
