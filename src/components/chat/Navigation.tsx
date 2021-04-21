import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import { useTheme } from '../../store'
import { setTint } from '../common/StatusBar'
import Chats from './Chats'

const Stack = createStackNavigator()

export default function Navigation() {
  const theme = useTheme()

  return (
    <Stack.Navigator initialRouteName='Tribes'>
      <Stack.Screen
        name='Chats'
        component={Chats}
        listeners={{ focus: () => setTint('dark') }}
        options={{
          headerShown: false
        }}
      />
    </Stack.Navigator>
  )
}
