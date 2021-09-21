import React, { useState, useEffect } from 'react'
import { RootStore, RootStoreProvider, setupRootStore } from 'stores'
import { Provider as PaperProvider } from 'react-native-paper'
import { paperTheme } from '../src/theme'
import { IconFonts } from 'components/icon-fonts'
import { RootComponent } from 'components/root-component'
import { useTheme } from 'store'

const App = () => {
  const [rootStore, setRootStore] = useState<RootStore | undefined>(undefined)

  // Kick off initial async loading actions like setting up rootStore.
  // Any init actions requiring the store, we do instead in RootComponent.
  useEffect(() => {
    ;(async () => {
      setupRootStore().then(setRootStore)
    })()
  }, [])

  const theme = useTheme()
  const pTheme = paperTheme(theme)

  // Before we show the app, we have to wait for our state to be ready.
  // In the meantime, don't render anything. This will be the background
  // color set in native by rootView's background color.
  // In iOS: application:didFinishLaunchingWithOptions:
  // In Android: https://stackoverflow.com/a/45838109/204044
  // You can replace with your own loading component if you wish.
  if (!rootStore) return null //  || !isNavigationStateRestored

  // otherwise, we're ready to render the app
  return (
    <PaperProvider theme={pTheme}>
      <>
        <IconFonts />
        <RootStoreProvider value={rootStore}>
          <RootComponent />
        </RootStoreProvider>
      </>
    </PaperProvider>
  )
}

export default App
