import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import { setTint } from '../common/StatusBar'
import Tribes from './index'

const Stack = createStackNavigator()

export default function Navigation() {
  return (
    <Stack.Navigator initialRouteName='Tribes'>
      <Stack.Screen
        name='Tribes'
        component={Tribes}
        listeners={{ focus: () => setTint('dark') }}
        options={{
          headerShown: false
        }}
      />
    </Stack.Navigator>
  )
}
