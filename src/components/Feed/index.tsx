import React from 'react'
import { StyleSheet, View } from 'react-native'

import { useTheme } from '../../store'
import Media from './Media'
import Divider from '../common/Layout/Divider'

export default function Feed({ feed }) {
  const theme = useTheme()

  // return useObserver(() => {
  return (
    <View style={{ ...styles.wrap, backgroundColor: theme.bg }}>
      <Divider mt={5} mb={5} />

      {feed.map((f, index) => {
        return (
          <View key={index} style={{ ...styles.container }}>
            <Media
              index={index}
              mediaLength={feed.length}
              key={f.id}
              id={f.id}
              {...f}
              tribe={f.tribe}
              chat={f.tribe.chat}
              // onMediaPress={onMediaPress}
            />
          </View>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1
  },
  container: {}
})
