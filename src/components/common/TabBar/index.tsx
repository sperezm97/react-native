import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Animated } from 'react-native'
import { IconButton } from 'react-native-paper'
import { useTheme } from '../../../store'
import Pushable from '../Pushable'

const icons = {
  Dashboard: 'arrow-bottom-left',
  Profile: 'format-list-bulleted'
  // '':'qrcode-scan',
  // '':'arrow-top-right'
}

export default function TabBar({ state, descriptors, navigation }) {
  const theme = useTheme()
  const focusedOptions = descriptors[state.routes[state.index].key].options
  const { width } = Dimensions.get('window')

  const tabbarWidth = width - 32

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
            <IconButton icon={icons[label]} size={32} color={theme.white} style={{ width: tabbarWidth / 5 }} />
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
