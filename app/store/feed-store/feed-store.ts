import { Instance, SnapshotOut, types } from 'mobx-state-tree'
import { withEnvironment } from '../extensions/with-environment'
import * as actions from './feed-actions'
import { Podcast } from './feed-models'

export const FeedStoreModel = types
  .model('FeedStore')
  .props({
    feed: types.optional(types.frozen(), {}),
  })
  .extend(withEnvironment)
  .actions((self) => ({
    sendPayments: async (params: actions.SendPaymentParams): Promise<void> =>
      await actions.sendPayments(self as FeedStore, params),
    loadFeedById: async (id: string): Promise<Podcast | null> => await actions.loadFeedById(id),
  }))

type FeedStoreType = Instance<typeof FeedStoreModel>
export interface FeedStore extends FeedStoreType {}
type FeedStoreSnapshotType = SnapshotOut<typeof FeedStoreModel>
export interface FeedStoreSnapshot extends FeedStoreSnapshotType {}
export const createFeedStoreDefaultModel = () => types.optional(FeedStoreModel, {})
