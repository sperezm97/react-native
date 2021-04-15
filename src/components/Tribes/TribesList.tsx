import React, { useEffect, useState } from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import { useObserver } from 'mobx-react-lite'

import { useStores, useTheme, hooks } from '../../store'
import Typography from '../common/Typography'

// const { useTribes } = hooks

export default function TribesList() {
  const theme = useTheme()
  const { chats } = useStores()

  useEffect(() => {
    // chats.getTribes()
  }, [])

  //   const TribesToShow = useTribes()

  return useObserver(() => {
    return (
      <View style={{ ...styles.wrap, backgroundColor: theme.bg }}>
        <Typography size={20}>My Tribes</Typography>
      </View>
    )
  })
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1
  }
})
