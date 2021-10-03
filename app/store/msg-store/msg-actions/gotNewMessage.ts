import { getRoot } from 'mobx-state-tree'
import { RootStore } from 'store'
import { decodeSingle, MsgStore, putIn } from '..'

export const gotNewMessage = async (self: MsgStore, m: any) => {
  let newMsg = await decodeSingle(m)

  const chatID = newMsg.chat_id
  if (chatID) {
    putIn(self.messages, newMsg, chatID)
    // this.persister()
    const root = getRoot(self) as RootStore
    if (newMsg.chat) root.chats.gotChat(newMsg.chat)
  }
}
