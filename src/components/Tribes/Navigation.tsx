import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import { setTint } from '../common/StatusBar'
import Tribes from './index'
import Tribe from './Tribe'
import OwnedTribes from './OwnedTribes'
import JoinedTribes from './JoinedTribes'

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
      <Stack.Screen
        name='Tribe'
        component={Tribe}
        listeners={{ focus: () => setTint('dark') }}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name='OwnedTribes'
        component={OwnedTribes}
        listeners={{ focus: () => setTint('dark') }}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name='JoinedTribes'
        component={JoinedTribes}
        listeners={{ focus: () => setTint('dark') }}
        options={{
          headerShown: false
        }}
      />
    </Stack.Navigator>
  )
}
