import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

const ChatsStack = createStackNavigator()

import Chat from './chat'
import Chats from './Chats'
import { DashStackParamList } from '../../../src/types'
import { setTint } from '../utils/statusBar'
import { useTheme } from '../../store'
import Header from '../common/Header'

const Stack = createStackNavigator<DashStackParamList>()

export default function DashNav() {
  const theme = useTheme()

  return (
    <ChatsStack.Navigator initialRouteName='Chats'>
      <ChatsStack.Screen
        name='Chats'
        component={Chats}
        listeners={{ focus: () => setTint('dark') }}
        options={{
          headerShown: false
        }}
      />
      <ChatsStack.Screen
        name='Chat'
        component={Chat}
        listeners={{ focus: () => setTint(theme.dark ? 'black' : 'light') }}
        options={{
          headerShown: false
        }}
      />
    </ChatsStack.Navigator>
  )
}
