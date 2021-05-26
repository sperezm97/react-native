import React, { useRef, useEffect } from 'react'
import { AppState } from 'react-native'

import { useStores } from '../store'
import APNManager from '../store/contexts/apn'
import { initPicSrc } from './utils/picSrc'
import * as rsa from '../crypto/rsa'
import EE, { RESET_IP, RESET_IP_FINISHED } from './utils/ee'
import { check } from './checkVersion'
import Navigation from './Navigation'

async function createPrivateKeyIfNotExists(contacts) {
  const priv = await rsa.getPrivateKey()
  if (priv) return // all good

  const keyPair = await rsa.generateKeyPair()
  contacts.updateContact(1, {
    contact_key: keyPair.public
  })
}

export default function Main() {
  const { contacts, msg, details, meme, ui } = useStores()
  const appState = useRef(AppState.currentState)

  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange)
    return () => {
      AppState.removeEventListener('change', handleAppStateChange)
    }
  }, [])

  // useEffect(() => {
  // rsa.testSecure()
  // rsa.getPublicKey()
  // RNWebRTC.registerGlobals()
  // }, [])

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
      createPrivateKeyIfNotExists(contacts)
    })()

    EE.on(RESET_IP_FINISHED, loadHistory)
    return () => {
      EE.removeListener(RESET_IP_FINISHED, loadHistory)
    }
  }, [])

  return (
    <>
      <APNManager>
        <Navigation />
      </APNManager>
    </>
  )
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
