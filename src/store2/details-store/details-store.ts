import { Instance, SnapshotOut, types } from 'mobx-state-tree'
import { withEnvironment } from '../extensions/with-environment'
import * as actions from './details-actions'

export const DetailsStoreModel = types
  .model('DetailsStore')
  .props({
    balance: types.optional(types.number, 0),
  })
  .extend(withEnvironment)
  .actions((self) => ({
    getBalance: async (): Promise<boolean> => await actions.getBalance(self as DetailsStore),
  }))

type DetailsStoreType = Instance<typeof DetailsStoreModel>
export interface DetailsStore extends DetailsStoreType {}
type DetailsStoreSnapshotType = SnapshotOut<typeof DetailsStoreModel>
export interface DetailsStoreSnapshot extends DetailsStoreSnapshotType {}
export const createDetailsStoreDefaultModel = () => types.optional(DetailsStoreModel, {})
