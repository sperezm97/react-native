import React, { useEffect } from 'react'
import { StyleSheet, View } from 'react-native'

import { useObserver } from 'mobx-react-lite'

import { useStores, useTheme, hooks } from '../../store'
import { useOwnedTribes } from '../../store/hooks/tribes'
import Typography from '../common/Typography'
import Avatar from '../common/Avatar'
import Button from '../common/Button'
import List from './List'

const { useSearchTribes, useTribes } = hooks

// const tribes = useTribes()

//     const ownedTribes = useOwnedTribes(tribes)

export default function TribesList() {
  const theme = useTheme()
  const { chats } = useStores()

  useEffect(() => {
    chats.getTribes()
  }, [])

  return useObserver(() => {
    const tribesToShow = useSearchTribes()

    return (
      <View style={{ ...styles.wrap, backgroundColor: theme.bg }}>
        <List data={tribesToShow} />
      </View>
    )
  })
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1
  },
  container: {
    flex: 1
  }
})
