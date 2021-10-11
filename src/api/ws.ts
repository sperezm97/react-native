import socketio from 'socket.io-client'
import { display, log } from 'lib/logging'

type WSMessage = { [k: string]: any }

type DataHandler = (data: any) => void

let handlers: { [k: string]: DataHandler } = {}

export function registerWsHandlers(hs: { [k: string]: DataHandler }) {
  handlers = hs
  display({
    name: 'registerWsHandlers',
    preview: 'Websocket handlers registered',
  })
}

let io: any = null

export function connectWebSocket(
  ip: string,
  authToken: string,
  connectedCallback?: Function,
  disconnectCallback?: Function
) {
  // console.log('connectWebSocket with ip and authToken:', ip, authToken)
  if (io) {
    return // dont reconnect if already exists
  }

  io = socketio.connect(ip, {
    reconnection: true,
    transportOptions: {
      polling: {
        extraHeaders: {
          'x-user-token': authToken,
        },
      },
    },
  })

  io.on('connect', () => {
    console.log('=> socketio connected!')
    display({
      name: 'connectWebSocket',
      preview: 'SocketIO connected',
    })
    if (connectedCallback) connectedCallback()
  })

  io.on('disconnect', () => {
    display({
      name: 'connectWebSocket',
      preview: 'SocketIO disconnected',
    })
    if (disconnectCallback) disconnectCallback()
  })

  io.on('message', (data) => {
    try {
      let msg: WSMessage = JSON.parse(data)
      display({
        name: 'connectWebSocket',
        preview: 'SocketIO message',
        value: { msg },
      })
      let typ = msg.type
      if (typ === 'delete') typ = 'deleteMessage'
      let handler = handlers[typ]
      if (handler) {
        handler(msg)
      }
    } catch (e) {}
  })

  io.on('error', function (e) {
    console.log('socketio error', e)
    console.error(e)
  })
}
