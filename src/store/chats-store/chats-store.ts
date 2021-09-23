import { DEFAULT_TRIBE_SERVER } from 'config'
import { Instance, SnapshotOut, types } from 'mobx-state-tree'
import { withEnvironment } from '../extensions/with-environment'
import * as actions from './chats-actions'
import { Chat, ChatModel } from './chats-models'

export const ChatsStoreModel = types
  .model('ChatsStore')
  .props({
    chats: types.optional(types.map(ChatModel), {}),
    servers: types.frozen([{ host: DEFAULT_TRIBE_SERVER }]),
    tribes: types.optional(types.frozen(), {}),
  })
  .extend(withEnvironment)
  .actions((self) => ({
    addGroupMembers: async (chatID: number, contact_ids: number[]): Promise<void> =>
      await actions.addGroupMembers(chatID, contact_ids),
    checkRoute: async (cid: string, myid: number): Promise<void> =>
      await actions.checkRoute(self as ChatsStore, cid, myid),
    createGroup: async (contact_ids: number[], name: string): Promise<any> =>
      await actions.createGroup(self as ChatsStore, contact_ids, name),
    createTribe: async (params: actions.CreateTribeParams): Promise<any> =>
      await actions.createTribe(self as ChatsStore, params),
    editTribe: async (params: actions.EditTribeParams): Promise<any> =>
      await actions.editTribe(self as ChatsStore, params),
    exitGroup: async (chatID: number): Promise<void> => await actions.exitGroup(self as ChatsStore, chatID),
    getChats: async (): Promise<boolean> => await actions.getChats(self as ChatsStore),
    getDefaultTribeServer: async (): Promise<any> => await actions.getDefaultTribeServer(self as ChatsStore),
    getTribeDetails: async (host: string, uuid: string): Promise<any> =>
      await actions.getTribeDetails(self as ChatsStore, host, uuid),
    getTribes: async (): Promise<boolean> => await actions.getTribes(self as ChatsStore),
    gotChat: async (chat: Chat): Promise<any> => await actions.gotChat(self as ChatsStore, chat),
    joinDefaultTribe: async (): Promise<boolean> => await actions.joinDefaultTribe(self as ChatsStore),
    joinTribe: async (params: actions.JoinTribeParams): Promise<boolean> =>
      await actions.joinTribe(self as ChatsStore, params),
    kick: async (chatID: number, contactID: number): Promise<void> =>
      await actions.kick(self as ChatsStore, chatID, contactID),
    loadFeed: async (host: string, url: string): Promise<void> => await actions.loadFeed(host, url),
    muteChat: async (chatID: number, muted: boolean): Promise<void> =>
      await actions.muteChat(self as ChatsStore, chatID, muted),
    updateMyInfoInChat: async (tribeID: number, my_alias: string, my_photo_url: string): Promise<void> =>
      await actions.updateMyInfoInChat(self as ChatsStore, tribeID, my_alias, my_photo_url),
    updateTribeAsNonAdmin: async (tribeID: number, name: string, img: string): Promise<void> =>
      await actions.updateTribeAsNonAdmin(self as ChatsStore, tribeID, name, img),
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
    updateServers: (): void => {
      self.servers = [{ host: DEFAULT_TRIBE_SERVER }]
    },
  }))

type ChatsStoreType = Instance<typeof ChatsStoreModel>
export interface ChatsStore extends ChatsStoreType {}
type ChatsStoreSnapshotType = SnapshotOut<typeof ChatsStoreModel>
export interface ChatsStoreSnapshot extends ChatsStoreSnapshotType {}
export const createChatsStoreDefaultModel = () => types.optional(ChatsStoreModel, {})
