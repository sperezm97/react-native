import React, { useEffect, useState } from 'react'
// import { Notifications } from 'react-native-notifications'
import * as PushNotification from 'react-native-push-notification'
import PushNotificationIOS from '@react-native-community/push-notification-ios'

import { useStores } from '../index'

export const APNContext = React.createContext({
  token: ''
})

export const useApn = () => React.useContext(APNContext)

export default function APNManager(props) {
  const [token, setToken] = useState('')
  const { user } = useStores()

  // console.log('user', user)

  useEffect(() => {
    // PushNotification.localNotification({
    //   title: 'Local Notification',
    //   message: 'My Notification Message',
    //   playSound: false,
    //   soundName: 'default',
    //   actions: '["Yes", "No"]'
    // })

    // Notifications.registerRemoteNotifications()

    // Notifications.events().registerRemoteNotificationsRegistered(event => {
    //   const token = event.deviceToken
    //   setToken(token)
    //   alert(token)
    //   user.registerMyDeviceId(token)
    // })

    // Notifications.events().registerNotificationReceivedForeground(
    //   (notification, completion) => {
    //     completion({ alert: false, sound: false, badge: false })
    //   }
    // )
    // Notifications.events().registerNotificationOpened((notification, completion) => {
    //   completion()
    // })

    PushNotification.configure({
      onRegister: function ({ token, os }) {
        user.registerMyDeviceId(token)
        // alert(token)
        setToken(token)
      },
      onNotification: function (notification) {
        // alert(JSON.stringify(notification))

        alert(`what's the action? ${JSON.stringify(notification.data.aps.alert.action)}`)

        if (notification.userInteraction && notification.finish) {
          PushNotificationIOS.setApplicationIconBadgeNumber(0)
          notification.finish(PushNotificationIOS.FetchResult.NoData)

          // notification.finish()
          // PushNotification.setApplicationIconBadgeNumber(0)
        }
      },
      // onAction: function (notification) {
      //   alert(`Action::=> ${notification.action}`)

      //   // process the action
      // },
      onError: error => {
        console.log('Error configuring notifications', error)
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true
      },
      // senderID: '250697568790', // ANDROID ONLY: FCM Sender ID (product_number) (optional - not required for local notifications, but is need to receive remote push notifications)
      popInitialNotification: true,
      requestPermissions: true
    })
  }, [])

  return (
    <APNContext.Provider
      value={{
        token
      }}
    >
      {props.children}
    </APNContext.Provider>
  )
}
