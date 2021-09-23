import { decodeSingle } from '..'

export const gotNewMessageFromWS = async (m: any) => {
  let newMsg = await decodeSingle(m)

  console.tron.display({
    name: 'gotNewMessageFromWS',
    preview: 'Placeholder - replace this buffer crap',
    value: { m, decoded: newMsg },
  })

  // const chatID = newMsg.chat_id
  // if (chatID || chatID === 0) {
  //   msgsBuffer.push(newMsg)
  //   if (msgsBuffer.length === 1) {
  //     self.pushFirstFromBuffer()
  //   }
  //   debounce(() => {
  //     self.concatNewMsgs()
  //   }, 1000)
  // if(newMsg.chat) chatStore.gotChat(newMsg.chat) // IS THIS NEEDED????
  // }
}
