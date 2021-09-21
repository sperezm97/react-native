import { ChatsStore } from '../chats-store'
import { relay } from 'api'
import { normalizeChat } from 'stores/normalize'

export const getChats = async (self: ChatsStore) => {
  const chats = await relay.get('chats')
  if (!(chats && chats.length)) return false
  // const parsedChats = chats.map((c) => self.parseChat(c))
  const parsedChats = chats.map((c) => normalizeChat(c))
  console.tron.display({
    name: 'getChats',
    preview: `Got ${chats.length} chats`,
    value: { chats, parsedChats },
  })
  self.setChats(parsedChats)
  return true
}
