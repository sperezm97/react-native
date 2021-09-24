import { Instance, types } from 'mobx-state-tree'

export const StreamPaymentModel = types.model('StreamPayment').props({
  feedID: types.number,
  itemID: types.number,
  ts: types.number,
  speed: types.maybe(types.string),
  title: types.maybe(types.string),
  text: types.maybe(types.string),
  url: types.maybe(types.string),
  pubkey: types.maybe(types.string),
  type: types.maybe(types.string),
  uuid: types.maybe(types.string),
  amount: types.maybe(types.number),
})

export interface StreamPayment extends Instance<typeof StreamPaymentModel> {}

type DestinationType = 'wallet' | 'node'
export interface Destination {
  address: string
  split: number
  type: DestinationType
}

export const NUM_SECONDS = 60
