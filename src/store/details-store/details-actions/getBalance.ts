import { relay } from 'api'
import { DetailsStore } from '../details-store'

export const getBalance = async (self: DetailsStore) => {
  try {
    const r = await relay.get('balance')
    if (!r) return

    const b = r.balance && parseInt(r.balance, 10)
    const fb = r.full_balance && parseInt(r.full_balance, 10)
    self.balance = b || 0
    self.fullBalance = fb || 0
  } catch (e) {
    console.log(e)
  }
}
