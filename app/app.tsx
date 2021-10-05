import React, { useEffect, useState } from 'react'
import RNBootSplash from 'react-native-bootsplash'
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context'
import { RootStore, RootStoreProvider, setupRootStore } from 'store'
import { RootComponent } from './root-component'
import { ErrorBoundary } from './views/error/error-boundary'

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
    <ErrorBoundary catchErrors={'always'}>
      <RootStoreProvider value={rootStore}>
        <SafeAreaProvider initialMetrics={initialWindowMetrics}>
          <RootComponent />
        </SafeAreaProvider>
      </RootStoreProvider>
    </ErrorBoundary>
  )
}
