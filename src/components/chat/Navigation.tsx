import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import { setTint } from '../utils/statusBar'
import { useTheme } from '../../store'
import Chat from './chat'
import Chats from './Chats'
import Header from '../common/Header'

const Stack = createStackNavigator()

export default function Navigation() {
  const theme = useTheme()

  return (
    <Stack.Navigator initialRouteName='Chats'>
      <Stack.Screen
        name='Chats'
        component={Chats}
        listeners={{ focus: () => setTint('dark') }}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name='Chat'
        component={Chat}
        listeners={{ focus: () => setTint(theme.dark ? 'black' : 'light') }}
        options={{
          headerShown: false
        }}
      />
    </Stack.Navigator>
  )
}
