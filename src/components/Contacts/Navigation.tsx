import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import { setTint } from '../common/StatusBar'
import Contacts from './index'
import Contact from './Contact'

const Stack = createStackNavigator()

export default function Navigation() {
  return (
    <Stack.Navigator initialRouteName='Contacts'>
      <Stack.Screen
        name='Contacts'
        component={Contacts}
        listeners={{ focus: () => setTint('dark') }}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name='Contact'
        component={Contact}
        listeners={{ focus: () => setTint('dark') }}
        options={{
          headerShown: false
        }}
      />
    </Stack.Navigator>
  )
}
