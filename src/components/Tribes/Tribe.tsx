import React from 'react'
import { View, StyleSheet } from 'react-native'
import { useObserver } from 'mobx-react-lite'
import { useNavigation } from '@react-navigation/native'

import { useStores, useTheme, hooks } from '../../store'
import BackHeader from '../common/BackHeader'
import Typography from '../common/Typography'
import List from './List'

const { useTribes } = hooks

export default function Tribe({ route }) {
  const { ui } = useStores()
  const theme = useTheme()
  const navigation = useNavigation()

  const tribe = route.params.tribe

  return useObserver(() => {
    // const tribes = useTribes()

    return (
      <View style={{ ...styles.wrap, backgroundColor: theme.bg }}>
        <BackHeader title={tribe.name} navigate={() => navigation.goBack()} />
        <View style={styles.content}>
          <Typography color={theme.text} size={20}>
            Hello {tribe.name}!
          </Typography>
          {/* <List data={tribesToShow} /> */}
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
    flex: 1,
    paddingTop: 18,
    paddingRight: 14,
    paddingLeft: 14
  }
})
