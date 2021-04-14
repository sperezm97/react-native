import React from 'react'

import { createStackNavigator } from '@react-navigation/stack'
import { TransitionSpecs, TransitionPresets } from '@react-navigation/stack'

import Chats from '../chat/Navigation'
import Account from '../Account/Navigation'
import Payment from '../Payment/Navigation'
import Contacts from '../Contacts/Navigation'
import Home from '../Home'

const RootStack = createStackNavigator()

export default function Root() {
  return (
    <RootStack.Navigator initialRouteName='Chats'>
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
        name='Contacts'
        component={Contacts}
        options={{
          headerShown: false
        }}
      />
    </RootStack.Navigator>
  )
}

// export default function Root() {
//   return (
//     <RootStack.Navigator
//       mode='modal'
//       // screenOptions={{
//       //   headerShown: true
//       // }}
//       screenOptions={({ route, navigation }) => ({
//         headerShown: false,
//         gestureEnabled: true,
//         cardOverlayEnabled: true,
//         headerStatusBarHeight: navigation.dangerouslyGetState().routes.findIndex(r => r.key === route.key) > 0 ? 0 : undefined
//         // ...TransitionPresets.ModalPresentationIOS
//       })}
//     >
//       <RootStack.Screen name='Main' component={MainStackScreen} options={{ headerShown: false }} />
//       <RootStack.Screen name='MyModal' component={ModalScreen} />
//     </RootStack.Navigator>
//   )
// }
