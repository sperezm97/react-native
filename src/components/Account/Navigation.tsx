import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import { useTheme } from '../../store'
import { setTint } from '../common/StatusBar'
import Account from './index'
import AccountDetails from './AccountDetails'
import Network from './Network'
import Security from './Security'
import Appearance from './Appearance'
import PublicKey from './PublicKey'
import Support from './Support'

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
        name='Settings'
        component={AccountDetails}
        listeners={{ focus: () => setTint('dark') }}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name='Network'
        component={Network}
        listeners={{ focus: () => setTint(theme.dark ? 'black' : 'light') }}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name='Security'
        component={Security}
        listeners={{ focus: () => setTint(theme.dark ? 'black' : 'light') }}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name='Appearance'
        component={Appearance}
        listeners={{ focus: () => setTint(theme.dark ? 'black' : 'light') }}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name='QRCode'
        component={PublicKey}
        listeners={{ focus: () => setTint(theme.dark ? 'black' : 'light') }}
        options={{
          headerShown: false
        }}
      />

      <Stack.Screen
        name='Support'
        component={Support}
        listeners={{ focus: () => setTint(theme.dark ? 'black' : 'light') }}
        options={{
          headerShown: false
        }}
      />
    </Stack.Navigator>
  )
}
