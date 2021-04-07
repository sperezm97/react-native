import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import { setTint } from '../utils/statusBar'
import { useTheme } from '../../store'
import Header from '../common/Header'
import Account from './index'
import Network from './Network'
import Security from './Security'
import Appearance from './Appearance'

const Stack = createStackNavigator()

export default function Navigation() {
  const theme = useTheme()

  return (
    <Stack.Navigator initialRouteName='Account'>
      <Stack.Screen
        name='Account'
        component={Account}
        listeners={{ focus: () => setTint('dark') }}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name='Network'
        component={Network}
        listeners={{ focus: () => setTint(theme.dark ? 'black' : 'light') }}
        // options={{
        //   headerShown: false
        // }}
      />
      <Stack.Screen
        name='Security'
        component={Security}
        listeners={{ focus: () => setTint(theme.dark ? 'black' : 'light') }}
        // options={{
        //   headerShown: false
        // }}
      />
      <Stack.Screen
        name='Appearance'
        component={Appearance}
        listeners={{ focus: () => setTint(theme.dark ? 'black' : 'light') }}
        options={{
          headerShown: false
        }}
      />
    </Stack.Navigator>
  )
}
