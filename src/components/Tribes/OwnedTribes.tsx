import React, { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { useObserver } from 'mobx-react-lite'
import AntDesignIcon from 'react-native-vector-icons/AntDesign'

import { useStores, useTheme, hooks } from '../../store'
import { useOwnedTribes } from '../../store/hooks/tribes'
import Typography from '../common/Typography'
import Button from '../common/Button'
import Empty from '../common/Empty'
import List from './List'

const { useTribes } = hooks

export default function OwnedTribes() {
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const { ui, chats } = useStores()
  const theme = useTheme()

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
        <View style={styles.content}>
          <List
            data={tribesToShow}
            loading={loading}
            refreshing={refreshing}
            onRefresh={onRefresh}
            listEmpty={<ListEmpty />}
          />
        </View>
      </View>
    )
  })
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
