import { ChatsStore } from '../chats-store'
import { relay } from 'api'

export const muteChat = async (self: ChatsStore, chatID: number, muted: boolean) => {
  relay.post(`chats/${chatID}/${muted ? 'mute' : 'unmute'}`)
  console.tron.log('setMuted placeholder')
  // self.chats.get(chatID.toString()).setMuted(muted)
}
