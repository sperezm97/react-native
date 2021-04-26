import React from 'react'
import { Text } from 'react-native'
import { TabBar } from 'react-native-tab-view'

import { useTheme } from '../../../store'
import Typography from '../Typography'

export default function Tabs(props) {
  const theme = useTheme()

  return <TabBar {...props} indicatorStyle={{ backgroundColor: theme.primary }} style={{ backgroundColor: theme.bg }} renderLabel={({ route }) => <Typography>{route.title}</Typography>} />
}
