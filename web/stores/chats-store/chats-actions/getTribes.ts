import { ChatsStore } from '../chats-store'
import { relay } from 'api'
import { DEFAULT_TRIBE_SERVER } from 'config'

export const getTribes = async (self: ChatsStore) => {
  try {
    const r = await fetch(`https://${DEFAULT_TRIBE_SERVER}/tribes`)
    const j = await r.json()

    // console.log('TRIBES:', j)
    self.setTribes(j)

    return true
  } catch (e) {
    console.log(e)
  }
}
