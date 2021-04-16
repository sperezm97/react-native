import React, { useState, useEffect, useRef } from 'react'
import { Provider as PaperProvider } from 'react-native-paper'
import { useDarkMode } from 'react-native-dynamic'
import { is24HourFormat } from 'react-native-device-time-format'
import { useObserver } from 'mobx-react-lite'
import { NavigationContainer } from '@react-navigation/native'
import { Linking, AppState } from 'react-native'

import { useStores, useTheme } from './src/store'
import { instantiateRelay } from './src/api'
import * as utils from './src/components/utils/utils'
import PIN, { wasEnteredRecently } from './src/components/utils/pin'
import EE, { RESET_IP_FINISHED } from './src/components/utils/ee'
import { qrActions } from './src/qrActions'
import { paperTheme } from './src/theme'
import Main from './src/components/main'
import Onboard from './src/components/onboard'
import Splash from './src/components/common/Splash'
import PinCodeModal from './src/components/common/Modals/PinCode'

declare var global: { HermesInternal: null | {} }

// splash screen
export default function Wrap() {
  const { ui, chats } = useStores()
  const [wrapReady, setWrapReady] = useState(false)
  const [isBack, setBack] = useState(false)

  useEffect(() => {
    Linking.addEventListener('url', gotLink)
  }, [isBack])

  async function gotLink(e) {
    if (e && typeof e === 'string') {
      const j = utils.jsonFromUrl(e)

      if (j['action']) await qrActions(j, ui, chats)
    }
  }

  useEffect(() => {
    // rsa.testSecure()
    // rsa.getPublicKey()

    Linking.getInitialURL()
      .then(e => {
        if (e) gotLink(e).then(() => setWrapReady(true))
        else setWrapReady(true)
      })
      .catch(() => setWrapReady(true))
    Linking.addEventListener('url', gotLink)
    // RNWebRTC.registerGlobals()
  }, [])

  return useObserver(() => {
    if (ui.ready && wrapReady) return <App /> // hydrated and checked for deeplinks!

    return <Splash /> // full screen loading
  })
}

function App() {
  const { user, ui } = useStores()
  const theme = useTheme()
  const [loading, setLoading] = useState(true) // default
  const [signedUp, setSignedUp] = useState(false) // <=
  const [pinned, setPinned] = useState(false)

  function connectedHandler() {
    ui.setConnected(true)
  }
  function disconnectedHandler() {
    ui.setConnected(false)
  }
  async function check24Hour() {
    const is24Hour = await is24HourFormat()
    ui.setIs24HourFormat(is24Hour)
  }

  const isDarkMode = useDarkMode()
  useEffect(() => {
    if (theme.mode === 'System') {
      theme.setDark(isDarkMode)
    } else {
      theme.setDark(theme.mode === 'Dark')
    }

    check24Hour()

    // TrackPlayer.setupPlayer();
    ;(async () => {
      const isSignedUp = user.currentIP && user.authToken && !user.onboardStep ? true : false
      setSignedUp(isSignedUp)

      if (isSignedUp) {
        instantiateRelay(user.currentIP, user.authToken, connectedHandler, disconnectedHandler, resetIP)
      }
      const pinWasEnteredRecently = await wasEnteredRecently()

      if (pinWasEnteredRecently) setPinned(true)

      setLoading(false)

      user.testinit()
    })()
  }, [])

  async function resetIP() {
    ui.setLoadingHistory(true)
    const newIP = await user.resetIP()
    instantiateRelay(newIP, user.authToken, connectedHandler, disconnectedHandler)
    EE.emit(RESET_IP_FINISHED)
  }

  return useObserver(() => {
    if (loading) return <Splash />
    if (signedUp && !pinned) {
      return (
        <PinCodeModal visible={signedUp && !pinned}>
          <PIN
            onFinish={async () => {
              await sleep(240)
              setPinned(true)
            }}
          />
        </PinCodeModal>
      )
    }

    const pTheme = paperTheme(theme)

    return (
      <>
        <PaperProvider theme={pTheme}>
          <NavigationContainer>
            {signedUp && <Main />}
            {!signedUp && (
              <Onboard
                onFinish={() => {
                  user.finishOnboard() // clear out things
                  setSignedUp(true) // signed up w key export
                  setPinned(true) // also PIN has been set
                }}
              />
            )}
          </NavigationContainer>
        </PaperProvider>
      </>
    )
  })
}

// TODO => Abstraction
async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
