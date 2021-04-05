import React, { useState } from 'react'
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native'
import { TabView, SceneMap } from 'react-native-tab-view'
import { FAB } from 'react-native-paper'

import TabBar from '../common/TabBar'
import Tabs from '../common/Tabs'
import Header from './Header'
import Request from './Request'
import Send from './Send'
import { useTheme } from '../../store/'

function FirstRoute() {
  return <Request />
}

function SecondRoute() {
  return <Send />
}

export default function Payment() {
  const layout = useWindowDimensions()
  const [index, setIndex] = useState(0)
  const [routes] = useState([
    { key: 'first', title: 'REQUEST' },
    { key: 'second', title: 'SEND' }
  ])

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute
  })

  return (
    <View style={{ ...styles.wrap }}>
      <Header />
      <TabView navigationState={{ index, routes }} renderScene={renderScene} onIndexChange={setIndex} initialLayout={{ width: layout.width }} renderTabBar={props => <Tabs {...props} />} />
      <TabBar />
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1
  }
})
