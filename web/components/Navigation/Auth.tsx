import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import { useTheme } from 'store'
import { setTint } from '../common/StatusBar'
// import Onboard from '../onboard'
// import Home from '../onboard/Home'
// import Invite from '../onboard/Invite'

const AuthRootStack = createStackNavigator()

export default function Auth() {
  const theme = useTheme()
  return (
    <>
      <AuthRootStack.Navigator initialRouteName='Home'>
        {/* <AuthRootStack.Screen
          name='Home'
          component={Home}
          listeners={{ focus: () => setTint('dark') }}
          options={{
            headerShown: false,
          }}
        />
        <AuthRootStack.Screen
          name='Invite'
          component={Invite}
          listeners={{ focus: () => setTint('dark') }}
          options={{
            headerShown: false,
          }}
        /> */}
        {/* <AuthRootStack.Screen
          name='Onboard'
          component={Onboard}
          listeners={{ focus: () => setTint('dark') }}
          options={{
            headerShown: false,
          }}
        /> */}
      </AuthRootStack.Navigator>
    </>
  )
}
