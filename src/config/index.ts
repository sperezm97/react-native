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
    server: 'tribes.n2n2.chat',
    uuid: 'X3IWAiAW5vNrtOX5TLEJzqNWWr3rrUaXUwaqsfUXRMGNF7IWOHroTGbD4Gn2_rFuRZcsER0tZkrLw3sMnzj4RFAk_sx0'
  },
  meme: {
    server: 'memes.n2n2.chat'
  },
  auth: {
    server: 'auth.n2n2.chat'
  },
  inviter: {
    key: '023d70f2f76d283c6c4e58109ee3a2816eb9d8feb40b23d62469060a2b2867b77f'
  }
}

export const DEFAULT_HOST = config.host
export const DEFAULT_DOMAIN = config.domain
export const DEFAULT_HUB_API = config.hub.api
export const DEFAULT_TRIBE_SERVER = config.tribes.server
export const DEFAULT_MEME_SERVER = config.meme.server
export const DEFAULT_AUTH_SERVER = config.auth.server

export default config
