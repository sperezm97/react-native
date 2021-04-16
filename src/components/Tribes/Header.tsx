import React from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import { Appbar, IconButton, ActivityIndicator } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import { useObserver } from 'mobx-react-lite'
import Toast from 'react-native-simple-toast'
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'

import { useStores, useTheme } from '../../store'
import Pushable from '../common/Pushable'
import Button from '../common/Button'
import Typography from '../common/Typography'

export default function Header({}) {
  const navigation = useNavigation()
  const { ui } = useStores()
  const theme = useTheme()

  return useObserver(() => {
    return (
      <Appbar.Header style={{ ...styles.appBar, backgroundColor: theme.bg }}>
        <View style={{ ...styles.flex, ...styles.content }}>
          <View style={{ ...styles.flex, ...styles.left }}>
            <Typography color={theme.text} size={28} fw='500' ls={1.5}>
              Communities
            </Typography>
          </View>
          <View style={{ ...styles.flex, ...styles.right }}>
            <Pushable onPress={() => console.log('Pressed')}>
              <IconButton icon='plus' color={theme.primary} size={24} style={{ backgroundColor: theme.lightGrey }} />
            </Pushable>
          </View>
        </View>
      </Appbar.Header>
    )
  })
}

const styles = StyleSheet.create({
  appBar: {
    elevation: 0
  },
  flex: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row'
  },
  content: {
    justifyContent: 'space-between',
    width: '100%'
  },
  left: {
    marginLeft: 12
  },
  right: {
    marginRight: 2
  }
})
