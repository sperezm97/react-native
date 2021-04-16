import React, { useState } from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import { useObserver } from 'mobx-react-lite'
import { useNavigation } from '@react-navigation/native'
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5'

import { useStores, useTheme } from '../../store'
import TabBar from '../common/TabBar'
import Header from './Header'
import Button from '../common/Button'
import Search from '../common/Search'
import TribesList from './TribesList'

export default function Tribes() {
  const { ui } = useStores()
  const theme = useTheme()
  const navigation = useNavigation()

  const onTribesSearch = (txt: string) => ui.setTribesSearchTerm(txt)

  const ownedTribesPress = () => navigation.navigate('OwnedTribes')
  const joinedTribesPress = () => navigation.navigate('JoinedTribes')

  return useObserver(() => (
    <View style={{ ...styles.wrap, backgroundColor: theme.bg }}>
      <Header />
      <View style={styles.content}>
        <View style={styles.buttonWrap}>
          <Button icon={() => <FontAwesome5Icon name='users' color={theme.black} size={16} />} color={theme.special} onPress={ownedTribesPress}>
            Owned Tribes
          </Button>
          <Button icon={() => <FontAwesome5Icon name='users' color={theme.black} size={16} />} color={theme.special} style={{ marginLeft: 10 }} onPress={joinedTribesPress}>
            Joined Tribes
          </Button>
        </View>
        <View style={styles.searchWrap}>
          <Search placeholder='Search' value={ui.tribesSearchTerm} onChangeText={onTribesSearch} h={50} />
        </View>
        <TribesList />
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
  },
  searchWrap: {
    paddingBottom: 18,
    paddingRight: 14,
    paddingLeft: 14
  }
})
