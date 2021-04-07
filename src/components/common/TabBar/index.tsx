import React from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'

import { useTheme } from '../../../store'
import Pushable from '../Pushable'
import Icon from '../Icon'

export default function TabBar() {
  const theme = useTheme()
  const navigation = useNavigation()
  const current = useRoute()
  const { width } = Dimensions.get('window')
  const tabbarWidth = width - 32

  const routes = [
    {
      name: 'Home',
      icon: 'home',
      key: 'home'
    },
    {
      name: 'Chats',
      icon: 'chat',
      key: 'chat'
    },
    {
      name: 'Payment',
      icon: 'wallet',
      key: 'payment'
    },
    {
      name: 'Profile',
      icon: 'account',
      key: 'account'
    }
  ]

  return (
    <View style={{ ...styles.tabBar, backgroundColor: theme.bg }}>
      {routes.map(route => {
        return (
          <Pushable
            key={route.key}
            onPress={() => {
              navigation.navigate(route.name)
            }}
          >
            <View style={{ ...styles.iconWrapper, width: tabbarWidth / 4 }}>
              <Icon name={route.name} color={route.name === current.name ? theme.primary : theme.icon} size={24} />
            </View>
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
    height: 60,
    paddingLeft: 16,
    paddingRight: 16
  },
  iconWrapper: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center'
  }
})
