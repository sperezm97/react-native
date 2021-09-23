import { observable, action } from 'mobx'
import { persist } from 'mobx-persist'

import * as api from '../api'
import { INVITER_KEY } from '../config'
import { randString } from '../crypto/rand'
import { uiStore } from './ui'

interface Invite {
  inviterNickname: string
  inviterPubkey: string
  welcomeMessage: string
  action: string
}

class UserStore {
  @observable code: string = ''

  @observable invite: Invite = {
    inviterNickname: '',
    inviterPubkey: '',
    welcomeMessage: '',
    action: '',
  }

  @persist
  @observable
  onboardStep: number = 0

  @persist
  @observable
  myid: number = 0 // TODO: this should be a number ????

  @persist
  @observable
  alias: string = ''

  @persist
  @observable
  publicKey: string = ''

  @persist
  @observable
  currentIP: string = ''

  @persist
  @observable
  authToken: string = ''

  @persist
  @observable
  deviceId: string = ''

  @persist
  @observable
  tipAmount: number = 100

  @persist
  @observable
  contactKey: string = ''

  @action reset() {
    this.code = ''
    this.alias = ''
    this.myid = 0
    this.publicKey = ''
    this.currentIP = ''
    this.authToken = ''
    this.deviceId = ''
    this.onboardStep = 0
    this.invite = {
      inviterNickname: '',
      inviterPubkey: '',
      welcomeMessage: '',
      action: '',
    }
  }

  @action
  setOnboardStep(s) {
    this.onboardStep = s
  }

  @action
  setDeviceId(deviceId) {
    this.deviceId = deviceId
  }

  @action
  setMyID(id) {
    this.myid = id
  }

  @action
  setAlias(alias) {
    this.alias = alias
  }

  @action
  setPublicKey(pubkey) {
    this.publicKey = pubkey
  }

  @action
  setContactKey(ck: string) {
    this.contactKey = ck
  }

  @action
  setCurrentIP(ip) {
    this.currentIP = ip
  }

  @action
  setAuthToken(t) {
    this.authToken = t
  }

  @action
  setTipAmount(s: number) {
    this.tipAmount = s
  }

  @action
  finishOnboard() {
    this.onboardStep = 0
    this.invite = {
      inviterNickname: '',
      inviterPubkey: '',
      welcomeMessage: '',
      action: '',
    }
  }

  @action
  async restore(restoreString): Promise<boolean> {
    const arr = restoreString.split('::')
    if (arr.length !== 4) return false
    const priv = arr[0]
    // const pub = arr[1]
    const ip = arr[2]
    const token = arr[3]
    this.setCurrentIP(ip)

    this.setAuthToken(token)
    console.log('RESTORE NOW!')
    api.instantiateRelay(
      ip,
      token,
      () => uiStore.setConnected(true),
      () => uiStore.setConnected(false),
      this.resetIP
    )
    await sleep(650)
    return priv
  }

  @action
  async registerMyDeviceId(device_id, myid) {
    try {
      const r = await api.relay.put(`contacts/${myid}`, { device_id })

      if (!r) return
      if (r.device_id) {
        this.deviceId = r.device_id
      }
    } catch (e) {
      console.log(e)
    }
  }

  @action
  async signupWithCode(code: string): Promise<{ [k: string]: string }> {
    try {
      this.code = code
      console.log('THE CODDE', code)
      const r = await api.invite.post('signup', {
        invite_string: code,
      })
      if (!r) {
        console.log('no invite response')
        return
      }
      if (!r.invite) {
        console.log('no invite data')
        return
      }
      this.currentIP = r.ip
      this.invite = {
        inviterNickname: r.invite.nickname,
        inviterPubkey: r.invite.pubkey,
        welcomeMessage: r.invite.message,
        action: r.invite.action || '',
      }
      api.instantiateRelay(r.ip) // no token
      return { ip: r.ip, password: r.password }
    } catch (e) {
      console.log('Error:', e)
    }
  }

  @action
  async signupWithIP(ip: string) {
    try {
      this.currentIP = ip
      this.invite = supportContact
      console.log(this.currentIP, 'this.currentIP')
      api.instantiateRelay(ip) // no token
      return ip
    } catch (e) {
      console.log('Error:', e)
    }
  }

  @action
  async generateToken(pwd: string) {
    console.log('is  generating-------')

    if (api.relay === null && this.currentIP) {
      api.instantiateRelay(this.currentIP)
      await sleep(1)
    }
    try {
      const token = await randString(20)
      console.log('OK GEN TOKEN!', this.currentIP, pwd)
      const r = await api.relay.post(`contacts/tokens?pwd=${pwd}`, {
        token,
      })
      if (!r) return console.log('=> FAILED TO REACH RELAY')
      if (r.id) this.setMyID(r.id)
      this.authToken = token
      api.instantiateRelay(
        this.currentIP,
        token,
        () => uiStore.setConnected(true),
        () => uiStore.setConnected(false)
      )
      return token
    } catch (e) {
      console.log(e)
    }
  }

  @action
  async finishInvite() {
    try {
      await api.relay.post(
        'invites/finish',
        {
          invite_string: this.code,
        },
        '',
        {
          // TODO: Create a util for this call
          exceptionCallback: async (e) => api.invite.post('notify', { error: e }, '', { rawValue: true }),
        }
      )
    } catch (e) {
      console.error('[Error - finishInvite]', e)
    }
  }

  @action
  async resetIP() {
    console.log('user.RESET_IP')
    const pubkey = this.publicKey
    if (!(pubkey && pubkey.length === 66)) return
    try {
      const r = await api.invite.get(`nodes/${pubkey}`)
      if (!(r && r.node_ip)) return
      console.log('NEW IP', r.node_ip)
      this.currentIP = r.node_ip
      return r.node_ip
    } catch (e) {
      console.log('Error:', e)
    }
  }

  @action
  async requestInvite(email) {
    try {
      if (!email) return

      const r = await api.shop.post('invite_request', { email }, '', {
        rawValue: true,
      })
      if (!r) throw new Error('Failed')

      return {
        status: 'ok',
        payload: { id: r?.invite?.id, duplicate: !!r?.exist },
      }
    } catch (error) {
      console.log('error store', error)
      return { status: 'failure' }
    }
  }

  @action
  async testinit() {}

  @action
  async reportError(label, error) {
    try {
      console.log(label, error)
      await api.invite.post('notify', { place: 'React Native APP', isDevEnvironment: __DEV__, label, error }, '', {
        rawValue: true,
      })
    } catch (error) {
      console.log('reportError: ', error)
    }
  }
}

export const userStore = new UserStore()

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const supportContact = {
  inviterNickname: 'Zion Root',
  inviterPubkey: INVITER_KEY,
  welcomeMessage: 'Welcome to Zion!',
  action: '',
}
