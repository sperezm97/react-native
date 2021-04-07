import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

const HomeStack = createStackNavigator()
const ChatStack = createStackNavigator()

import Chat from '../chat/chat'
import Dashboard from './dashboard'
import { DashStackParamList } from '../../../src/types'
import { setTint } from '../utils/statusBar'
import { useTheme } from '../../store'
import Header from '../common/Header'

const Stack = createStackNavigator<DashStackParamList>()

export default function DashNav() {
  const theme = useTheme()

  return (
    <HomeStack.Navigator initialRouteName='Home'>
      <HomeStack.Screen
        name='Home'
        component={Dashboard}
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
    </HomeStack.Navigator>
  )
}
