import React, { useRef, useEffect, useState } from 'react'
import { AppState } from 'react-native'
import Toast from 'react-native-simple-toast'
import { checkVersion } from 'react-native-check-version'
import { getVersion, getBundleId } from 'react-native-device-info'
import PushNotificationIOS from '@react-native-community/push-notification-ios'

import { useStores, hooks } from './store'
import { useApn } from './store/contexts/apn'
import { TOAST_DURATION } from './constants'
import { navigate } from './components/Navigation'
import * as utils from './components/utils/utils'
import { initPicSrc } from './components/utils/picSrc'
import * as rsa from './crypto/rsa'
import EE, { RESET_IP_FINISHED } from './components/utils/ee'
import Modals from './components/modals'
import ModalsN from './components/common/Modals'
import Dialogs from './components/common/Dialogs'
import Root from './components/Navigation/Root'
import AppVersionUpdate from './components/common/Dialogs/AppVersion'

const { useChats } = hooks

export default function Main() {
  const { contacts, msg, details, user, meme, ui } = useStores()
  const [versionUpdateVisible, setVersionUpdateVisible] = useState(false)
  const [chatID, setChatID] = useState(null)
  const chats = useChats()
  const apn = useApn()

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
    }
    if (appState.current.match(/active/) && nextAppState === 'background') {
      const count = msg.countUnseenMessages(user.myid)
      PushNotificationIOS.setApplicationIconBadgeNumber(count)
    }

    appState.current = nextAppState
  }

  function showToast(msg) {
    Toast.showWithGravity(msg, TOAST_DURATION, Toast.CENTER)
  }

  async function createPrivateKeyIfNotExists(contacts, user) {
    // const priv = null
    const priv = await rsa.getPrivateKey()
    const me = contacts.contacts.find((c) => c.id === user.myid)

    // private key has been made
    if (priv) {
      // set into user.contactKey
      if (me?.contact_key && !user.contactKey) {
        user.setContactKey(me.contact_key)
        contacts.updateContact(user.myid, {
          contact_key: me.contact_key,
        })
        // set into me Contact
      } else if (user.contactKey) {
        contacts.updateContact(user.myid, {
          contact_key: user.contactKey,
        })
      } else {
        // need to regen :(
        const keyPair = await rsa.generateKeyPair()
        user.setContactKey(keyPair.public)
        contacts.updateContact(user.myid, {
          contact_key: keyPair.public,
        })

        showToast('generated new keypair!!!')
      }
      // no private key!!
    } else {
      const keyPair = await rsa.generateKeyPair()
      user.setContactKey(keyPair.public)
      contacts.updateContact(user.myid, {
        contact_key: keyPair.public,
      })
      showToast('generated key pair')
    }
  }

  async function loadHistory(skipLoadingContacts?: boolean) {
    ui.setLoadingHistory(true)

    if (!skipLoadingContacts) {
      await contacts.getContacts()
    }

    await msg.getMessages()
    ui.setLoadingHistory(false)

    // msg.initLastSeen()
    await sleep(500)
    details.getBalance()
    await sleep(500)
    meme.authenticateAll()
  }

  useEffect(() => {
    ;(async () => {
      await contacts.getContacts()
      loadHistory(true)
      initPicSrc()
      createPrivateKeyIfNotExists(contacts, user)
    })()

    EE.on(RESET_IP_FINISHED, loadHistory)
    return () => {
      EE.removeListener(RESET_IP_FINISHED, loadHistory)
    }
  }, [])

  useEffect(() => {
    if (chatID) {
      const chat = chats.find((c) => c.id === chatID)
      if (chat) {
        navigate('Chat', { ...chat })
        setChatID(null)
      }
    }
  }, [chatID])

  useEffect(() => {
    ;(async () => {
      apn.configure(
        (token) => {
          if ((token && !user.deviceId) || user.deviceId !== token) {
            user.registerMyDeviceId(token, user.myid)
          }
        },
        (notification) => {
          const id = notification.data.aps.alert.action

          if (notification.userInteraction && notification.finish) {
            if (id) {
              setChatID(id)
            }
          }
          // const count = msg.countUnseenMessages(user.myid)
          // PushNotificationIOS.setApplicationIconBadgeNumber(count)

          PushNotificationIOS.setApplicationIconBadgeNumber(0)
          notification.finish(PushNotificationIOS.FetchResult.NoData)
        }
      )

      const currentVersion = getVersion()
      const bundleId = getBundleId()

      const version = await checkVersion({
        bundleId,
        currentVersion: currentVersion.toString(),
      })

      await utils.sleep(300)
      if (version.needsUpdate) {
        setVersionUpdateVisible(true)
        console.log(`App has a ${version.updateType} update pending.`)
      }
    })()
  }, [])

  return (
    <>
      <Root />
      <Modals />
      <ModalsN />
      <Dialogs />
      <AppVersionUpdate visible={versionUpdateVisible} close={() => setVersionUpdateVisible(false)} />
    </>
  )
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
