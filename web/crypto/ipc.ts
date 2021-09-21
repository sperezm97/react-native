const electron = window.require ? window.require('electron') : {}

const timeoutSeconds = 10
export function send(k: string, args: object) {
  // console.log('electron:', electron)
  // console.log('in send w', k, args)
  const ipc = electron.ipcRenderer
  // console.log('ipc:', ipc)
  if (!ipc) return
  const rid = `${k}_${Math.random().toString(36).substring(7)}`
  const v = args || {}
  // console.log('sending to ipc:', v, rid)
  ipc.send(k, { ...v, rid })
  const timeout = new Promise((resolve, reject) => {
    const id = setTimeout(() => {
      clearTimeout(id)
      resolve('')
    }, 1000 * timeoutSeconds)
  })
  const response = new Promise((resolve) => {
    ipc.once(rid, (event, response) => resolve(response))
  })
  return Promise.race([response, timeout])
}

export function sendSync(k: string, v: object) {
  const ipc = electron.ipcRenderer
  if (ipc) {
    return ipc.sendSync(k, JSON.stringify(v))
  }
}
