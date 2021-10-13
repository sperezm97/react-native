import { Instance, types } from 'mobx-state-tree'

const EpisodeModel = types.model('Episode').props({
  id: types.string,
  title: types.string,
  description: types.string,
  datePublished: types.number,
  enclosureUrl: types.string,
  enclosureType: types.string,
  enclosureLength: types.number,
  image: types.string,
  link: types.string,
})

export const PodcastModel = types.model('Podcast').props({
  id: types.number,
  title: types.string,
  url: types.string,
  description: types.string,
  author: types.string,
  image: types.string,
  link: types.string,
  lastUpdateTime: types.number,
  contentType: types.string,
  language: types.string,
  episodes: types.array(types.reference(EpisodeModel)),
})

export interface Podcast extends Instance<typeof PodcastModel> {}

export const StreamPaymentModel = types
  .model('StreamPayment')
  .props({
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
  .actions((self) => ({
    setPubkey(pubkey: string) {
      self.pubkey = pubkey
    },
  }))

export interface StreamPayment extends Instance<typeof StreamPaymentModel> {}

type DestinationType = 'wallet' | 'node'
export interface Destination {
  address: string
  split: number
  type: DestinationType
}

export const NUM_SECONDS = 60
