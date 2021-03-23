const config = {
  host: 'https://sphinx.chat',
  domain: 'sphinx.chat',
  hub: {
    api: 'https://hub.sphinx.chat/api/v1/'
  },
  tribes: {
    server: 'tribes.sphinx.chat'
  },
  meme: {
    server: 'memes.sphinx.chat'
  },
  auth: {
    server: 'auth.sphinx.chat'
  }
}

export const DEFAULT_HOST = config.host
export const DEFAULT_DOMAIN = config.domain
export const DEFAULT_HUB_API = config.hub.api
export const DEFAULT_TRIBE_SERVER = config.tribes.server
export const DEFAULT_MEME_SERVER = config.meme.server
export const DEFAULT_AUTH_SERVER = config.auth.server

export default config
