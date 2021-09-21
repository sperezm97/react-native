import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { Code, Home } from 'components/onboard'

type PrimaryParamList = {
  Home: undefined
  Code: undefined
}

const Stack = createStackNavigator<PrimaryParamList>()

export function AuthNavigator() {
  return (
    <Stack.Navigator
      initialRouteName='Home'
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name='Home' component={Home} />
      <Stack.Screen name='Code' component={Code} />
    </Stack.Navigator>
  )
}
