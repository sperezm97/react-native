import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Dimensions, Animated } from 'react-native'
import { useObserver } from 'mobx-react-lite'
import { useNavigation, useRoute, useNavigationState } from '@react-navigation/native'
import { useSafeArea } from 'react-native-safe-area-context'

import { useTheme } from '../../../store'
import Pushable from '../Pushable'
import Icon from '../Icon'

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
    name: 'Search',
    icon: 'search',
    key: 'search'
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

export default function TabBar() {
  const [switchAnim] = useState(new Animated.Value(0))
  const theme = useTheme()
  const navigation = useNavigation()
  const current = useRoute()
  const insets = useSafeArea()
  const { width } = Dimensions.get('window')
  const tabbarWidth = width - 32

  const navigationState = useNavigationState(state => state)
  // let index = navigationState.index
  // let routes = navigationState.routes.length

  const indicatorPosition = switchAnim.interpolate({
    inputRange: [0, routes.length - 1],
    outputRange: [0, tabbarWidth - tabbarWidth / 5]
  })

  const currentIndex = routes.findIndex(r => r.name === current.name)

  // console.log('currentIndex', currentIndex)

  useEffect(() => {
    Animated.spring(switchAnim, {
      toValue: currentIndex,
      // duration: 250,
      useNativeDriver: true
    }).start()
  }, [switchAnim])

  return useObserver(() => {
    return (
      <View style={{ backgroundColor: theme.bg }}>
        {/* marginBottom: insets.bottom  */}
        <View style={{ ...styles.tabBar }}>
          {routes.map(route => {
            return (
              <Pushable
                key={route.key}
                onPress={() => {
                  navigation.navigate(route.name)
                }}
              >
                <View style={{ ...styles.iconWrap, width: tabbarWidth / 5 }}>
                  <Icon name={route.name} color={route.name === current.name ? theme.primary : theme.icon} size={24} />
                </View>
              </Pushable>
            )
          })}
        </View>
        {/* <Animated.View  
          style={{
            ...styles.tabIndicatorWrap,
            transform: [
              {
                translateX: indicatorPosition
              }
            ],
            width: tabbarWidth / 5
          }}
        >
          <View style={{ ...styles.tabIndicator, backgroundColor: theme.primary }} />
        </Animated.View> */}
      </View>
    )
  })
}

const styles = StyleSheet.create({
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
