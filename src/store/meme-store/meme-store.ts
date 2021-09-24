import { Instance, SnapshotOut, types } from 'mobx-state-tree'
import moment from 'moment'
import localforage from 'localforage'
import { relay, composeAPI } from 'api'
import { DEFAULT_MEME_SERVER } from 'config'
import { UserStoreModel } from 'store/user-store/user-store'
import { withEnvironment } from '../extensions/with-environment'
import { ServerModal } from './meme-models'
import { asyncForEach } from '../utils/async'

export const MemeStoreModel = types
  .model('MemeStore')
  .props({
    servers: types.optional(types.array(ServerModal), [{ host: DEFAULT_MEME_SERVER, token: '' }]),
    lastAuthenticated: types.optional(types.number, 0),
    cacheEnabled: false,
    // Reference to why using frozen https://github.com/mobxjs/mobx-state-tree/issues/415
    cache: types.optional(types.map(types.frozen()), {}),
    cacheTS: types.optional(types.map(types.frozen()), {}),
    cacheFileName: types.optional(types.map(types.frozen()), {}),
    filenameCache: types.optional(types.map(types.frozen()), {}),
    userStore: types.maybe(types.reference(UserStoreModel)),
  })
  .extend(withEnvironment)
  .actions((self) => ({
    async authenticate(server) {
      const pubkey = self.userStore.publicKey
      if (!pubkey) return

      const memesAPI = composeAPI(server.host)
      const r = await memesAPI.get('ask')
      if (!r?.challenge) return

      const r2 = await relay.get(`signer/${r.challenge}`)
      if (!r2?.sig) return

      const r3 = await memesAPI.post(
        'verify',
        {
          id: r.id,
          sig: r2.sig,
          pubkey,
        },
        'application/x-www-form-urlencoded'
      )
      if (!r3?.token) return
      server.token = r3.token
    },
  }))
  .actions((self) => ({
    async authenticateAll() {
      const lastAuth = self.lastAuthenticated || 0
      const days = 0 // one week
      const isOld = moment(new Date(lastAuth)).isBefore(moment().subtract(days * 24 - 1, 'hours'))
      if (isOld) {
        await asyncForEach(self.servers, self.authenticate)
        self.lastAuthenticated = new Date().getTime()
      }
    },
    checkCacheEnabled() {
      self.cacheEnabled = !!window?.indexedDB
    },
    addToCache(muid: string, data: string, filename?: string) {
      localforage.setItem(muid, data)
      self.cacheTS.set(muid, moment().unix())
      if (filename) self.cacheFileName.set(muid, filename)
    },
    addToFilenameCache(id: number, name: string) {
      self.filenameCache.set(id.toString(), name)
    },
  }))
  .views((self) => ({
    getDefaultServer() {
      return self.servers.find((s) => s.host === DEFAULT_MEME_SERVER)
    },
  }))

type MemeStoreType = Instance<typeof MemeStoreModel>
export interface MemeStore extends MemeStoreType {}
type MemeStoreSnapshotType = SnapshotOut<typeof MemeStoreModel>
export interface MemeStoreSnapshot extends MemeStoreSnapshotType {}
export const createMemeStoreDefaultModel = () => types.optional(MemeStoreModel, {})
