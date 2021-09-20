import { observable, action } from 'mobx'
import { persist } from 'mobx-persist'

import { relay } from '../api'
import { DEFAULT_HUB_API } from '../config'
import { Msg } from './msg'

class DetailsStore {
  @persist
  @observable
  balance: number = 0

  @persist
  @observable
  fullBalance: number = 0

  @persist
  @observable
  localBalance: number = 0

  @persist
  @observable
  remoteBalance: number = 0

  @persist
  @observable
  usRate: number = 0

  @persist
  @observable
  usAmount: number = 0

  @action
  async getBalance() {
    try {
      const r = await relay.get('balance')
      if (!r) return

      const b = r.balance && parseInt(r.balance)
      const fb = r.full_balance && parseInt(r.full_balance)
      this.balance = b || 0
      this.fullBalance = fb || 0
    } catch (e) {
      console.log(e)
    }
  }

  @action
  async getChannelBalance() {
    try {
      const r = await relay.get('balance/all')
      if (!r) return

      const lb = r.local_balance && parseInt(r.local_balance)
      const rb = r.remote_balance && parseInt(r.remote_balance)

      this.localBalance = lb || 0
      this.remoteBalance = rb || 0
    } catch (e) {
      console.log(e)
    }
  }

  @action
  async getUSDollarRate() {
    try {
      const r = await fetch(`https://cryptoforge.org/api/price`)
      const j = await r.json()

      if (!j) return

      this.usRate = j.USD

      const value = this.usRate / 100000000
      let final = value * this.localBalance

      this.usAmount = Number(final.toFixed(2)) || 0
    } catch (e) {
      console.log(e)
    }
  }

  @action
  async addToBalance(x: number) {
    this.balance = this.balance + x
  }

  @action
  async getPayments() {
    try {
      const r: Array<Msg> = await relay.get('payments')
      return r
    } catch (e) {
      console.log(e)
    }
  }

  @action
  async requestCapacity(pubKey) {
    try {
      const payload = {
        pubKey,
      }

      const url = `${DEFAULT_HUB_API}request_capacity`

      const r = await fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const j = await r.json()

      if (j.done) {
        return true
      }

      return false

      // return j
    } catch (e) {
      console.log(e)

      return false
    }
  }

  @observable logs: string = ''
  @action
  async getLogs() {
    try {
      const r = await relay.get('logs')
      if (r) this.logs = r
    } catch (e) {
      console.log(e)
    }
  }
  @action
  async clearLogs() {
    this.logs = ''
  }

  @action
  async getVersions() {
    try {
      const r = await relay.get('app_versions')
      if (r) return r
    } catch (e) {
      console.log(e)
    }
  }

  @action reset() {
    this.balance = 0
    this.logs = ''
  }
}

export const detailsStore = new DetailsStore()
