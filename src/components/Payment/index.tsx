import React, { useState } from 'react'
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native'
import { TabView, SceneMap } from 'react-native-tab-view'

import Tabs from '../common/Tabs'
import Container from './Container'

function FirstRoute() {
  return <Container />
}

function SecondRoute() {
  return <Container />
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
      <TabView navigationState={{ index, routes }} renderScene={renderScene} onIndexChange={setIndex} initialLayout={{ width: layout.width }} renderTabBar={props => <Tabs {...props} />} />
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1
  }
})
