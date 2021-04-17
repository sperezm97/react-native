import React from 'react'
import { StyleSheet, View } from 'react-native'
import { useObserver } from 'mobx-react-lite'

import { useTheme, hooks } from '../../store'
import { useOwnedTribes } from '../../store/hooks/tribes'
import List from './List'

const { useTribes } = hooks

export default function OwnedTribes() {
  const theme = useTheme()

  return useObserver(() => {
    const tribes = useTribes()
    const tribesToShow = useOwnedTribes(tribes)

    return (
      <View style={{ ...styles.wrap, backgroundColor: theme.bg }}>
        <View style={styles.content}>
          <List data={tribesToShow} />
        </View>
      </View>
    )
  })
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1
  },
  content: {
    flex: 1
  }
})
