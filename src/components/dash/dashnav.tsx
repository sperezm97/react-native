import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import Chat from '../chat/chat'
import Dashboard from './dashboard'
import { DashStackParamList } from '../../../src/types'
import { setTint } from '../utils/statusBar'
import { useTheme } from '../../store'
import Header from '../common/Header'

const Stack = createStackNavigator<DashStackParamList>()

export default function DashNav() {
  const theme = useTheme()
  return (
    <Stack.Navigator initialRouteName='Home'>
      <Stack.Screen
        name='Home'
        component={Dashboard}
        listeners={{ focus: () => setTint('dark') }}
        options={{
          header: props => <Header {...props} />
        }}
      />
      <Stack.Screen name='Chat' component={Chat} listeners={{ focus: () => setTint(theme.dark ? 'black' : 'light') }} />
    </Stack.Navigator>
  )
}
