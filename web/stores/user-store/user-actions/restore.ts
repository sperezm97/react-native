import { UserStore } from '../user-store'
import * as api from 'api'
import { sleep } from 'components/utils/utils'

export const restore = async (self: UserStore, restoreString: string) => {
  const arr = restoreString.split('::')
  if (arr.length !== 4) return false
  const priv = arr[0]
  // const pub = arr[1]
  const ip = arr[2]
  const token = arr[3]
  self.setCurrentIP(ip)

  self.setAuthToken(token)
  console.log('RESTORE NOW!')
  api.instantiateRelay(
    ip,
    token,
    () => console.log('placeholder setConnected true'), // uiStore.setConnected(true),
    () => console.log('placeholder setConnected false'), // uiStore.setConnected(false)
    // () => uiStore.setConnected(true),
    // () => uiStore.setConnected(false),
    () => console.log('resetIP placeholder')
    // self.resetIP
  )
  await sleep(650)
  return priv
}
