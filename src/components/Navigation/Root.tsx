import React from 'react'

import { createStackNavigator } from '@react-navigation/stack'

import Chats from '../chat/Navigation'
import Chat from '../chat/chat'
import ChatDetails from '../chat/ChatDetails'
import Account from '../Account/Navigation'
import Payment from '../Payment/Navigation'
import Contacts from '../Contacts/Navigation'
import Tribes from '../Tribes/Navigation'
import DiscoverTribes from '../Tribes/Discover'
import Tribe from '../Tribes/Tribe'
import EditTribe from '../Tribes/Tribe/EditTribe'
import TribeMembers from '../Tribes/Members'
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
        name='Chat'
        component={Chat}
        options={{
          headerShown: false
        }}
      />
      <RootStack.Screen
        name='ChatDetails'
        component={ChatDetails}
        options={{
          headerShown: false
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
        name='DiscoverTribes'
        component={DiscoverTribes}
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
      <RootStack.Screen
        name='EditTribe'
        component={EditTribe}
        options={{
          headerShown: false
        }}
      />
      <RootStack.Screen
        name='TribeMembers'
        component={TribeMembers}
        options={{
          headerShown: false
        }}
      />
    </RootStack.Navigator>
  )
}
