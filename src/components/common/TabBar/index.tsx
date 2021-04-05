import React from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'
import { IconButton } from 'react-native-paper'
import { useNavigation, useRoute } from '@react-navigation/native'

import { useTheme } from '../../../store'
import Pushable from '../Pushable'

export default function TabBar() {
  const theme = useTheme()
  const { width } = Dimensions.get('window')
  const navigation = useNavigation()
  const current = useRoute()
  const tabbarWidth = width - 42

  const routes = [
    {
      name: 'Home',
      icon: 'home',
      key: 'home'
    },
    {
      name: 'Home',
      icon: 'chat',
      key: 'chat'
    },
    {
      name: 'Payment',
      icon: 'credit-card',
      key: 'payment'
    },
    {
      name: 'Profile',
      icon: 'account',
      key: 'account'
    }
  ]

  return (
    <View style={{ ...styles.tabBar, backgroundColor: theme.primary }}>
      {routes.map(route => {
        return (
          <Pushable
            key={route.key}
            onPress={() => {
              navigation.navigate(route.name)
            }}
          >
            <IconButton icon={route.icon} size={32} style={{ width: tabbarWidth / 4 }} color={route.name === current.name ? theme.white : theme.grey} />
          </Pushable>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60
  }
})
