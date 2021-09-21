import { Instance, SnapshotOut, types } from 'mobx-state-tree'
import moment from 'moment'
import { Msg, MsgModel } from '.'
import { withEnvironment } from '../extensions/with-environment'
import * as actions from './msg-actions'

export const MsgStoreModel = types
  .model('MsgStore')
  .props({
    lastFetched: types.optional(types.number, 0),
    lastSeen: types.optional(types.number, 0),
    messages: types.optional(types.map(MsgModel), {}),
  })
  .extend(withEnvironment)
  .actions((self) => ({
    batchDecodeMessages: async (msgs: any): Promise<boolean> =>
      await actions.batchDecodeMessages(self as MsgStore, msgs),
    getMessages: async (forceMore: boolean): Promise<any> => await actions.getMessages(self as MsgStore, forceMore),
    restoreMessages: async (): Promise<any> => await actions.restoreMessages(self as MsgStore),
    seeChat: async (id: number): Promise<any> => await actions.seeChat(self as MsgStore, id),
    setLastFetched(lastFetched: number) {
      self.lastFetched = lastFetched
    },
  }))
  .views((self) => ({
    filterMessagesByContent(id, something): any {
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
