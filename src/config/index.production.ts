const config = {
  host: 'https://n2n2.chat',
  domain: 'n2n2.chat',
  hub: {
    api: 'https://hub.n2n2.chat/api/v1/'
  },
  tribes: {
    server: 'tribes.n2n2.chat',
    uuid:
      'YHiUtB-9mp5X8Fetn6xBA9y4MSM9LzLsewgw29btcOsTi0zToSOwUryHWzslCUc6dSKhlNK6zJrCxJP_b-OdJzfxF-P5'
  },
  memes: {
    server: 'memes.n2n2.chat'
  },
  auth: {
    server: 'auth.n2n2.chat'
  },
  inviter: {
    key: '02584a6540f8e4028c8f3372df069fbacf7e68bb95dbfc192e0310d481e46df298'
  }
}

export const DEFAULT_HOST = config.host
export const DEFAULT_DOMAIN = config.domain
export const DEFAULT_HUB_API = config.hub.api
export const DEFAULT_TRIBE_SERVER = config.tribes.server
export const DEFAULT_MEME_SERVER = config.memes.server
export const DEFAULT_AUTH_SERVER = config.auth.server

export default config
