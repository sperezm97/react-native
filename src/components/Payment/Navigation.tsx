import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import { useTheme } from '../../store'
import { setTint } from '../common/StatusBar'
import Payment from './index'
import AddSats from './AddSats'

const Stack = createStackNavigator()

export default function Navigation() {
  const theme = useTheme()

  return (
    <Stack.Navigator initialRouteName='Payment'>
      <Stack.Screen
        name='Payment'
        component={Payment}
        listeners={{ focus: () => setTint('dark') }}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name='AddSats'
        component={AddSats}
        listeners={{ focus: () => setTint('dark') }}
        options={{
          headerShown: false
        }}
      />
    </Stack.Navigator>
  )
}
