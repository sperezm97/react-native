import { DEFAULT_TRIBE_SERVER } from 'config'
import { ChatsStore } from '../chats-store'

export const loadFeed = async (self: ChatsStore, host: string, uuid: string, url: string) => {
  if (!host || !url) return
  const theHost = host.includes('localhost') ? DEFAULT_TRIBE_SERVER : host
  try {
    const r = await fetch(`https://${theHost}/podcast?url=${url}`)
    const j = await r.json()

    return j
  } catch (e) {
    console.log('error loading podcast', e)
    return null
  }
}
