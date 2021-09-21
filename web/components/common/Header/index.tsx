import React from 'react'
import { View, StyleSheet, Image, TouchableOpacity, ViewStyle, ImageStyle } from 'react-native'
import { Appbar, ActivityIndicator } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import { useObserver } from 'mobx-react-lite'
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import Toast from 'react-native-simple-toast'

import { useStores, useTheme } from 'store'
import Balance from '../Balance'
import { useDarkMode } from 'react-native-dynamic'

export default function Header({ border = false }) {
  const navigation = useNavigation()
  const { details, ui } = useStores()
  const theme = useTheme()

  const showStatusHandler = () => {
    const status = ui.connected ? 'Connected node' : 'Disconnected node'

    Toast.showWithGravity(status, 0.4, Toast.CENTER)
  }

  const isDarkMode = useDarkMode()
  return useObserver(() => {
    return (
      <Appbar.Header
        style={{
          ...styles.appBar,
          backgroundColor: theme.bg,
          borderBottomWidth: border ? 1 : 0,
          borderBottomColor: theme.border,
        }}
      >
        <View style={{ ...styles.flex, ...styles.content }}>
          <View style={{ ...styles.flex, ...styles.left }}>
            <Image
              source={theme.dark ? require('../../../assets/zion-dark-theme.png') : require('../../../assets/zion.png')}
              style={styles.brand}
              resizeMode={'contain'}
            />
          </View>
          <Balance balance={details.fullBalance} color={theme.dark ? theme.white : theme.black} />
          <View style={{ ...styles.flex, ...styles.right }}>
            {ui.loadingHistory ? (
              <ActivityIndicator animating={true} color={theme.grey} size={18} style={{}} />
            ) : (
              <TouchableOpacity onPress={showStatusHandler} style={{ ...styles.status }}>
                <MaterialIcon name='lightning-bolt' size={20} color={ui.connected ? '#49ca97' : '#febd59'} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Appbar.Header>
    )
  })
}

const styles = {
  appBar: {
    elevation: 0,
    height: 60,
  } as ViewStyle,
  flex: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
  } as ViewStyle,
  content: {
    justifyContent: 'space-between',
    width: '100%',
  } as ViewStyle,
  left: {
    justifyContent: 'space-between',
    width: 50,
    marginLeft: 12,
  } as ViewStyle,
  right: {
    justifyContent: 'flex-end',
    marginRight: 12,
  } as ViewStyle,
  brand: {
    width: 70,
    height: 70,
    maxWidth: 70,
  } as ImageStyle,
  status: {
    width: 20,
  } as ViewStyle,
}
