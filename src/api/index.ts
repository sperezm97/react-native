import { DEFAULT_HUB_API, DEFAULT_SHOP_API } from '../config'
import API from './api'
import { connectWebSocket } from './ws'
import { display } from 'lib/logging'

const invite = new API(DEFAULT_HUB_API, '', '')
const shop = new API(DEFAULT_SHOP_API, '', '')

let relay: API = null

export function instantiateRelay(
  ip: string,
  authToken?: string,
  connectedCallback?: Function,
  disconnectCallback?: Function,
  resetIPCallback?: Function
) {
  if (!ip) return console.log('cant instantiate Relay, no IP')

  if (relay) relay = null

  let protocol = 'http://'
  if (ip.endsWith('nodl.it')) {
    protocol = 'https://'
  }
  if (ip.endsWith('nodes.sphinx.chat')) {
    protocol = 'https://'
  }

  if (ip.startsWith('https://') || ip.startsWith('http://')) {
    protocol = ''
  }

  if (authToken) {
    relay = new API(`${protocol}${ip}/`, 'x-user-token', authToken, resetIPCallback)
  } else {
    relay = new API(`${protocol}${ip}/`)
  }
  console.log('=> instantiated relay!', `${protocol}${ip}/`, 'authToken?', !!authToken)
  display({
    name: 'instantiateRelay',
    preview: `Instantiated relay!  - authToken: ${!!authToken}`,
    value: `${protocol}${ip}/`,
  })

  if (authToken) {
    // only connect here (to avoid double) if auth token means for real
    connectWebSocket(`${protocol}${ip}`, authToken, connectedCallback, disconnectCallback)
    // Websocket handlers moved to relay-store action - handlers need the MST self object for actions
  }
}

export function composeAPI(host: string, authToken?: string) {
  let api = null
  if (authToken) {
    api = new API(`https://${host}/`, 'Authorization', `Bearer ${authToken}`)
    display({
      name: 'composeAPI',
      preview: `API composed with authToken: ${host}`,
      important: true,
      value: { api, authToken },
    })
  } else {
    api = new API(`https://${host}/`)
    display({
      name: 'composeAPI',
      preview: `API composed with no authToken: ${host}`,
      value: { api, authToken },
    })
  }

  return api
}

export { invite, relay, shop }
