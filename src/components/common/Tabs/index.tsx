import React from 'react'
import { Text } from 'react-native'
import { TabBar } from 'react-native-tab-view'

import { useTheme } from '../../../store'

export default function Tabs(props) {
  const theme = useTheme()

  return (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: theme.primary }}
      style={{ backgroundColor: theme.bg }}
      renderLabel={({ route }) => <Text style={{ color: theme.title }}>{route.title}</Text>}
    />
  )
}
