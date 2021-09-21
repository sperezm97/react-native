import { Instance, SnapshotOut, types } from 'mobx-state-tree'
import { withEnvironment } from '../extensions/with-environment'
import * as actions from './details-actions'

export const DetailsStoreModel = types
  .model('DetailsStore')
  .props({
    balance: types.optional(types.number, 0),
    fullBalance: types.optional(types.number, 0),
    logs: types.optional(types.string, ''),
    localBalance: types.optional(types.number, 0),
    remoteBalance: types.optional(types.number, 0),
  })
  .extend(withEnvironment)
  .actions((self) => ({
    getBalance: async (): Promise<void> => await actions.getBalance(self as DetailsStore),
    requestCapacity: async (pubKey: string): Promise<boolean> =>
      await actions.requestCapacity(self as DetailsStore, pubKey),
    getLogs: async (): Promise<void> => await actions.getLogs(self as DetailsStore),
    getUSDollarRate: async () => await actions.getUSDollarRate(self as DetailsStore),
    getVersions: async (): Promise<any> => await actions.getVersions(self as DetailsStore),
    clearLogs: (): void => actions.clearLogs(self as DetailsStore),
    reset: (): void => actions.reset(self as DetailsStore),
  }))

type DetailsStoreType = Instance<typeof DetailsStoreModel>
export interface DetailsStore extends DetailsStoreType {}
type DetailsStoreSnapshotType = SnapshotOut<typeof DetailsStoreModel>
export interface DetailsStoreSnapshot extends DetailsStoreSnapshotType {}
export const createDetailsStoreDefaultModel = () => types.optional(DetailsStoreModel, {})
