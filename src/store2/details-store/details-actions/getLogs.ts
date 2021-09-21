import { relay } from 'api'
import { DetailsStore } from 'store2/details-store'

export async function getLogs(self: DetailsStore) {
  try {
    const r = await relay.get('logs')
    if (r) self.logs = r
  } catch (e) {
    console.log(e)
  }
}
