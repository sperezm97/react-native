import { RelayStore } from '../relay-store'
import { decode as atob } from 'base-64'
import * as e2e from 'lib/crypto/e2e'
import { getRoot } from 'mobx-state-tree'
import { RootStore } from 'store'
import { rsa } from 'lib/crypto'
import { display, log } from 'lib/logging'

export const pinEntered = async (self: RelayStore, pin: string) => {
  const root = getRoot(self) as RootStore
  log(`PIN entered: ${pin}`)

  const restoreString = atob(self.code)

  if (restoreString.startsWith('keys::')) {
    const enc = restoreString.substr(6)
    const dec = await e2e.decrypt(enc, pin)

    if (dec) {
      // await setPinCode(pin)
      const priv = await root.user.restore(dec)

      if (priv) {
        await rsa.setPrivateKey(priv)
        // console.log('set that priv key hm now what')
        return true
        // return onRestore()
      }
    } else {
      // wrong PIN
      // setShowPin(false)
      alert('You entered a wrong pin')

      // setChecking(false)
    }
  }

  return true
}
