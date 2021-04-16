import React, { useEffect } from 'react'
import { StyleSheet, View } from 'react-native'

import { useObserver } from 'mobx-react-lite'

import { useStores, useTheme, hooks } from '../../store'
import List from './List'

const { useSearchTribes } = hooks

export default function TribesList() {
  const theme = useTheme()
  const { chats } = useStores()

  useEffect(() => {
    chats.getTribes()
  }, [])

  return useObserver(() => {
    // const tribesToShow = useSearchTribes()

    return <View style={{ ...styles.wrap, backgroundColor: theme.bg }}>{/* <List data={tribesToShow} /> */}</View>
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
