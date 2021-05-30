const config = {
  host: 'https://hub.n2n2.chat',
  domain: 'n2n2.chat',
  hub: {
    api: 'https://hub.n2n2.chat/api/v1/'
  },
  tribes: {
    server: 'tribes-staging.n2n2.chat',
    uuid: 'YGT2Bx-VzNmGHkGIZqQnD7cBh7I6z6Wb_wNIuRpmOjR_mowtxQnCi4Z250FpyEB_R0BOvE5IDbqaogSOzaZXbCRGCg0s'
  },
  memes: {
    server: 'memes-staging.n2n2.chat'
  },
  auth: {
    server: 'auth.n2n2.chat'
  },
  inviter: {
    key: '0228af7ad42a56c4069a7af192d139747e98283dfc8d5ba8da9884821c3ef2758e'
  }
}

export const DEFAULT_HOST = config.host
export const DEFAULT_DOMAIN = config.domain
export const DEFAULT_HUB_API = config.hub.api
export const DEFAULT_TRIBE_SERVER = config.tribes.server
export const DEFAULT_MEME_SERVER = config.memes.server
export const DEFAULT_AUTH_SERVER = config.auth.server
export const INVITER_KEY = config.inviter.key

export default config
