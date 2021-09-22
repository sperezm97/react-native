import { Instance, SnapshotOut, types } from 'mobx-state-tree'
import { withEnvironment } from '../extensions/with-environment'
import * as actions from './subs-actions'
// import { SubModel } from './subs-models'

export const SubsStoreModel = types
  .model('SubsStore')
  .props({
    subs: types.frozen(), // types.optional(types.map(SubModel), {}),
  })
  .extend(withEnvironment)
  .actions((self) => ({
    getSubs: async (): Promise<void> => await actions.getSubs(self as SubsStore),
    setSubs(subs: any) {
      self.subs = subs
    },
  }))

type SubsStoreType = Instance<typeof SubsStoreModel>
export interface SubsStore extends SubsStoreType {}
type SubsStoreSnapshotType = SnapshotOut<typeof SubsStoreModel>
export interface SubsStoreSnapshot extends SubsStoreSnapshotType {}
export const createSubsStoreDefaultModel = () => types.optional(SubsStoreModel, {})
