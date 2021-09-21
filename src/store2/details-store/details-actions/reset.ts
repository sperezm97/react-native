import { DetailsStore } from 'store2/details-store'
export function reset(self: DetailsStore) {
  self.balance = 0
  self.logs = ''
}
