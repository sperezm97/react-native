import React, { useState, useEffect, useRef } from 'react'
import { DefaultTheme, Provider as PaperProvider, configureFonts } from 'react-native-paper'
import { useDarkMode } from 'react-native-dynamic'
import { is24HourFormat } from 'react-native-device-time-format'
import { useObserver } from 'mobx-react-lite'
import { NavigationContainer } from '@react-navigation/native'
import { Linking, AppState } from 'react-native'

import Main from './src/components/main'
import Onboard from './src/components/onboard'
import { useStores, useTheme } from './src/store'
import { instantiateRelay } from './src/api'
import Splash from './src/components/common/Splash'
import * as utils from './src/components/utils/utils'
import { qrActions } from './src/qrActions'
import PINCode, { wasEnteredRecently } from './src/components/utils/pin'
import EE, { RESET_IP_FINISHED } from './src/components/utils/ee'
import { paperTheme } from './src/theme'

declare var global: { HermesInternal: null | {} }

// splash screen
export default function Wrap() {
  const { ui, chats } = useStores()
  const [wrapReady, setWrapReady] = useState(false)
  const [isBack, setBack] = useState(false)

  useEffect(() => {
    Linking.addEventListener('url', gotLink)
  }, [isBack])

  useEffect(() => {
    // AppState.addEventListener('change', handleAppStateChange)
    AppState.addEventListener('change', state => {
      if (state === 'active') {
        // console.log('state active')
        setBack(true)

        // Linking.getInitialURL()
        //   .then(e => {
        //     console.log('Initial Url then ', e)
        //     if (e) {
        //       console.log('Initial Url ', e)
        //     }
        //   })
        //   .catch(error => console.log(error))
      }

      if (state === 'background') {
        // console.log('background')
        setBack(false)
      }
    })

    Linking.addEventListener('url', gotLink)

    // return () => {
    //   AppState.removeEventListener('change', handleAppStateChange)
    // }
  }, [])

  async function gotLink(e) {
    console.log('got link called')

    if (e && typeof e === 'string') {
      const j = utils.jsonFromUrl(e)
      if (j['action']) await qrActions(j, ui, chats)
    }
  }

  useEffect(() => {
    // rsa.testSecure()
    // rsa.getPublicKey()

    console.log('=> check for deeplink')
    Linking.getInitialURL()
      .then(e => {
        console.log('e------- deep link', e)

        if (e) gotLink(e).then(() => setWrapReady(true))
        // start with initial url
        else setWrapReady(true) // cold start
      })
      .catch(() => setWrapReady(true)) // this should not happen?
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
    console.log('theme.mode', theme.mode)

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
      // checking if the pin was entered recently
      return (
        <PINCode
          onFinish={async () => {
            await sleep(240)
            setPinned(true)
          }}
        />
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
