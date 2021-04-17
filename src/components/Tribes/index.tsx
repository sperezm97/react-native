import React, { useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { useObserver } from 'mobx-react-lite'
import { useNavigation } from '@react-navigation/native'
import AntDesignIcon from 'react-native-vector-icons/AntDesign'

import { useStores, useTheme } from '../../store'
import TabBar from '../common/TabBar'
import Header from './Header'
import Button from '../common/Button'
import OwnedTribes from './OwnedTribes'
import Typography from '../common/Typography'
import Divider from '../common/Layout/Divider'

export default function Tribes() {
  const { ui, chats } = useStores()
  const theme = useTheme()
  const navigation = useNavigation()

  useEffect(() => {
    chats.getTribes()
  }, [])

  const discoverTribesPress = () => navigation.navigate('DiscoverTribes')

  return useObserver(() => (
    <View style={{ ...styles.wrap, backgroundColor: theme.bg }}>
      <Header />
      <View style={styles.content}>
        <View style={{ ...styles.buttonWrap }}>
          <Button icon={() => <AntDesignIcon name='find' color={theme.icon} size={18} />} color={theme.special} w={140} size='small' fs={12} onPress={discoverTribesPress}>
            Discover
          </Button>
        </View>
        <Divider w='93%' mb={8} />
        <View style={{ ...styles.headerWrap }}>
          <Typography size={21}>My Tribes</Typography>
        </View>
        <OwnedTribes />
      </View>
      <TabBar />
    </View>
  ))
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1
  },
  content: {
    flex: 1
  },
  buttonWrap: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 14,
    paddingTop: 6
  },
  headerWrap: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 14,
    paddingLeft: 14
  }
})
