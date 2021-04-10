import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import { Appbar } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'

import { useTheme } from '../../../store'
import Icon from '../Icon'

export default function BackHeader({ title, screen, action, navigate }) {
  const theme = useTheme()
  const navigation = useNavigation()

  function onBack() {
    requestAnimationFrame(() => {
      if (navigate) {
        return navigate()
      }

      navigation.navigate(screen)
    })
  }

  return (
    <Appbar.Header style={{ ...styles.appBar, backgroundColor: theme.bg, borderBottomColor: theme.border }}>
      <TouchableOpacity onPress={onBack} style={{ ...styles.left }}>
        <Icon name='ChevronLeft' size={28} color={theme.icon} />
      </TouchableOpacity>
      <View>
        <Text style={{ ...styles.title, color: theme.text }}>{title}</Text>
      </View>

      {action && <View style={{ ...styles.right }}>{action}</View>}
    </Appbar.Header>
  )
}

BackHeader.defaultProps = {
  screen: 'Account',
  action: null,
  navigate: null
}

const styles = StyleSheet.create({
  appBar: {
    elevation: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'relative'
  },
  left: {
    position: 'absolute',
    left: 10
  },
  right: {
    position: 'absolute',
    right: 10
  },
  title: {
    fontSize: 17,
    fontWeight: '500'
  }
})
