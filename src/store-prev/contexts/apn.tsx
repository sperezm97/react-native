import React, { useState } from 'react'
import * as PushNotification from 'react-native-push-notification'

export const APNContext = React.createContext({
  token: '',
  configure: (callback, finishCallback) => {
    console.log(callback, finishCallback)
  },
})

export const useApn = () => React.useContext(APNContext)

export default function APNManager(props) {
  const [token, setToken] = useState('')

  const configure = (callback, finishCallback) => {
    PushNotification.configure({
      onRegister: function ({ token }) {
        setToken(token)
        if (callback) callback(token)
      },
      onNotification: finishCallback,
      onError: () => {},
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: true,
    })
  }

  return (
    <APNContext.Provider
      value={{
        configure,
        token,
      }}
    >
      {props.children}
    </APNContext.Provider>
  )
}
