import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import { Appbar } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'

import { useTheme } from '../../../store'
import Icon from '../Icon'
import Typography from '../Typography'

export default function BackHeader({ title, screen, action, navigate, border }) {
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
    <Appbar.Header style={{ ...styles.appBar, backgroundColor: theme.bg, borderBottomColor: theme.border, borderBottomWidth: border ? 1 : 0 }}>
      <TouchableOpacity onPress={onBack} style={{ ...styles.left }}>
        <Icon name='ChevronLeft' size={28} color={theme.icon} />
      </TouchableOpacity>
      <View>
        <Typography color={theme.text} size={16} fw='500'>
          {title}
        </Typography>
      </View>

      {action && <View style={{ ...styles.right }}>{action}</View>}
    </Appbar.Header>
  )
}

BackHeader.defaultProps = {
  screen: 'Account',
  action: null,
  navigate: null,
  title: '',
  border: false
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
  }
})
