import { relay } from 'api'
import { SubsStore } from '..'

export const getSubs = async (self: SubsStore) => {
  try {
    const r = await relay.get('subscriptions')
    if (!r) return
    self.setSubs(r)
  } catch (e) {
    console.log(e)
  }
}
