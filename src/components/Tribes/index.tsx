import React, { useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { useObserver } from 'mobx-react-lite'
import AntDesignIcon from 'react-native-vector-icons/AntDesign'

import { useStores, useTheme } from '../../store'
import TabBar from '../common/TabBar'
import Header from './Header'
import Button from '../common/Button'
import OwnedTribes from './OwnedTribes'
import Divider from '../common/Layout/Divider'

export default function Tribes() {
  const { ui, chats } = useStores()
  const theme = useTheme()

  return useObserver(() => (
    <View style={{ ...styles.wrap, backgroundColor: theme.bg }}>
      <Header />
      <View style={styles.content}>
        <OwnedTribes />
      </View>
      <TabBar />
    </View>
  ))
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1
  },
  content: {
    flex: 1
  }
})
