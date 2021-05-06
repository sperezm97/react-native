import React, { useEffect, useState } from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { useObserver } from 'mobx-react-lite'
import { useNavigation } from '@react-navigation/native'
import { Appbar } from 'react-native-paper'
import FeatherIcon from 'react-native-vector-icons/Feather'
import AntDesignIcon from 'react-native-vector-icons/AntDesign'

import { useStores, useTheme, hooks } from '../../store'
import { useSearchTribes } from '../../store/hooks/tribes'
import { SCREEN_HEIGHT, STACK_HEADER_HEIGHT } from '../../constants'
import TabBar from '../common/TabBar'
import Search from '../common/Search'
import Typography from '../common/Typography'
import Button from '../common/Button'
import Empty from '../common/Empty'
import Icon from '../common/Icon'
import List from './List'

const { useTribes } = hooks

export default function Discover() {
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const { chats } = useStores()
  const theme = useTheme()

  useEffect(() => {
    fetchTribes()
  }, [])

  function fetchTribes() {
    chats.getTribes().then(() => setLoading(false))
  }

  function onRefresh() {
    setRefreshing(true)
    fetchTribes()
    setRefreshing(false)
  }

  return useObserver(() => {
    const tribes = useTribes()
    const tribesToShow = useSearchTribes(tribes)

    return (
      <View style={{ ...styles.wrap, backgroundColor: theme.bg }}>
        <SearchHeader />
        <List
          data={tribesToShow}
          loading={loading}
          refreshing={refreshing}
          onRefresh={onRefresh}
          listEmpty={<ListEmpty />}
        />
        <TabBar />
      </View>
    )
  })
}

function ListEmpty() {
  const { ui } = useStores()
  const theme = useTheme()

  return (
    <Empty h={SCREEN_HEIGHT - STACK_HEADER_HEIGHT - 60 - 60}>
      <Icon name='Rocket' size={60} />
      <Button
        color={theme.secondary}
        icon={() => <AntDesignIcon name='plus' color={theme.white} size={18} />}
        w='60%'
        onPress={() => ui.setNewTribeModal(true)}
        style={{ marginTop: 20 }}
      >
        Create Community
      </Button>
    </Empty>
  )
}

function SearchHeader() {
  const theme = useTheme()
  const navigation = useNavigation()
  const { ui } = useStores()

  const onTribesSearch = (txt: string) => ui.setTribesSearchTerm(txt)

  return (
    <Appbar.Header
      style={{
        ...styles.appBar,
        backgroundColor: theme.bg,
        borderBottomColor: theme.border
      }}
    >
      <View style={{ ...styles.left }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FeatherIcon name='chevron-left' size={28} color={theme.icon} />
        </TouchableOpacity>
      </View>
      <View style={{ ...styles.right }}>
        <Search
          placeholder='Search Communities'
          value={ui.tribesSearchTerm}
          onChangeText={onTribesSearch}
          h={45}
        />
      </View>
    </Appbar.Header>
  )
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1
  },
  appBar: {
    elevation: 0,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    paddingHorizontal: 12,
    width: '100%'
  },
  left: {
    width: '10%'
  },
  right: {
    flex: 1,
    width: '80%'
  },
  searchWrap: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 14,
    paddingLeft: 14
  }
})
