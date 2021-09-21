import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import Home from 'components/Home'
import ChatList from '../chatList/chatList'

type PrimaryParamList = {
  Home: undefined
  Chats: undefined
}

const Stack = createStackNavigator<PrimaryParamList>()

export function MainNavigator() {
  return (
    <Stack.Navigator
      initialRouteName='Home'
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name='Home' component={Home} />
      <Stack.Screen name='Chats' component={ChatList} />
    </Stack.Navigator>
  )
}
