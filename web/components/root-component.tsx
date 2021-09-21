import React, { useEffect } from 'react'
import { instantiateRelay } from 'api'
import { AppNavigator, useNavigationPersistence } from 'navigation'
import { useStores } from 'stores'
import { webStorage as storage } from 'store/storage'
import EE, { RESET_IP, RESET_IP_FINISHED } from './utils/ee'

export const NAVIGATION_PERSISTENCE_KEY = 'NAVIGATION_STATE_2'

export const RootComponent = () => {
  const { ui, user } = useStores()

  // const {
  //   initialNavigationState,
  //   onNavigationStateChange,
  //   isRestored: isNavigationStateRestored,
  // } = useNavigationPersistence(storage, NAVIGATION_PERSISTENCE_KEY)

  useEffect(() => {
    ;(async () => {
      const isSignedUp = user.loggedIn()
      console.tron.display({
        name: 'Initializing',
        preview: `Logged in: ${isSignedUp}`,
      })
      if (isSignedUp) {
        instantiateRelay(
          user.currentIP,
          user.authToken,
          () => ui.setConnected(true),
          () => ui.setConnected(false),
          () => resetIP()
        )
      }
    })()
  }, [])

  async function resetIP() {
    EE.emit(RESET_IP)
    const newIP = await user.resetIP()
    instantiateRelay(
      newIP,
      user.authToken,
      function () {
        ui.setConnected(true)
      },
      function () {
        ui.setConnected(false)
      }
    )
    EE.emit(RESET_IP_FINISHED)
  }

  return (
    <>
      <AppNavigator
      // initialState={initialNavigationState} onStateChange={onNavigationStateChange}
      />
    </>
  )
}
