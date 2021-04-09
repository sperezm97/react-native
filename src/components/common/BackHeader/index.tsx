import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import { Appbar } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'

import { useTheme } from '../../../store'
import Icon from '../Icon'

export default function BackHeader({ title, action, screen }) {
  const theme = useTheme()
  const navigation = useNavigation()

  function onBack() {
    requestAnimationFrame(() => {
      navigation.navigate(screen)
    })
  }

  return (
    <Appbar.Header style={{ ...styles.appBar, backgroundColor: theme.bg, borderBottomColor: theme.border }}>
      <TouchableOpacity onPress={onBack} style={{ ...styles.backIcon }}>
        <Icon name='ChevronLeft' size={28} color={theme.icon} />
      </TouchableOpacity>
      <View>
        <Text style={{ ...styles.title, color: theme.text }}>{title}</Text>
      </View>
      {action && action}
    </Appbar.Header>
  )
}

BackHeader.defaultProps = {
  screen: 'Account',
  action: null
}

const styles = StyleSheet.create({
  appBar: {
    elevation: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'relative'
  },
  backIcon: {
    position: 'absolute',
    left: 10
  },
  title: {
    fontSize: 17,
    fontWeight: '500'
  }
})
