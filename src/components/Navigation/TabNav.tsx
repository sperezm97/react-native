import React from 'react'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import TabBar from '../common/TabBar'
import Dashboard from '../dash/dashnav'
import Profile from '../profile/profile'

const Tab = createBottomTabNavigator()

export default function TabNav() {
  return (
    <Tab.Navigator screenOptions={{}} tabBar={props => <TabBar {...props} />} initialRouteName='Dashboard'>
      <Tab.Screen name='Dashboard' component={Dashboard} />
      <Tab.Screen name='Profile' component={Profile} options={{ tabBarVisible: false }} />
    </Tab.Navigator>
  )
}
