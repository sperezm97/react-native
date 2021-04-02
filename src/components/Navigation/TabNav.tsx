import React from 'react'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'

import TabBar from '../common/TabBar'
import Profile from '../profile/profile'

import Payment from '../Payment'
import Dashboard from '../dash/dashnav'
import Header from '../Payment/Header'

const Tab = createBottomTabNavigator()

export default function TabNav() {
  return (
    <Tab.Navigator screenOptions={{}} tabBar={props => <TabBar {...props} />} initialRouteName='Dashboard'>
      <Tab.Screen name='Home' component={Dashboard} />
      <Tab.Screen name='Chat' component={Dashboard} />
      <Tab.Screen name='Payment' component={PaymentScreenStack} />
      <Tab.Screen name='Account' component={Profile} />
    </Tab.Navigator>
  )
}

const PaymentStack = createStackNavigator()

// Payment screen stack
function PaymentScreenStack() {
  return (
    <PaymentStack.Navigator initialRouteName='Payment'>
      <PaymentStack.Screen
        name='Payment'
        component={Payment}
        options={{
          header: () => <Header />
        }}
      />
      <PaymentStack.Screen
        name='Account'
        component={Profile}
        options={
          {
            // headerShown: true
          }
        }
      />
      {/* <PaymentStack.Screen name="Details" component={DetailsScreen} /> */}
    </PaymentStack.Navigator>
  )
}
