import { Instance, SnapshotOut, types } from 'mobx-state-tree'
import moment from 'moment'
import { Msg, MsgModel } from '.'
import { withEnvironment } from '../extensions/with-environment'
import * as actions from './msg-actions'
import {
  PurchaseMediaParams,
  SendAnonPaymentParams,
  SendAttachmentParams,
  SendInvoiceParams,
  SendMessageParams,
  SendPaymentParams,
} from './msg-actions'

export const MsgStoreModel = types
  .model('MsgStore')
  .props({
    lastFetched: types.optional(types.number, 0),
    lastSeen: types.optional(types.number, 0),
    messages: types.optional(types.map(MsgModel), {}),
  })
  .extend(withEnvironment)
  .actions((self) => ({
    approveOrRejectMember: async (contactID: number, status: string, msgId: number): Promise<void> =>
      await actions.approveOrRejectMember(self as MsgStore, contactID, status, msgId),
    batchDecodeMessages: async (msgs: any): Promise<boolean> =>
      await actions.batchDecodeMessages(self as MsgStore, msgs),
    createRawInvoice: async ({ amt, memo }: { amt: number; memo: string }): Promise<void> =>
      await actions.createRawInvoice(amt, memo),
    deleteMessage: async (id: number): Promise<void> => await actions.deleteMessage(self as MsgStore, id),
    getMessages: async (forceMore: boolean): Promise<any> => await actions.getMessages(self as MsgStore, forceMore),
    gotNewMessage: async (m: any): Promise<any> => await actions.gotNewMessage(self as MsgStore, m),
    gotNewMessageFromWS: async (m: any): Promise<any> => await actions.gotNewMessageFromWS(m),
    invoicePaid: async (m: any): Promise<any> => await actions.invoicePaid(self as MsgStore, m),
    payInvoice: async ({ payment_request, amount }: { payment_request: string; amount: number }): Promise<void> =>
      await actions.payInvoice(self as MsgStore, payment_request, amount),
    purchaseMedia: async ({ contact_id, amount, chat_id, media_token }: PurchaseMediaParams): Promise<any> =>
      await actions.purchaseMedia({ contact_id, amount, chat_id, media_token }),
    restoreMessages: async (): Promise<any> => await actions.restoreMessages(self as MsgStore),
    seeChat: async (id: number): Promise<any> => await actions.seeChat(self as MsgStore, id),
    sendAnonPayment: async (params: SendAnonPaymentParams): Promise<void> =>
      await actions.sendAnonPayment(self as MsgStore, params),
    sendAttachment: async (params: SendAttachmentParams): Promise<void> =>
      await actions.sendAttachment(self as MsgStore, params),
    sendInvoice: async (params: SendInvoiceParams): Promise<void> =>
      await actions.sendInvoice(self as MsgStore, params),
    sendMessage: async (params: SendMessageParams): Promise<void> =>
      await actions.sendMessage(self as MsgStore, params),
    sendPayment: async (params: SendPaymentParams): Promise<void> =>
      await actions.sendPayment(self as MsgStore, params),
    setMessageAsReceived: async (m: any): Promise<void> => await actions.setMessageAsReceived(self as MsgStore, m),
    setLastFetched(lastFetched: number) {
      self.lastFetched = lastFetched
    },
  }))
  .views((self) => ({
    filterMessagesByContent(id, something): any {
      console.log(id, something)
      return []
    },
    lengthOfAllMessages(): number {
      let l = 0
      Object.values(self.messages).forEach((msgs) => {
        l += msgs.length
      })
      return l
    },
    sortAllMsgs(allms: { [k: number]: Msg[] }) {
      const final = {}
      let toSort: { [k: number]: Msg[] } = allms || JSON.parse(JSON.stringify(self.messages)) // ??

      console.tron.display({
        name: 'sortAllMsgs',
        preview: `Trying to sort...`,
        value: { toSort },
      })

      Object.entries(toSort).forEach((entries) => {
        const k = entries[0]
        const v: Msg[] = entries[1]
        v.sort((a, b) => moment(b.date).unix() - moment(a.date).unix())
        final[k] = v
      })

      console.tron.display({
        name: 'sortAllMsgs',
        preview: `Skipping some set of messages...`,
        value: { final },
      })
      // this.messages = final
    },
  }))

type MsgStoreType = Instance<typeof MsgStoreModel>
export interface MsgStore extends MsgStoreType {}
type MsgStoreSnapshotType = SnapshotOut<typeof MsgStoreModel>
export interface MsgStoreSnapshot extends MsgStoreSnapshotType {}
export const createMsgStoreDefaultModel = () => types.optional(MsgStoreModel, {})
