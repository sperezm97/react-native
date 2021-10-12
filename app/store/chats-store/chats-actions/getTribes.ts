import { ChatsStore } from '../chats-store'
import { DEFAULT_TRIBE_SERVER } from 'config'
import { display } from 'lib/logging'

let TRIBES_LAST_FETCHED = null
const SAVE_INTERVAL = 15

export const getTribes = async (self: ChatsStore) => {
  if (!!TRIBES_LAST_FETCHED) {
    const now = new Date()
    const dif = now.getTime() - TRIBES_LAST_FETCHED.getTime()
    const secondsSinceLastSent = dif / 1000

    if (secondsSinceLastSent < SAVE_INTERVAL)
      // display({
      //   name: 'getTribes',
      //   preview: 'SKIPPING GETTRIBES',
      //   important: true,
      //   value: { secondsSinceLastSent },
      // })
      return false
  }
  TRIBES_LAST_FETCHED = new Date()

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
