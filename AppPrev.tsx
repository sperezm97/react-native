import React, { useEffect, useState } from 'react'
import AppRoot from './AppRoot'
import { RootStore, RootStoreProvider, setupRootStore } from './src/store'
import Splash from './src/components/common/Splash'

export default function App() {
  const [rootStore, setRootStore] = useState<RootStore | undefined>(undefined)

  // Kick off initial async loading actions, like initializing RootStore
  useEffect(() => {
    ;(async () => {
      setupRootStore().then(setRootStore)
    })()
  }, [])

  if (!rootStore) return <Splash />

  return (
    <RootStoreProvider value={rootStore}>
      <AppRoot />
    </RootStoreProvider>
  )
}
