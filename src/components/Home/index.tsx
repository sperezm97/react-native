import React, { useEffect, useState } from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'
import { useObserver } from 'mobx-react-lite'
import { ActivityIndicator } from 'react-native-paper'

import { useStores, useTheme, hooks } from '../../store'
import { useFeed } from '../../store/hooks/tribes'
import { SCREEN_HEIGHT, STATUS_BAR_HEIGHT } from '../../constants'
import TabBar from '../common/TabBar'
import Header from '../common/Header'
import RefreshLoading from '../common/RefreshLoading'
import Feed from '../Feed'

const { useTribes } = hooks

export default function Home() {
  const [refreshing, setRefreshing] = useState(false)
  const [loading, setLoading] = useState(true)
  const { ui, chats, user } = useStores()
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

  return useObserver(() => {
    const allTribes = useTribes()
    const feed = useFeed(allTribes, user.myid)

    return (
      <View style={{ ...styles.wrap, backgroundColor: theme.bg }}>
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
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
  },
})
