import React from 'react'
import { StyleSheet, View } from 'react-native'

import { useTheme } from '../../../store'
import Typography from '../Typography'

export default function LabelBadge(props) {
  let { bg, color, p = 10, mt = 5, mb = 5, ml = 5, mr = 5, children } = props

  const theme = useTheme()

  const styles = {
    backgroundColor: bg ? bg : theme.main,
    padding: p,
    marginTop: mt,
    marginBottom: mb,
    marginLeft: ml,
    marginRight: mr,
    borderRadius: 25
  }

  return (
    <View style={{ ...styles }}>
      <Typography color={color}>{children}</Typography>
    </View>
  )
}
