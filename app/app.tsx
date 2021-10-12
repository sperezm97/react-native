import React, { useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import RNBootSplash from 'react-native-bootsplash'
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context'
import { RootStore, RootStoreProvider, setupRootStore } from 'store'
import { RootComponent } from './root-component'
// import { ErrorBoundary } from './views/error/error-boundary'
import Bugsnag from '@bugsnag/react-native'

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
  if (!rootStore) return null
  return (
    <ErrorBoundary FallbackComponent={ErrorView}>
      <RootStoreProvider value={rootStore}>
        <SafeAreaProvider initialMetrics={initialWindowMetrics}>
          <RootComponent />
        </SafeAreaProvider>
      </RootStoreProvider>
    </ErrorBoundary>
  )
}

const ErrorView = (props) => {
  return (
    <View style={{ flex: 1, backgroundColor: 'black' }}>
      <Text style={{ fontFamily: 'mono', textAlign: 'center', color: 'red', fontSize: 20 }}>
        Error :(
      </Text>
      <Text style={{ fontFamily: 'mono', textAlign: 'center' }}>
        Developers have been notified.
      </Text>
      <Text style={{ fontFamily: 'mono' }}>{JSON.stringify(props)}</Text>
    </View>
  )
}
