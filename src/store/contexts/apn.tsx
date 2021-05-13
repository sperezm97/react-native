import React, { useEffect, useState } from 'react'
import { Notifications } from 'react-native-notifications'

import { useStores } from '../index'

export const APNContext = React.createContext({
  token: ''
})

export const useApn = () => React.useContext(APNContext)

export default function APNManager(props) {
  const [token, setToken] = useState('')
  const { user } = useStores()

  useEffect(() => {
    Notifications.registerRemoteNotifications()

    Notifications.events().registerRemoteNotificationsRegistered(event => {
      const token = event.deviceToken
      setToken(token)
      alert(token)
      user.registerMyDeviceId(token)
    })

    Notifications.events().registerNotificationReceivedForeground(
      (notification, completion) => {
        completion({ alert: false, sound: false, badge: false })
      }
    )
    Notifications.events().registerNotificationOpened((notification, completion) => {
      completion()
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
