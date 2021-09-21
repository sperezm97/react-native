import { MsgStore } from '../msg-store'
import { relay } from 'api'
import moment from 'moment'

const DAYS = 7

export const getMessages = async (self: MsgStore, forceMore: boolean) => {
  console.tron.display({
    name: 'getMessages',
    preview: `Fetching messages`,
  })
  const len = self.lengthOfAllMessages()
  if (len === 0) {
    console.tron.display({
      name: 'getMessages',
      preview: `Returning self.restoreMessages()`,
    })
    return self.restoreMessages()
  }
  let route = 'messages'
  if (!forceMore && self.lastFetched) {
    const mult = 1
    const dateq = moment.utc(self.lastFetched - 1000 * mult).format('YYYY-MM-DD%20HH:mm:ss')
    route += `?date=${dateq}`
  } else {
    // else just get last week
    console.log('=> GET LAST WEEK')
    const start = moment().subtract(DAYS, 'days').format('YYYY-MM-DD%20HH:mm:ss')
    route += `?date=${start}`
  }
  try {
    const r = await relay.get(route)
    if (!r) return
    console.tron.display({
      name: 'getMessages',
      preview: `Returned with...`,
      value: { r },
    })
    if (r.new_messages && r.new_messages.length) {
      await self.batchDecodeMessages(r.new_messages)
    } else {
      self.sortAllMsgs(null)
    }
  } catch (e) {
    console.log('getMessages error', e)
  }
  return true
}
