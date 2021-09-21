import React from 'react'
import { useObserver } from 'mobx-react-lite'
import Toast from 'react-native-simple-toast'
import Clipboard from '@react-native-community/clipboard'
import { encode as btoa } from 'base-64'

import { useStores } from 'store'
import { TOAST_DURATION } from '../../constants'

import * as rsa from '../../crypto/rsa'
import * as e2e from 'crypto/e2e'
import * as utils from '../utils/utils'
import PIN, { userPinCode } from '../utils/pin'
import Slider from '../utils/slider'

export default function Backup(props) {
  const { onDone, z, show } = props
  const { user, contacts } = useStores()

  function showError(err) {
    Toast.showWithGravity(err, TOAST_DURATION, Toast.TOP)
  }

  async function exportKeys(pin) {
    try {
      if (!pin) return showError('NO PIN')
      const thePIN = await userPinCode()
      if (pin !== thePIN) return showError('NO USER PIN')

      const priv = await rsa.getPrivateKey()
      if (!priv) return showError('CANT READ PRIVATE KEY')

      const myContactKey = user.contactKey

      const meContact = contacts.contacts.find((c) => c.id === user.myid) || {
        contact_key: myContactKey,
      }

      let pub = myContactKey
      if (!pub) {
        pub = meContact && meContact.contact_key
      }

      if (!pub) return showError('CANT FIND CONTACT KEY')

      const ip = user.currentIP
      if (!ip) return showError('CANT FIND IP')

      const token = user.authToken
      if (!token) return showError('CANT FIND TOKEN')

      if (!priv || !pub || !ip || !token) return showError('MISSING A VAR')

      const str = `${priv}::${pub}::${ip}::${token}`
      const enc = await e2e.encrypt(str, pin)
      const final = btoa(`keys::${enc}`)

      Clipboard.setString(final)
      Toast.showWithGravity('Export Keys Copied.', TOAST_DURATION, Toast.TOP)
    } catch (e) {
      showError(e.message || e)
    } finally {
      await utils.sleep(500)
      onDone()
    }
  }

  function finish(pin) {
    exportKeys(pin)
  }

  return useObserver(() => (
    <Slider z={z} show={show} accessibilityLabel='onboard-PIN'>
      <PIN forceEnterMode={true} onFinish={(pin) => finish(pin)} extraMessage='Backup your keys' />
    </Slider>
  ))
}
