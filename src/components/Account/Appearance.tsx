import React from 'react'
import { StyleSheet, View } from 'react-native'
import { useDarkMode } from 'react-native-dynamic'
import { useObserver } from 'mobx-react-lite'
import { RadioButton } from 'react-native-paper'

import { useTheme } from '../../store'
import BackHeader from '../common/BackHeader'
import { setTint } from '../common/StatusBar'

export default function Network() {
  const theme = useTheme()

  const isDark = useDarkMode()
  function selectAppearance(a) {
    if (a === 'System') theme.setDark(isDark)
    if (a === 'Dark') theme.setDark(true)
    if (a === 'Light') theme.setDark(false)
    theme.setMode(a)
    setTimeout(() => setTint(theme.dark ? 'dark' : 'light'), 150)
  }

  return useObserver(() => (
    <View style={{ ...styles.wrap, backgroundColor: theme.bg }}>
      <BackHeader title='Appearance' />
      <View style={{ ...styles.content }}>
        <RadioButton.Group onValueChange={(value) => selectAppearance(value)} value={theme.mode}>
          <RadioButton.Item label='Dark' value='Dark' />
          <Border />
          <RadioButton.Item label='Light' value='Light' />
          <Border />
          <RadioButton.Item label='System' value='System' style={{ shadowColor: theme.primary }} />
        </RadioButton.Group>
      </View>
    </View>
  ))
}

function Border() {
  const theme = useTheme()

  return <View style={{ ...styles.borderBottom, borderBottomColor: theme.border }} />
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
  },
  content: {
    marginTop: 40,
  },
  borderBottom: {
    borderBottomWidth: 1,
  },
})
