import React from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Appbar, IconButton, ActivityIndicator } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import { useObserver } from 'mobx-react-lite'
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import Toast from 'react-native-simple-toast'

import { useStores, useTheme } from '../../store'
import Pushable from '../common/Pushable'

export default function Header() {
  const navigation = useNavigation()
  const { ui } = useStores()
  const theme = useTheme()

  const showStatusHandler = () => {
    const status = ui.connected ? 'Connected node' : 'Disconnected node'

    Toast.showWithGravity(status, 0.4, Toast.CENTER)
  }

  return useObserver(() => {
    return (
      <Appbar.Header style={{ ...styles.appBar, backgroundColor: theme.bg }}>
        <View style={{ ...styles.flex, ...styles.content }}>
          <View style={{ ...styles.flex, ...styles.left }}>
            <Pushable onPress={() => console.log('click')}>
              <IconButton icon='qrcode-scan' size={22} color={theme.icon} />
            </Pushable>
          </View>
          <View style={{ ...styles.flex, ...styles.right }}>
            {ui.loadingHistory ? (
              <ActivityIndicator animating={true} color={theme.grey} size={18} style={{}} />
            ) : (
              <TouchableOpacity onPress={showStatusHandler}>
                <MaterialIcon name='lightning-bolt' size={20} color={ui.connected ? '#49ca97' : '#febd59'} />
              </TouchableOpacity>
            )}
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
    justifyContent: 'space-between',
    width: 50,
    marginLeft: 0
  },
  right: {
    marginRight: 12,
    justifyContent: 'flex-end'
  }
})
