import React from 'react'

import { createStackNavigator } from '@react-navigation/stack'

import Chats from '../chat/Navigation'
import Payment from '../Payment'
import Profile from '../profile/profile'

const RootStack = createStackNavigator()

export default function Root() {
  return (
    <RootStack.Navigator initialRouteName='Chat'>
      <RootStack.Screen
        name='Chats'
        component={Chats}
        options={{
          headerShown: false,
          animationEnabled: false
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
