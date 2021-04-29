import React, { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { useObserver } from 'mobx-react-lite'
import { useNavigation } from '@react-navigation/native'
import AntDesignIcon from 'react-native-vector-icons/AntDesign'

import { useStores, useTheme } from '../../store'
import Typography from '../common/Typography'
import Button from '../common/Button'
import Empty from '../common/Empty'
import Divider from '../common/Layout/Divider'
import FeedItem from './FeedItem'

export default function Feed({ data }) {
  const theme = useTheme()

  // return useObserver(() => {
  return (
    <View style={{ ...styles.wrap, backgroundColor: theme.bg }}>
      <Divider mt={5} mb={5} />

      {data.map(tribe => {
        return <FeedItem key={tribe.uuid} tribe={tribe} />
      })}
    </View>
  )
  // })
}

const styles = StyleSheet.create({
  wrap: {
    // flex: 1
  }
})
