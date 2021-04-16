import React from 'react'
import { View, StyleSheet, Text, Image } from 'react-native'
import { useObserver } from 'mobx-react-lite'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import { useStores, useTheme } from '../../store'
import Slider from '../utils/slider'
import Button from '../common/Button'
import Avatar from '../common/Avatar'

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
            <Text style={{ ...styles.top, color: theme.dark ? theme.white : theme.black }}>A message from your friend...</Text>
            <Avatar size={200} />
            <Text style={{ ...styles.name, color: theme.dark ? theme.white : theme.black }}>{user.invite.inviterNickname || 'Inviter'}</Text>
            <Text style={{ ...styles.message, color: theme.title }}>{`"${user.invite.welcomeMessage || 'Welcome to N2N2!'}"`}</Text>
          </View>
          <Button accessibilityLabel='onboard-welcome-button' onPress={go} style={{ ...styles.button, backgroundColor: theme.primary }} size='large' w='75%' h={55} fs={16}>
            Get Started
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
    marginTop: 28,
    marginBottom: 42
  }
})
