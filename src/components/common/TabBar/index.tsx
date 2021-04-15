import React from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'
import { useObserver } from 'mobx-react-lite'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import AntDesignIcon from 'react-native-vector-icons/AntDesign'
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5'

import { useTheme } from '../../../store'
import Pushable from '../Pushable'
import Icon from '../Icon'

export default function TabBar() {
  const theme = useTheme()
  const navigation = useNavigation()
  const current = useRoute()
  const insets = useSafeAreaInsets()
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
      key: 'chats'
    },
    {
      name: 'Tribes',
      icon: color => <FontAwesome5Icon name='users' color={color} size={18} />,
      key: 'tribes'
    },
    {
      name: 'Payment',
      icon: 'wallet',
      key: 'payment'
    },
    {
      name: 'Account',
      icon: 'account',
      key: 'account'
    }
  ]

  return useObserver(() => {
    return (
      <View style={{ ...styles.wrap, backgroundColor: theme.bg, borderTopColor: theme.border }}>
        <View style={{ ...styles.tabBar, height: 40 + insets.bottom }}>
          {routes.map(route => {
            return (
              <Pushable
                key={route.key}
                onPress={() => {
                  navigation.navigate(route.name)
                }}
              >
                <View style={{ ...styles.iconWrap, width: tabbarWidth / 5, height: 40 + insets.bottom }}>{renderIcon(route, current, theme)}</View>
              </Pushable>
            )
          })}
        </View>
      </View>
    )
  })
}

function renderIcon(route, current, theme) {
  const iconElement = typeof route.icon === 'function'

  return (
    <>
      {iconElement ? (
        <>{route.icon(route.name === current.name ? theme.primary : theme.icon)}</>
      ) : (
        <Icon name={route.name} color={route.name === current.name ? theme.primary : theme.icon} size={24} />
      )}
    </>
  )
}

const styles = StyleSheet.create({
  wrap: {
    borderTopWidth: 1
  },
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    paddingLeft: 16,
    paddingRight: 16
  },
  iconWrap: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  tabIndicatorWrap: {
    alignItems: 'center',
    position: 'absolute',
    bottom: 10
  },
  tabIndicator: {
    height: 4,
    borderRadius: 2,
    width: '50%'
  }
})
