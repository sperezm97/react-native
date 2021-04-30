import React, { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { useObserver } from 'mobx-react-lite'
import { useNavigation } from '@react-navigation/native'
import AntDesignIcon from 'react-native-vector-icons/AntDesign'
import { IconButton } from 'react-native-paper'

import { useStores, useTheme, hooks } from '../../store'
import { useOwnedTribes } from '../../store/hooks/tribes'
import BackHeader from '../common/BackHeader'
import Typography from '../common/Typography'
import Button from '../common/Button'
import Empty from '../common/Empty'
import Pushable from '../common/Pushable'
import List from './List'

const { useTribes } = hooks

export default function OwnedTribes() {
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const { ui, chats } = useStores()
  const theme = useTheme()
  const navigation = useNavigation()

  useEffect(() => {
    fetchTribes()
  }, [ui.newTribeModal])

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
    const tribesToShow = useOwnedTribes(tribes)

    return (
      <View style={{ ...styles.wrap, backgroundColor: theme.bg }}>
        <BackHeader
          title='My Communities'
          navigate={() => navigation.goBack()}
          action={<HeaderAction />}
        />

        <View style={styles.content}>
          <List
            data={tribesToShow}
            loading={loading}
            refreshing={refreshing}
            onRefresh={onRefresh}
            // listHeader={<ListHeader />}
            listEmpty={<ListEmpty />}
          />
        </View>
      </View>
    )
  })
}

function HeaderAction() {
  const { ui } = useStores()
  const theme = useTheme()

  return (
    <Pushable onPress={() => ui.setNewTribeModal(true)}>
      <IconButton
        icon='plus'
        color={theme.primary}
        size={24}
        style={{ backgroundColor: theme.lightGrey }}
      />
    </Pushable>
  )
}

function ListHeader() {
  const theme = useTheme()
  const navigation = useNavigation()

  const onDiscoverTribesPress = () => navigation.navigate('DiscoverTribes')

  return (
    <>
      <View style={{ ...styles.buttonWrap }}>
        <Button
          icon={() => <AntDesignIcon name='find' color={theme.icon} size={18} />}
          color={theme.special}
          w={140}
          size='small'
          fs={12}
          onPress={onDiscoverTribesPress}
        >
          Discover
        </Button>
      </View>
      {/* <View style={{ ...styles.headerWrap }}>
        <Typography size={18}>My Communities</Typography>
      </View> */}
    </>
  )
}

function ListEmpty() {
  const { ui } = useStores()
  const theme = useTheme()

  return (
    <Empty h={200}>
      <Typography size={16}>Become a community owner to see it listed here.</Typography>
      <Button
        icon={() => <AntDesignIcon name='plus' color={theme.white} size={18} />}
        w={210}
        fs={12}
        onPress={() => ui.setNewTribeModal(true)}
        style={{ marginTop: 20 }}
      >
        Create Community
      </Button>
    </Empty>
  )
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
    paddingTop: 6,
    paddingBottom: 8
  },
  headerWrap: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 14,
    paddingLeft: 14
  },
  emptyWrap: {}
})
