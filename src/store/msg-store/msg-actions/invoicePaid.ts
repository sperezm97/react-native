import { constants } from '../../../constants'
import { MsgStore } from '..'
import { getRoot } from 'mobx-state-tree'
import { RootStore } from 'store'

export const invoicePaid = async (self: MsgStore, m: any) => {
  if (m.chat_id) {
    const msgs = self.messages[m.chat_id]
    if (msgs) {
      const invoice = msgs.find((c) => c.payment_hash === m.payment_hash)
      if (invoice) {
        invoice.status = constants.statuses.confirmed
        // this.persister()
      }
    }
  }
  const root = getRoot(self) as RootStore
  if (m.amount) root.details.addToBalance(m.amount * -1)
}