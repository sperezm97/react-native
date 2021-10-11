import { Instance, SnapshotOut, types } from 'mobx-state-tree'
import { ChatsStoreModel } from '../chats-store/chats-store'
import { ContactsStoreModel } from '../contacts-store/contacts-store'
import { DetailsStoreModel } from '../details-store/details-store'
import { FeedStoreModel } from '../feed-store/feed-store'
import { MemeStoreModel } from '../meme-store/meme-store'
import { MsgStoreModel } from '../msg-store/msg-store'
import { RelayStoreModel } from '../relay-store/relay-store'
import { SubsStoreModel } from '../subs-store/subs-store'
import { ThemeStoreModel } from '../theme-store/theme-store'
import { UiStoreModel } from '../ui-store/ui-store'
import { UserStoreModel } from '../user-store/user-store'

/**
 * A RootStore model.
 */
// prettier-ignore
export const RootStoreModel = types.model("RootStore").props({
  chats: types.optional(ChatsStoreModel, {} as any),
  contacts: types.optional(ContactsStoreModel, {} as any),
  details: types.optional(DetailsStoreModel, {} as any),
  feed: types.optional(FeedStoreModel, {} as any),
  meme: types.optional(MemeStoreModel, {} as any),
  msg: types.optional(MsgStoreModel, {} as any),
  relay: types.optional(RelayStoreModel, {} as any),
  subs: types.optional(SubsStoreModel, {} as any),
  theme: types.optional(ThemeStoreModel, {} as any),
  ui: types.optional(UiStoreModel, {} as any),
  user: types.optional(UserStoreModel, {} as any),
})

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}

/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
