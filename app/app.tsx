import React, { useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import RNBootSplash from 'react-native-bootsplash'
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context'
import { RootStore, RootStoreProvider, setupRootStore } from 'store'
import { RootComponent } from './root-component'
import Bugsnag from '@bugsnag/react-native'
import { ErrorSimple } from './views/error/error-simple'

Bugsnag.start()

const ErrorBoundary = Bugsnag.getPlugin('react').createErrorBoundary(React)

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
  // return <ErrorSimple />
  if (!rootStore) return null
  return (
    <ErrorBoundary FallbackComponent={ErrorSimple}>
      <RootStoreProvider value={rootStore}>
        <SafeAreaProvider initialMetrics={initialWindowMetrics}>
          <RootComponent />
        </SafeAreaProvider>
      </RootStoreProvider>
    </ErrorBoundary>
  )
}
