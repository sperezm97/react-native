import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Animated } from 'react-native'
import { IconButton } from 'react-native-paper'

import { useTheme } from '../../../store'
import Pushable from '../Pushable'

const icons = {
  Home: 'home',
  Chat: 'chat',
  Payment: 'credit-card-settings',
  Account: 'account'
}

export default function TabBar({ state, descriptors, navigation }) {
  const theme = useTheme()
  const focusedOptions = descriptors[state.routes[state.index].key].options
  const { width } = Dimensions.get('window')

  const tabbarWidth = width - 42

  if (focusedOptions.tabBarVisible === false) {
    return null
  }

  return (
    <View style={{ ...styles.tabBar, backgroundColor: theme.primary }}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key]
        const label = options.tabBarLabel !== undefined ? options.tabBarLabel : options.title !== undefined ? options.title : route.name

        const isFocused = state.index === index

        return (
          <Pushable
            key={index}
            onPress={() => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true
              })
              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route)
              }
            }}
          >
            <IconButton
              icon={icons[label]}
              size={32}
              style={{ width: tabbarWidth / 4 }}
              color={state.index === index ? theme.white : theme.grey}
              // color={theme.white}
            />
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
