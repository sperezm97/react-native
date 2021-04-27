import React from 'react'
import { Text } from 'react-native'
import { TabBar } from 'react-native-tab-view'

import { useTheme } from '../../../store'
import Typography from '../Typography'

export default function Tabs(props) {
  const theme = useTheme()

  return (
    <TabBar
      {...props}
      tabStyle={{ borderBottomWidth: 1, borderBottomColor: theme.border }}
      indicatorStyle={{ backgroundColor: theme.primary }}
      pressOpacity={0.5}
      style={{ backgroundColor: theme.bg }}
      renderLabel={({ route }) => <Typography>{route.title}</Typography>}
    />
  )
}
