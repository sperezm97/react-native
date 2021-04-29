import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text, ScrollView, RefreshControl } from 'react-native'
import { useObserver } from 'mobx-react-lite'

import { useStores, useTheme, hooks } from '../../store'
import { useJoinedTribes, useFeed } from '../../store/hooks/tribes'
import { SCREEN_HEIGHT, STATUS_BAR_HEIGHT } from '../../constants'
import TabBar from '../common/TabBar'
import Header from '../common/Header'
import RefreshLoading from '../common/RefreshLoading'
import Feed from '../Feed'

const { useTribes } = hooks

export default function Home() {
  const [refreshing, setRefreshing] = useState(false)
  const [loading, setLoading] = useState(true)
  const { ui, chats } = useStores()
  const theme = useTheme()

  useEffect(() => {
    setRefreshing(true)
    chats.getTribes().then(() => setRefreshing(false))
  }, [])

  function _onRefresh() {
    console.log('refreshing...')
  }

  return useObserver(() => {
    const allTribes = useTribes()
    const tribes = useFeed(allTribes)

    return (
      <View style={{ ...styles.wrap, backgroundColor: theme.bg }}>
        <Header />
        <ScrollView
          keyboardDismissMode='on-drag'
          //  ref={_scrollRef}
          style={{
            height: SCREEN_HEIGHT - STATUS_BAR_HEIGHT - 44
          }}
          refreshControl={
            <RefreshLoading refreshing={refreshing} onRefresh={_onRefresh} />
          }
          // scrollEventThrottle={10}
          //  onScroll={_onScroll}
          showsVerticalScrollIndicator={false}
        >
          <Feed data={tribes} />
        </ScrollView>
        <TabBar />
      </View>
    )
  })
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1
  }
})
