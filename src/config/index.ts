// const config = {
//   host: 'https://sphinx.chat',
//   domain: 'sphinx.chat',
//   hub: {
//     api: 'https://hub.sphinx.chat/api/v1/'
//   },
//   tribes: {
//     server: 'tribes.sphinx.chat',
//     uuid: 'X3IWAiAW5vNrtOX5TLEJzqNWWr3rrUaXUwaqsfUXRMGNF7IWOHroTGbD4Gn2_rFuRZcsER0tZkrLw3sMnzj4RFAk_sx0'
//   },
//   meme: {
//     server: 'memes.sphinx.chat'
//   },
//   auth: {
//     server: 'auth.sphinx.chat'
//   }
// }

const config = {
  host: 'https://n2n2.chat',
  domain: 'n2n2.chat',
  hub: {
    api: 'https://hub.n2n2.chat/api/v1/'
  },
  tribes: {
    server: 'tribes-staging.n2n2.chat',
    uuid: 'YGT2Bx-VzNmGHkGIZqQnD7cBh7I6z6Wb_wNIuRpmOjR_mowtxQnCi4Z250FpyEB_R0BOvE5IDbqaogSOzaZXbCRGCg0s'
  },
  meme: {
    server: 'meme-staging.n2n2.chat'
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
export const DEFAULT_MEME_SERVER = config.meme.server
export const DEFAULT_AUTH_SERVER = config.auth.server

export default config
