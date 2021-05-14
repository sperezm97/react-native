import React, { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { useObserver } from 'mobx-react-lite'
import { Notifications } from 'react-native-notifications'
import PushNotificationIOS from '@react-native-community/push-notification-ios'
import Clipboard from '@react-native-community/clipboard'
import Toast from 'react-native-simple-toast'

import { useStores, useTheme } from '../../store'
import { useApn } from '../../store/contexts/apn'
import { SCREEN_WIDTH, TOAST_DURATION } from '../../constants'
import TabBar from '../common/TabBar'
import Header from './Header'
import OwnedTribes from './OwnedTribes'
import Typography from '../common/Typography'

export default function Tribes() {
  const theme = useTheme()

  const apn = useApn()

  // useEffect(() => {
  //   Notifications.registerRemoteNotifications()

  //   Notifications.events().registerRemoteNotificationsRegistered(event => {
  //     setDevice(event.deviceToken)

  //     alert(event.deviceToken)
  //     alert(`token::${event.deviceToken}`)

  //     console.log('Device Token Received', event.deviceToken)
  //   })

  //   Notifications.events().registerNotificationReceivedForeground(
  //     (notification, completion) => {
  //       console.log(
  //         `Notification received in foreground: ${notification.title} : ${notification.body}`
  //       )
  //       completion({ alert: false, sound: false, badge: false })
  //     }
  //   )

  //   Notifications.events().registerNotificationOpened((notification, completion) => {
  //     console.log(`Notification opened: ${notification.payload}`)
  //     completion()
  //   })
  // }, [])

  function handlePress() {
    Clipboard.setString(apn.token)
    Toast.showWithGravity('Public Key Copied.', TOAST_DURATION, Toast.CENTER)
  }

  return useObserver(() => {
    return (
      <View style={{ ...styles.wrap, backgroundColor: theme.bg }}>
        <Header />
        <Typography onPress={handlePress}>{apn.token}</Typography>
        <OwnedTribes />
        <TabBar />
      </View>
    )
  })
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1
  },
  searchWrap: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 14,
    paddingLeft: 14
  }
})
