import { Instance, SnapshotOut, types } from 'mobx-state-tree'
import { withEnvironment } from '../extensions/with-environment'
import * as actions from './chats-actions'
import { Chat, ChatModel } from './chats-models'

export const ChatsStoreModel = types
  .model('ChatsStore')
  .props({
    chats: types.optional(types.map(ChatModel), {}),
    tribes: types.optional(types.frozen(), {}),
  })
  .extend(withEnvironment)
  .actions((self) => ({
    createGroup: async (contact_ids: number[], name: string): Promise<any> =>
      await actions.createGroup(self as ChatsStore, contact_ids, name),
    createTribe: async (params: actions.CreateTribeParams): Promise<any> =>
      await actions.createTribe(self as ChatsStore, params),
    editTribe: async (params: actions.EditTribeParams): Promise<any> =>
      await actions.editTribe(self as ChatsStore, params),
    getChats: async (): Promise<boolean> => await actions.getChats(self as ChatsStore),
    getTribeDetails: async (host: string, uuid: string): Promise<any> =>
      await actions.getTribeDetails(self as ChatsStore, host, uuid),
    getTribes: async (): Promise<boolean> => await actions.getTribes(self as ChatsStore),
    gotChat: async (chat: Chat): Promise<any> => await actions.gotChat(self as ChatsStore, chat),
    joinDefaultTribe: async (): Promise<boolean> => await actions.joinDefaultTribe(self as ChatsStore),
    joinTribe: async (params: actions.JoinTribeParams): Promise<boolean> =>
      await actions.joinTribe(self as ChatsStore, params),
    parseChat: (c): Chat => {
      if (c.meta && typeof c.meta === 'string') {
        let meta
        try {
          meta = JSON.parse(String(c.meta))
        } catch (e) {}
        return { ...c, meta }
      }
      return c
    },
    setChat: (chat: Chat) => {
      self.chats.set(chat.id.toString(), chat)
    },
    setChats: (chats: Chat[]) => {
      chats.forEach((chat) => (self as ChatsStore).setChat(chat))
    },
    setTribes: (tribes: any) => (self.tribes = tribes),
  }))

type ChatsStoreType = Instance<typeof ChatsStoreModel>
export interface ChatsStore extends ChatsStoreType {}
type ChatsStoreSnapshotType = SnapshotOut<typeof ChatsStoreModel>
export interface ChatsStoreSnapshot extends ChatsStoreSnapshotType {}
export const createChatsStoreDefaultModel = () => types.optional(ChatsStoreModel, {})
