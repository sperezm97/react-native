import React from 'react'
import { StyleSheet, View } from 'react-native'
import { useObserver } from 'mobx-react-lite'
import PushNotificationIOS from '@react-native-community/push-notification-ios'
import Clipboard from '@react-native-community/clipboard'
import Toast from 'react-native-simple-toast'

import { useTheme } from '../../store'
import { useApn } from '../../store/contexts/apn'
import { TOAST_DURATION } from '../../constants'
import TabBar from '../common/TabBar'
import Header from './Header'
import OwnedTribes from './OwnedTribes'
import Typography from '../common/Typography'

export default function Tribes() {
  const theme = useTheme()

  const apn = useApn()

  function handlePress() {
    Clipboard.setString(apn.token)
    Toast.showWithGravity('Token Copied.', TOAST_DURATION, Toast.CENTER)
  }

  return useObserver(() => {
    return (
      <View style={{ ...styles.wrap, backgroundColor: theme.bg }}>
        <Header />
        {/* <Typography onPress={handlePress}>{apn.token}</Typography> */}
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
