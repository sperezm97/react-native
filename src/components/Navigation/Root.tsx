import React from 'react'

import { createStackNavigator } from '@react-navigation/stack'

import Chats from '../chat/Navigation'
import Account from '../Account/Navigation'
import Payment from '../Payment/Navigation'
import Contacts from '../Contacts/Navigation'
import Tribes from '../Tribes/Navigation'
import OwnedTribes from '../Tribes/OwnedTribes'
import JoinedTribes from '../Tribes/JoinedTribes'
import Tribe from '../Tribes/Tribe'
import Home from '../Home'

const RootStack = createStackNavigator()

export default function Root() {
  return (
    <RootStack.Navigator initialRouteName='Tribes'>
      <RootStack.Screen
        name='Home'
        component={Home}
        options={{
          headerShown: false,
          animationEnabled: false
        }}
      />
      <RootStack.Screen
        name='Chats'
        component={Chats}
        options={{
          headerShown: false,
          animationEnabled: false
        }}
      />
      <RootStack.Screen
        name='Payment'
        component={Payment}
        options={{
          headerShown: false,
          animationEnabled: false
        }}
      />
      <RootStack.Screen
        name='Account'
        component={Account}
        options={{
          headerShown: false,
          animationEnabled: false
        }}
      />
      <RootStack.Screen
        name='Tribes'
        component={Tribes}
        options={{
          headerShown: false,
          animationEnabled: false
        }}
      />
      <RootStack.Screen
        name='Contacts'
        component={Contacts}
        options={{
          headerShown: false
        }}
      />
      <RootStack.Screen
        name='OwnedTribes'
        component={OwnedTribes}
        options={{
          headerShown: false
        }}
      />
      <RootStack.Screen
        name='JoinedTribes'
        component={JoinedTribes}
        options={{
          headerShown: false
        }}
      />
      <RootStack.Screen
        name='Tribe'
        component={Tribe}
        options={{
          headerShown: false
        }}
      />
    </RootStack.Navigator>
  )
}
