import React, { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { useObserver } from 'mobx-react-lite'
import { Notifications } from 'react-native-notifications'

import { useStores, useTheme } from '../../store'
import { useApn } from '../../store/contexts/apn'
import TabBar from '../common/TabBar'
import Header from './Header'
import OwnedTribes from './OwnedTribes'

export default function Tribes() {
  const theme = useTheme()

  // const apn = useApn()

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

  return useObserver(() => {
    return (
      <View style={{ ...styles.wrap, backgroundColor: theme.bg }}>
        <Header />
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
