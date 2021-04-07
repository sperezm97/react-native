import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import { Appbar, ActivityIndicator } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import { useObserver } from 'mobx-react-lite'
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import Toast from 'react-native-simple-toast'

import { useStores, useTheme } from '../../store'

export default function Header() {
  const { details, ui } = useStores()
  const theme = useTheme()
  const navigation = useNavigation()

  const showStatusHandler = () => {
    const status = ui.connected ? 'Connected node' : 'Disconnected node'

    Toast.showWithGravity(status, 0.4, Toast.CENTER)
  }

  return useObserver(() => {
    return (
      <Appbar.Header style={{ ...styles.appBar, backgroundColor: theme.bg }}>
        <View style={{ ...styles.flex, ...styles.content }}>
          <View style={{ ...styles.flex, ...styles.left }}>
            {/* <Image source={require('../../assets/n2n2-text.png')} style={styles.brand} resizeMode={'contain'} /> */}
            {ui.loadingHistory ? (
              <ActivityIndicator animating={true} color={theme.grey} size={18} />
            ) : (
              <TouchableOpacity onPress={showStatusHandler}>
                {/* <Icon name='Zap' color={ui.connected ? '#49ca97' : '#febd59'} /> */}
                <MaterialIcon name='lightning-bolt' size={20} color={ui.connected ? '#49ca97' : '#febd59'} />
              </TouchableOpacity>
            )}
          </View>
          <View style={{ ...styles.flex, ...styles.right }}>
            <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
              <Text style={{ ...styles.edit, color: theme.primary }}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Appbar.Header>
    )
  })
}

const styles = StyleSheet.create({
  appBar: {
    elevation: 0,
    height: 20
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
    marginLeft: 14
  },
  right: {
    marginRight: 14,
    justifyContent: 'flex-end'
  },
  brand: {
    width: 65,
    height: 65,
    maxWidth: 65,
    marginLeft: 14
  },
  edit: {
    fontSize: 16
  }
})
