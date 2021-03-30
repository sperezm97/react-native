import React from 'react'
import { View, StyleSheet, Text, Image } from 'react-native'
import { useObserver } from 'mobx-react-lite'
import { Button } from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import { useStores, useTheme } from '../../store'
import Slider from '../utils/slider'

export default function Welcome(props) {
  const { onDone, z, show } = props
  const { user } = useStores()
  const theme = useTheme()

  async function go() {
    onDone()
  }

  return useObserver(() => {
    return (
      <Slider z={z} show={show} accessibilityLabel='onboard-welcome'>
        <View style={styles.wrap}>
          <View style={styles.center} accessibilityLabel='onboard-welcome-center'>
            <Text style={styles.top}>A message from your friend...</Text>
            <Image source={require('../../../android_assets/avatar.png')} style={{ width: 120, height: 120 }} resizeMode={'cover'} />
            <Text style={styles.name}>{user.invite.inviterNickname || 'Inviter'}</Text>
            <Text style={{ ...styles.message, color: theme.darkGrey }}>{`"${user.invite.welcomeMessage || 'Welcome to N2N2!'}"`}</Text>
          </View>
          <Button mode='contained' accessibilityLabel='onboard-welcome-button' onPress={go} style={{ ...styles.button, backgroundColor: theme.primary }} contentStyle={{ height: 70 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: theme.white }}>Get Started</Text>
            <View style={{ width: 12, height: 1 }}></View>
            <Icon name='arrow-right' color={theme.white} size={18} />
          </Button>
        </View>
      </Slider>
    )
  })
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    flexDirection: 'column'
  },
  top: {
    fontSize: 32,
    textAlign: 'center',
    marginLeft: 50,
    marginRight: 50,
    marginBottom: 50
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 20
  },
  message: {
    fontSize: 20,
    marginTop: 20
  },
  button: {
    borderRadius: 30,
    width: '75%',
    marginTop: 28,
    marginBottom: 42
  }
})
