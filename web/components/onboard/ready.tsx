import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { ActivityIndicator } from 'react-native-paper'

import { useStores, useTheme } from 'store'
import actions from 'store/actions'
import { constants } from '../../constants'
import Slider from '../utils/slider'
import Button from '../common/Button'
import Typography from '../common/Typography'

export default function Ready(props) {
  const { z, show, onDone } = props
  const { user, contacts, chats } = useStores()
  const [loading, setLoading] = useState(false)
  const theme = useTheme()

  async function finish() {
    try {
      setLoading(true)

      await user.finishInvite()

      // await user.reportError("ready", { break: "A" });

      await contacts.addContact({
        alias: user.invite.inviterNickname,
        public_key: user.invite.inviterPubkey,
        status: constants.contact_statuses.confirmed,
      })

      // await user.reportError("ready", { break: "B" });

      await actions(user.invite.action)

      // await user.reportError("ready", { break: "C" });

      await chats.joinDefaultTribe()

      onDone()
    } catch (error) {
      await user.reportError('Report component - finish function', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Slider z={z} show={show} accessibilityLabel='onboard-ready'>
      <View style={styles.titleWrap} accessibilityLabel='onboard-ready-title'>
        <View style={styles.titleRow}>
          <Typography size={40} color={theme.white}>
            You're
          </Typography>
          <Typography
            style={{
              marginLeft: 10,
              marginRight: 10,
            }}
            size={40}
            color={theme.white}
            fw='600'
          >
            ready
          </Typography>
        </View>
        <View style={styles.titleRow}>
          <Typography size={40} color={theme.white} lh={50}>
            to use Zion
          </Typography>
        </View>
      </View>
      <View style={styles.msgWrap} accessibilityLabel='onboard-ready-message'>
        <View style={styles.msgRow}>
          <Typography size={20} color={theme.white} textAlign='center' lh={28}>
            You can send messages
          </Typography>
        </View>
        <View style={styles.msgRow}>
          <Typography size={20} color={theme.white} textAlign='center' lh={28}>
            spend
          </Typography>
          <Typography style={styles.msgBold} size={20} color={theme.white} lh={28} fw='600'>
            1000 sats,
          </Typography>
          <Typography size={20} color={theme.white} textAlign='center' lh={28}>
            or receive
          </Typography>
        </View>
        <View style={styles.msgRow}>
          <Typography size={20} color={theme.white} textAlign='center' lh={28}>
            up to
          </Typography>
          <Typography style={styles.msgBold} size={20} color={theme.white} lh={28} fw='600'>
            10000 sats
          </Typography>
        </View>
      </View>
      <View style={styles.buttonWrap} accessibilityLabel='onboard-ready-button-wrap'>
        <Button
          accessibilityLabel='onboard-ready-button'
          onPress={finish}
          color={theme.white}
          size='large'
          w='75%'
          h={55}
          round={40}
          fs={15}
        >
          {loading && <ActivityIndicator animating={loading} color={theme.grey} size={18} />}
          {loading && <View style={{ width: 12, height: 1 }}></View>}
          Finish
        </Button>
      </View>
    </Slider>
  )
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  titleWrap: {
    display: 'flex',
    width: '100%',
  },
  titleRow: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
  },
  msgWrap: {
    display: 'flex',
    maxWidth: 250,
    marginTop: 42,
    marginBottom: 100,
    width: '100%',
  },
  msgRow: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
  },
  msgBold: {
    marginLeft: 8,
    marginRight: 8,
  },
  buttonWrap: {
    position: 'absolute',
    bottom: 42,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
})

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
