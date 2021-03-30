import React from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { Appbar, IconButton, ActivityIndicator } from 'react-native-paper'
import { DrawerActions, useNavigation } from '@react-navigation/native'
import { useObserver } from 'mobx-react-lite'
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import Toast from 'react-native-simple-toast'

import { useStores, useTheme } from '../../../store'

export default function Header(props) {
  const navigation = useNavigation()
  const { details, ui } = useStores()
  const theme = useTheme()

  const showStatusHandler = () => {
    const status = ui.connected ? 'Connected node' : 'Disconnected node'

    Toast.showWithGravity(status, Toast.SHORT, Toast.CENTER)
  }

  return useObserver(() => {
    return (
      <Appbar.Header style={{ ...styles.appBar, backgroundColor: theme.bg }}>
        <View style={{ ...styles.flex, ...styles.content }}>
          <View style={{ ...styles.flex, ...styles.left }}>
            <IconButton
              icon='menu'
              size={30}
              accessibilityLabel='menu-button'
              onPress={() => {
                navigation.dispatch(DrawerActions.openDrawer())
              }}
              color={theme.primary}
            />
            <TouchableOpacity
              onPress={() => {
                navigation.dispatch(DrawerActions.openDrawer())
              }}
              style={{ ...styles.flex }}
            >
              <Image source={require('../../../assets/n2n2-text.png')} style={styles.brand} resizeMode={'contain'} />
            </TouchableOpacity>
          </View>
          <View style={{ ...styles.flex }}>
            <Text>{details.balance} sat</Text>
            {ui.loadingHistory ? (
              <ActivityIndicator animating={true} color='white' size={18} style={{ position: 'absolute', right: 15 }} />
            ) : (
              <TouchableOpacity onPress={showStatusHandler} style={styles.status}>
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
    width: '100%',
    height: '100%'
  },
  left: {
    justifyContent: 'space-between'
  },
  brand: {
    width: 65,
    height: 65,
    marginLeft: 10,
    marginRight: 6
  },
  brandText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff'
  },
  status: {
    width: 24,
    marginRight: 10
  }
})
