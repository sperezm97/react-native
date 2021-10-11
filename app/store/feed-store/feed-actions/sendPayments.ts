import { relay } from 'api'
import { getRoot } from 'mobx-state-tree'
import { RootStore } from 'store'
import { Destination } from '../feed-models'
import { FeedStore } from '../feed-store'

export const sendPayments = async (
  self: FeedStore,
  { destinations, text, amount, chat_id, update_meta }: SendPaymentParams
) => {
  const root = getRoot(self) as RootStore
  await relay.post('stream', {
    destinations,
    text,
    amount,
    chat_id,
    update_meta,
  })
  if (chat_id && update_meta && text) {
    let meta
    try {
      meta = JSON.parse(text)
    } catch (e) {}
    if (meta) {
      root.chats.updateChatMeta(chat_id, meta)
    }
  }
  if (amount) root.details.addToBalance(amount * -1)
}

export interface SendPaymentParams {
  destinations: Destination[]
  text: string
  amount: number
  chat_id: number
  update_meta: boolean
}
