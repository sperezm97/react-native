import { DEFAULT_TRIBE_SERVER } from 'config'
import { Podcast } from '../feed-models'

export const loadFeedById = async (id: string): Promise<Podcast | null> => {
  if (!id) return null
  try {
    const r = await fetch(`https://${DEFAULT_TRIBE_SERVER}/podcast?id=${id}`)
    const j: Podcast = await r.json()
    return j
  } catch (e) {
    console.log(e)
    return null
  }
}
