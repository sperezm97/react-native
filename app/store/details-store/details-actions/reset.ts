import { DetailsStore } from 'store/details-store'
export function reset(self: DetailsStore) {
  self.balance = 0
  self.logs = ''
}
