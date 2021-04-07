import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { useDarkMode } from 'react-native-dynamic'
import { useObserver } from 'mobx-react-lite'
import { Appbar, RadioButton } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'

import { useTheme } from '../../store'
import TabBar from '../common/TabBar'
// import Header from '../common/Header'

export default function Network() {
  const theme = useTheme()

  const isDark = useDarkMode()
  function selectAppearance(a) {
    if (a === 'System') theme.setDark(isDark)
    if (a === 'Dark') theme.setDark(true)
    if (a === 'Light') theme.setDark(false)
    theme.setMode(a)
  }

  return useObserver(() => (
    <View style={{ ...styles.wrap, backgroundColor: theme.main }}>
      <Header />
      <View style={{ flex: 1 }}>
        <View style={{ ...styles.box, backgroundColor: theme.bg }}>
          <RadioButton.Group onValueChange={value => selectAppearance(value)} value={theme.mode}>
            <RadioButton.Item label='Dark' value='Dark' />
            <Border />
            <RadioButton.Item label='Light' value='Light' />
            <Border />
            <RadioButton.Item label='System' value='System' style={{ shadowColor: theme.primary }} />
          </RadioButton.Group>
        </View>
      </View>
    </View>
  ))
}

function Border() {
  const theme = useTheme()

  return <View style={{ ...styles.borderBottom, borderBottomColor: theme.border }}></View>
}

function Header() {
  const theme = useTheme()
  const navigation = useNavigation()

  function onBack() {
    requestAnimationFrame(() => {
      navigation.navigate('Account')
    })
  }

  return (
    <Appbar.Header style={{ ...styles.appBar, backgroundColor: theme.main, borderBottomColor: theme.border }}>
      <Appbar.BackAction onPress={onBack} color={theme.icon} size={20} />
      {/* <View style={styles.textWrap}>
    <TouchableOpacity onPress={clickTitle} style={styles.title}>
    </TouchableOpacity>
  </View> */}
    </Appbar.Header>
  )
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    flex: 1
  },
  box: {
    marginTop: 40
  },
  borderBottom: {
    borderBottomWidth: 1
  },
  appBar: {
    elevation: 0,
    height: 50
  }
})
