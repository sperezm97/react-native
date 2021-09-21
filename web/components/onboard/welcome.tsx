import React from 'react'
import { StyleSheet, View } from 'react-native'
import { useObserver } from 'mobx-react-lite'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import { useStores, useTheme } from 'store'
import Slider from '../utils/slider'
import Button from '../common/Button'
import Avatar from '../common/Avatar'
import Typography from '../common/Typography'

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
        <View style={{ ...styles.wrap, backgroundColor: theme.bg }}>
          <View style={styles.center} accessibilityLabel='onboard-welcome-center'>
            <Typography
              style={{ ...styles.top }}
              size={32}
              textAlign='center'
              color={theme.dark ? theme.white : theme.black}
            >
              A message from your friend...
            </Typography>
            <Avatar size={200} />
            <Typography style={{ ...styles.name }} size={24} fw='600' color={theme.dark ? theme.white : theme.black}>
              {user.invite.inviterNickname || 'Inviter'}
            </Typography>
            <Typography style={{ ...styles.message }} size={20} color={theme.title}>{`${
              user.invite.welcomeMessage || 'Welcome to Zion!'
            }`}</Typography>
          </View>
          <Button
            accessibilityLabel='onboard-welcome-button'
            onPress={go}
            style={{ ...styles.button, backgroundColor: theme.primary }}
            size='large'
            w='75%'
            h={55}
            fs={16}
          >
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
    flexDirection: 'column',
  },
  top: {
    marginLeft: 50,
    marginRight: 50,
    marginBottom: 50,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    marginTop: 20,
  },
  message: {
    marginTop: 20,
  },
  button: {
    marginTop: 28,
    marginBottom: 42,
  },
})
