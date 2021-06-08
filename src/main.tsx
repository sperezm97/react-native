import React, { useRef, useEffect } from 'react'
import { AppState } from 'react-native'
import Toast from 'react-native-simple-toast'

import { useStores } from './store'
import APNManager from './store/contexts/apn'
import { TOAST_DURATION } from './constants'
import { initPicSrc } from './components/utils/picSrc'
import * as rsa from './crypto/rsa'
import EE, { RESET_IP_FINISHED } from './components/utils/ee'
import { check } from './components/checkVersion'
import Modals from './components/modals'
import ModalsN from './components/common/Modals'
import Dialogs from './components/common/Dialogs'
import Root from './components/Navigation/Root'

export default function Main() {
  const { contacts, msg, details, user, meme, ui } = useStores()
  const appState = useRef(AppState.currentState)

  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange)
    return () => {
      AppState.removeEventListener('change', handleAppStateChange)
    }
  }, [])

  function handleAppStateChange(nextAppState) {
    if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
      loadHistory()
      checkVersion()
    }
    if (appState.current.match(/active/) && nextAppState === 'background') {
      const count = msg.countUnseenMessages()

      // BadgeAndroid.setBadge(count);
    }

    appState.current = nextAppState
  }

  function showToast(msg) {
    Toast.showWithGravity(msg, TOAST_DURATION, Toast.CENTER)
  }

  async function createPrivateKeyIfNotExists(contacts, user) {
    const priv = await rsa.getPrivateKey()
    const me = contacts.contacts.find(c => c.id === 1)

    // private key has been made
    if (priv) {
      // set into user.contactKey
      if (me && me.contact_key) {
        if (!user.contactKey) {
          user.setContactKey(me.contact_key)
        }
        // set into me Contact
      } else if (user.contactKey) {
      } else {
        // need to regen :(
        const keyPair = await rsa.generateKeyPair()
        user.setContactKey(keyPair.public)
        contacts.updateContact(user.myid, {
          contact_key: keyPair.public
        })

        showToast('generated new keypair!!!')
      }
      // no private key!!
    } else {
      const keyPair = await rsa.generateKeyPair()
      user.setContactKey(keyPair.public)
      contacts.updateContact(user.myid, {
        contact_key: keyPair.public
      })
      showToast('generated key pair')
    }
  }

  async function checkVersion() {
    await check()
  }

  async function loadHistory() {
    ui.setLoadingHistory(true)
    await Promise.all([contacts.getContacts(), msg.getMessages()])
    ui.setLoadingHistory(false)

    // msg.initLastSeen()
    await sleep(500)
    details.getBalance()
    await sleep(500)
    meme.authenticateAll()
  }

  useEffect(() => {
    ;(async () => {
      loadHistory()
      // checkVersion()
      initPicSrc()
      createPrivateKeyIfNotExists(contacts, user)
    })()

    EE.on(RESET_IP_FINISHED, loadHistory)
    return () => {
      EE.removeListener(RESET_IP_FINISHED, loadHistory)
    }
  }, [])

  return (
    <>
      <APNManager>
        <Root />
        <Modals />
        <ModalsN />
        <Dialogs />
      </APNManager>
    </>
  )
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
