import React, { useEffect, useState } from 'react'
import { View, ScrollView } from 'react-native'
import { observer } from 'mobx-react-lite'
import { ActivityIndicator } from 'react-native-paper'
import { useTheme } from 'store'
import { hooks, useStores } from 'stores'
import { useFeed } from 'stores/hooks/tribes'
import { SCREEN_HEIGHT, STATUS_BAR_HEIGHT } from '../../constants'
import TabBar from '../common/TabBar'
import Header from '../common/Header'
import RefreshLoading from '../common/RefreshLoading'
import Feed from '../Feed'

const { useTribes } = hooks

const Home = observer(() => {
  const [refreshing, setRefreshing] = useState(false)
  const [loading, setLoading] = useState(true)
  const { chats, user } = useStores()
  const theme = useTheme()

  useEffect(() => {
    setLoading(true)
    fetchTribes()
    setTimeout(() => {
      setLoading(false)
    }, 400)
  }, [])

  function fetchTribes() {
    chats.getTribes().then(() => setRefreshing(false))
  }

  function onRefresh() {
    setRefreshing(true)
    fetchTribes()
  }

  const allTribes = useTribes()
  const feed = useFeed(allTribes, user.myid)
  // console.log('feed:', feed)
  // console.log('allTribes:', allTribes)
  // console.log('loading:', loading)

  return (
    <View
      style={{
        ...styles.wrap,
        backgroundColor: theme.bg,
        width: '100vw',
        height: '100vh',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      <Header border={true} />
      <View style={{ flex: 1 }}>
        {loading ? (
          <View style={{ marginTop: 20 }}>
            <ActivityIndicator />
          </View>
        ) : (
          <ScrollView
            keyboardDismissMode='on-drag'
            style={{
              height: SCREEN_HEIGHT - STATUS_BAR_HEIGHT - 44,
            }}
            refreshControl={<RefreshLoading refreshing={refreshing} onRefresh={onRefresh} />}
            showsVerticalScrollIndicator={false}
          >
            <Feed feed={feed} />
          </ScrollView>
        )}
      </View>

      <TabBar />
    </View>
  )
})

export default Home

const styles = {
  wrap: {
    flex: 1,
    height: '100vh',
  },
}
