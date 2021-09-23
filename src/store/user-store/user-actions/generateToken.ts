import { UserStore } from '../user-store'
import { sleep } from 'store/utils/sleep'
import * as api from 'api'
import { randString } from 'crypto/rand'

export const generateToken = async (self: UserStore, pwd: string) => {
  if (api.relay === null && self.currentIP) {
    api.instantiateRelay(self.currentIP)
    await sleep(1)
  }
  try {
    const token = await randString(20)
    console.log('OK GEN TOKEN!', self.currentIP, pwd)
    const r = await api.relay.post(`contacts/tokens?pwd=${pwd}`, {
      token,
    })
    if (!r) return console.log('=> FAILED TO REACH RELAY')
    if (r.id) self.setMyID(r.id)
    self.setAuthToken(token)
    api.instantiateRelay(
      self.currentIP,
      token,
      () => console.log('placeholder setConnected true'), // uiStore.setConnected(true),
      () => console.log('placeholder setConnected false') // uiStore.setConnected(false)
    )
    return token
  } catch (e) {
    console.log(e)
    return e.message
  }
}
