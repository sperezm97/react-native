import { action } from 'mobx'
import { relay } from '../api'

export class QueryStore {
  @action async onchainAddress(app: string) {
    const r = await relay.get(`query/onchain_address/${app}`)
    return r
  }

  @action async satsPerDollar() {
    return 5133
  }
}

export const queryStore = new QueryStore()
