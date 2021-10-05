import React, { useEffect, useState } from 'react'
import RNBootSplash from 'react-native-bootsplash'
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context'
import { RootStore, RootStoreProvider, setupRootStore } from 'store'
import { AppNavigator } from 'navigation'

export const App = () => {
  const [rootStore, setRootStore] = useState<RootStore | undefined>(undefined)
  useEffect(() => {
    ;(async () => {
      // Set up root store, then hide splash screen.
      const rootStore = await setupRootStore()
      setRootStore(rootStore)
      RNBootSplash.hide({ fade: true })
    })()
  }, [])
  if (!rootStore) return null
  return (
    <RootStoreProvider value={rootStore}>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <AppNavigator />
      </SafeAreaProvider>
    </RootStoreProvider>
  )
}
