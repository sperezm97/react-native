import { MsgStore } from '../msg-store'
import { relay } from 'api'
import moment from 'moment'
import { display, log } from 'lib/logging'

const DAYS = 7

export const getMessages = async (self: MsgStore, forceMore: boolean) => {
  const len = self.lengthOfAllMessages()
  if (len === 0) {
    display({
      name: 'getMessages',
      preview: `Returning self.restoreMessages()`,
    })
    return self.restoreMessages()
  }
  let route = 'messages'
  if (!forceMore && self.lastFetched) {
    console.log('fetch1')
    const mult = 1
    const dateq = moment.utc(self.lastFetched - 1000 * mult).format('YYYY-MM-DD%20HH:mm:ss')
    route += `?date=${dateq}`
  } else {
    console.log('fetch2')
    // else just get last week
    console.log('=> GET LAST WEEK')
    const start = moment().subtract(DAYS, 'days').format('YYYY-MM-DD%20HH:mm:ss')
    route += `?date=${start}`
  }
  display({
    name: 'getMessages',
    preview: `Fetching messages. forceMore: ${forceMore}`,
    value: { route },
  })
  try {
    const r = await relay.get(route)
    // display({
    //   name: 'getMessages',
    //   preview: `Returned with...`,
    //   value: { r },
    // })
    if (!r) return

    if (r.new_messages?.length) {
      await self.batchDecodeMessages(r.new_messages)
    } else {
      display({
        name: 'getMessages',
        preview: `No new messages.`,
      })
    }
  } catch (e) {
    console.log('getMessages error', e)
  }
  return true
}
