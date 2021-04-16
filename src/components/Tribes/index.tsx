import React, { useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { useObserver } from 'mobx-react-lite'
import { useNavigation } from '@react-navigation/native'
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5'
import AntDesignIcon from 'react-native-vector-icons/AntDesign'

import { useStores, useTheme } from '../../store'
import TabBar from '../common/TabBar'
import Header from './Header'
import Button from '../common/Button'
import OwnedTribes from './OwnedTribes'

export default function Tribes() {
  const { ui, chats } = useStores()
  const theme = useTheme()
  const navigation = useNavigation()

  useEffect(() => {
    chats.getTribes()
  }, [])

  const ownedTribesPress = () => navigation.navigate('OwnedTribes')
  const discoverTribesPress = () => navigation.navigate('DiscoverTribes')

  return useObserver(() => (
    <View style={{ ...styles.wrap, backgroundColor: theme.bg }}>
      <Header />
      <View style={styles.content}>
        <View style={styles.buttonWrap}>
          {/* <Button icon={() => <FontAwesome5Icon name='users' color={theme.icon} size={16} />} color={theme.special} onPress={ownedTribesPress}>
            Owned Tribes
          </Button> */}
          <Button icon={() => <AntDesignIcon name='find' color={theme.icon} size={18} />} color={theme.special} style={{ marginLeft: 10 }} onPress={discoverTribesPress}>
            Discover
          </Button>
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
    flex: 1,
    paddingTop: 18
  },
  buttonWrap: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 14,
    paddingLeft: 14,
    paddingBottom: 18
  }
})
