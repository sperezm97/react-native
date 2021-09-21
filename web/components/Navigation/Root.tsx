import React from 'react'

import { createStackNavigator } from '@react-navigation/stack'

import { useTheme } from 'store'
// import Chats from '../chat/Chats'
// import Chat from '../chat/chat'
// import ChatDetails from '../chat/ChatDetails'
// import Account from '../Account/Navigation'
// import Payment from '../Payment'
// import AddSats from '../Payment/AddSats'
// import Contacts from '../Contacts'
// import Contact from '../Contacts/Contact'
// import Tribes from '../Tribes'
// import DiscoverTribes from '../Tribes/Discover'
// import Tribe from '../Tribes/Tribe'
// import EditTribe from '../Tribes/Tribe/EditTribe'
// import TribeMembers from '../Tribes/Members'
// import Home from '../Home'
import { setTint } from '../../components/common/StatusBar'

const RootStack = createStackNavigator()

export default function Root() {
  const theme = useTheme()

  return (
    <RootStack.Navigator initialRouteName='Tribes'>
      {/* <RootStack.Screen
        name='Home'
        component={Home}
        listeners={{ focus: () => setTint(theme.dark ? 'dark' : 'light') }}
        options={{
          headerShown: false,
          animationEnabled: false
        }}
      /> */}
      {/* <RootStack.Screen
        name='Chats'
        component={Chats}
        listeners={{ focus: () => setTint(theme.dark ? 'dark' : 'light') }}
        options={{
          headerShown: false,
          animationEnabled: false,
        }}
      />
      <RootStack.Screen
        name='Chat'
        component={Chat}
        listeners={{ focus: () => setTint(theme.dark ? 'dark' : 'light') }}
        options={{
          headerShown: false,
        }}
      />
      <RootStack.Screen
        name='ChatDetails'
        component={ChatDetails}
        listeners={{ focus: () => setTint(theme.dark ? 'dark' : 'light') }}
        options={{
          headerShown: false,
        }}
      />
      <RootStack.Screen
        name='Payment'
        component={Payment}
        listeners={{ focus: () => setTint(theme.dark ? 'dark' : 'light') }}
        options={{
          headerShown: false,
          animationEnabled: false,
        }}
      />
      <RootStack.Screen
        name='AddSats'
        component={AddSats}
        listeners={{ focus: () => setTint(theme.dark ? 'dark' : 'light') }}
        options={{
          headerShown: false,
        }}
      />
      <RootStack.Screen
        name='Account'
        component={Account}
        listeners={{ focus: () => setTint(theme.dark ? 'dark' : 'light') }}
        options={{
          headerShown: false,
          animationEnabled: false,
        }}
      />

      <RootStack.Screen
        name='Contacts'
        component={Contacts}
        listeners={{ focus: () => setTint(theme.dark ? 'dark' : 'light') }}
        options={{
          headerShown: false,
        }}
      />
      <RootStack.Screen
        name='Contact'
        component={Contact}
        listeners={{ focus: () => setTint(theme.dark ? 'dark' : 'light') }}
        options={{
          headerShown: false,
        }}
      />
      <RootStack.Screen
        name='Tribes'
        component={Tribes}
        listeners={{ focus: () => setTint(theme.dark ? 'dark' : 'light') }}
        options={{
          headerShown: false,
          animationEnabled: false,
        }}
      />
      <RootStack.Screen
        name='DiscoverTribes'
        component={DiscoverTribes}
        listeners={{ focus: () => setTint(theme.dark ? 'dark' : 'light') }}
        options={{
          headerShown: false,
        }}
      />
      <RootStack.Screen
        name='Tribe'
        component={Tribe}
        listeners={{ focus: () => setTint(theme.dark ? 'dark' : 'light') }}
        options={{
          headerShown: false,
        }}
      />
      <RootStack.Screen
        name='EditTribe'
        component={EditTribe}
        listeners={{ focus: () => setTint(theme.dark ? 'dark' : 'light') }}
        options={{
          headerShown: false,
        }}
      />
      <RootStack.Screen
        name='TribeMembers'
        component={TribeMembers}
        listeners={{ focus: () => setTint(theme.dark ? 'dark' : 'light') }}
        options={{
          headerShown: false,
        }}
      /> */}
    </RootStack.Navigator>
  )
}
