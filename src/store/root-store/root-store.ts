import { Instance, SnapshotOut, types } from 'mobx-state-tree'
import { ChatsStoreModel } from '../chats-store/chats-store'
import { ContactsStoreModel } from '../contacts-store/contacts-store'
import { DetailsStoreModel } from '../details-store/details-store'
import { MsgStoreModel } from '../msg-store/msg-store'
import { UiStoreModel } from '../ui-store/ui-store'
import { UserStoreModel } from '../user-store/user-store'

/**
 * A RootStore model.
 */
// prettier-ignore
export const RootStoreModel = types.model("RootStore").props({
  chats: types.optional(ChatsStoreModel, {} as any),
  contacts: types.optional(ContactsStoreModel, {} as any),
  details: types.optional(DetailsStoreModel, {}),
  msg: types.optional(MsgStoreModel, {} as any),
  ui: types.optional(UiStoreModel, {} as any),
  user: types.optional(UserStoreModel, {} as any)
})

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}

/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
