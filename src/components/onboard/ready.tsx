import React, { useState } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import RadialGradient from 'react-native-radial-gradient'
import { ActivityIndicator } from 'react-native-paper'

import { useStores, useTheme } from '../../store'
import Slider from '../utils/slider'
import { constants } from '../../constants'
import actions from '../../store/actions'
import Button from '../common/Button'

export default function Ready(props) {
  const { z, show, onDone } = props
  const { user, contacts, chats } = useStores()
  const [loading, setLoading] = useState(false)
  const theme = useTheme()

  async function finish() {
    try {
      setLoading(true)
      await Promise.all([
        user.finishInvite(),
        contacts.addContact({
          alias: user.invite.inviterNickname,
          public_key: user.invite.inviterPubkey,
          status: constants.contact_statuses.confirmed
        }),
        actions(user.invite.action),
        chats.joinDefaultTribe()
      ])

      setLoading(false)
      onDone()
    } catch (error) {
      console.log('error', error)
    }
  }

  return (
    <Slider z={z} show={show} accessibilityLabel='onboard-ready'>
      <RadialGradient style={styles.gradient} colors={[theme.gradient, theme.gradient2]} stops={[0.1, 1]} center={[80, 40]} radius={400}>
        <View style={styles.titleWrap} accessibilityLabel='onboard-ready-title'>
          <View style={styles.titleRow}>
            <Text style={styles.title}>You're</Text>
            <Text style={styles.boldTitle}>ready</Text>
          </View>
          <View style={styles.titleRow}>
            <Text style={styles.title}>to use N2N2</Text>
          </View>
        </View>
        <View style={styles.msgWrap} accessibilityLabel='onboard-ready-message'>
          <View style={styles.msgRow}>
            <Text style={styles.msg}>You can send messages</Text>
          </View>
          <View style={styles.msgRow}>
            <Text style={styles.msg}>spend</Text>
            <Text style={styles.msgBold}>1000 sats,</Text>
            <Text style={styles.msg}>or receive</Text>
          </View>
          <View style={styles.msgRow}>
            <Text style={styles.msg}>up to</Text>
            <Text style={styles.msgBold}>10000 sats</Text>
          </View>
        </View>
        <View style={styles.buttonWrap} accessibilityLabel='onboard-ready-button-wrap'>
          <Button accessibilityLabel='onboard-ready-button' onPress={finish} color={theme.white} size='large' w='75%' h={55} round={40} fs={15}>
            {loading && <ActivityIndicator animating={loading} color={theme.grey} size={18} />}
            {loading && <View style={{ width: 12, height: 1 }}></View>}
            Finish
          </Button>
        </View>
      </RadialGradient>
    </Slider>
  )
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
  },
  titleWrap: {
    display: 'flex',
    width: '100%'
  },
  titleRow: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center'
  },
  title: {
    color: 'white',
    fontSize: 40
  },
  boldTitle: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 40,
    marginLeft: 10,
    marginRight: 10
  },
  msgWrap: {
    display: 'flex',
    maxWidth: 220,
    marginTop: 42,
    marginBottom: 100,
    width: '100%'
  },
  msgRow: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center'
  },
  msg: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
    lineHeight: 28
  },
  msgBold: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
    marginLeft: 8,
    marginRight: 8,
    lineHeight: 28
  },
  buttonWrap: {
    position: 'absolute',
    bottom: 42,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center'
  }
})

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
