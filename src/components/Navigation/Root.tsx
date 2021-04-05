import React from 'react'

import { createStackNavigator } from '@react-navigation/stack'

import Dashboard from '../dash/dashnav'
import Payment from '../Payment'
import Profile from '../profile/profile'

const RootStack = createStackNavigator()

export default function Root() {
  return (
    <RootStack.Navigator initialRouteName='Dashboard'>
      <RootStack.Screen
        name='Dashboard'
        component={Dashboard}
        options={{
          headerShown: false
        }}
      />
      <RootStack.Screen
        name='Payment'
        component={Payment}
        options={{
          headerShown: false,
          animationEnabled: false
        }}
      />
      <RootStack.Screen
        name='Profile'
        component={Profile}
        options={{
          headerShown: false,
          animationEnabled: false
        }}
      />
    </RootStack.Navigator>
  )
}
