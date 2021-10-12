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
import { display, log } from 'lib/logging'

export const MsgStoreModel = types
  .model('MsgStore')
  .props({
    lastFetched: types.optional(types.number, 0),
    lastSeen: types.optional(types.frozen(), {}),
    messages: types.optional(types.map(MsgModel), {}),
  })
  .extend(withEnvironment)
  .actions((self) => ({
    approveOrRejectMember: async (
      contactID: number,
      status: string,
      msgId: number
    ): Promise<void> =>
      await actions.approveOrRejectMember(self as MsgStore, contactID, status, msgId),
    batchDecodeMessages: async (msgs: any): Promise<boolean> =>
      await actions.batchDecodeMessages(self as MsgStore, msgs),
    createRawInvoice: async ({ amt, memo }: { amt: number; memo: string }): Promise<any> =>
      await actions.createRawInvoice(amt, memo),
    deleteMessage: async (id: number): Promise<void> =>
      await actions.deleteMessage(self as MsgStore, id),
    getMessages: async (forceMore: boolean = false): Promise<any> =>
      await actions.getMessages(self as MsgStore, forceMore),
    gotNewMessage: async (m: any): Promise<any> => await actions.gotNewMessage(self as MsgStore, m),
    gotNewMessageFromWS: async (m: any): Promise<any> =>
      await actions.gotNewMessageFromWS(self as MsgStore, m),
    invoicePaid: async (m: any): Promise<any> => await actions.invoicePaid(self as MsgStore, m),
    payInvoice: async ({
      payment_request,
      amount,
    }: {
      payment_request: string
      amount: number
    }): Promise<void> => await actions.payInvoice(self as MsgStore, payment_request, amount),
    purchaseMedia: async ({
      contact_id,
      amount,
      chat_id,
      media_token,
    }: PurchaseMediaParams): Promise<any> =>
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
    setMessageAsReceived: async (m: any): Promise<void> =>
      await actions.setMessageAsReceived(self as MsgStore, m),
    setLastFetched(lastFetched: number) {
      self.lastFetched = lastFetched
    },
    setMessage: (msg: Msg) => {
      self.messages.set(msg.id.toString(), msg)
    },
    setMessages: (msgs: Msg[]) => {
      const formattedArray = []
      msgs.forEach((msg) => {
        formattedArray.push([msg.id, msg])
      })
      display({
        name: 'setMessages',
        preview: `Setting ${msgs.length} messages`,
        value: { msgs, formattedArray },
      })
      self.messages.merge(formattedArray)
    },
  }))
  .views((self) => ({
    countUnseenMessages(myid: number): number {
      const now = new Date().getTime()
      let unseenCount = 0
      const lastSeenObj = self.lastSeen
      ;(self as MsgStore).messagesArray.forEach(function (msg: Msg) {
        const lastSeen = lastSeenObj[msg.chat_id || '_'] || now
        if (msg.sender !== myid) {
          const unseen = moment(new Date(lastSeen)).isBefore(moment(msg.date))
          if (unseen) unseenCount += 1
        }
      })
      display({
        name: 'countUnseenMessages',
        preview: `Unseen messages: ${unseenCount}`,
        important: true,
      })
      return unseenCount
    },
    filterMessagesByContent(id, filterString): any {
      const list = (self as MsgStore).msgsForChatroom(id)
      if (!list) return []
      const filteredMsgs = list.filter(
        (m) => !!m.message_content && m.message_content.includes(filterString)
      )
      // display({
      //   name: 'filterMessagesByContent',
      //   important: true,
      //   value: { list, id, filterString, filteredMsgs },
      // })
      return filteredMsgs
    },
    lengthOfAllMessages(): number {
      let l = 0
      Object.values(self.messages).forEach((msgs) => {
        l += msgs.length
      })
      return l
    },
    get messagesArray(): Msg[] {
      return Array.from(self.messages.values())
    },
    msgsForChatroom(chatId: number) {
      const msgs = (self as MsgStore).messagesArray
        .filter((msg) => msg.chat_id === chatId)
        .sort((a, b) => moment(b.date).unix() - moment(a.date).unix())
      // display({
      //   name: 'msgsForChatroom',
      //   preview: `msgsForChatroom ${chatId}`,
      //   value: { msgs, chatId },
      // })
      return msgs
    },
    sortAllMsgs(allms: { [k: number]: Msg[] }) {
      return false
      const final = {}
      let toSort: { [k: number]: Msg[] } = allms || JSON.parse(JSON.stringify(self.messages)) // ??

      display({
        name: 'sortAllMsgs',
        preview: `Trying to sort...`,
        value: { toSort, allms },
      })

      // Object.entries(toSort).forEach((entries) => {
      //   const k = entries[0]
      //   const v: Msg[] = entries[1]
      //   v.sort((a, b) => moment(b.date).unix() - moment(a.date).unix())
      //   final[k] = v
      // })

      display({
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
