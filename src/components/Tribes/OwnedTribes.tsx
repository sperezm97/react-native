import React from 'react'
import { StyleSheet, View } from 'react-native'
import { useObserver } from 'mobx-react-lite'
import { useNavigation } from '@react-navigation/native'

import { useStores, useTheme, hooks } from '../../store'
import { useOwnedTribes } from '../../store/hooks/tribes'
import BackHeader from '../common/BackHeader'
import Typography from '../common/Typography'
import List from './List'
import Button from '../common/Button'

const { useTribes } = hooks

export default function OwnedTribes() {
  const { ui } = useStores()
  const theme = useTheme()
  const navigation = useNavigation()

  return useObserver(() => {
    const tribes = useTribes()
    const tribesToShow = useOwnedTribes(tribes)

    return (
      <View style={{ ...styles.wrap, backgroundColor: theme.bg }}>
        {/* <BackHeader title='Owned Tribes' navigate={() => navigation.goBack()} /> */}
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
