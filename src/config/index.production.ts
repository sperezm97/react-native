const config = {
  host: 'https://n2n2.chat',
  domain: 'n2n2.chat',
  hub: {
    api: 'https://hub.n2n2.chat/api/v1/'
  },
  tribes: {
    server: 'tribes.n2n2.chat',
    uuid: ''
  },
  memes: {
    server: 'memes.n2n2.chat'
  },
  auth: {
    server: 'auth.n2n2.chat'
  },
  inviter: {
    key: ''
  }
}

export const DEFAULT_HOST = config.host
export const DEFAULT_DOMAIN = config.domain
export const DEFAULT_HUB_API = config.hub.api
export const DEFAULT_TRIBE_SERVER = config.tribes.server
export const DEFAULT_MEME_SERVER = config.memes.server
export const DEFAULT_AUTH_SERVER = config.auth.server

export default config
