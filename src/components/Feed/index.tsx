import React from 'react'
import { StyleSheet, View } from 'react-native'
import { useObserver } from 'mobx-react-lite'
import { useNavigation } from '@react-navigation/native'

import { useTheme, hooks } from '../../store'
import { useMediaType } from '../../store/hooks/tribes'
import Media from './Media'
import Divider from '../common/Layout/Divider'
const { useMsgs } = hooks

export default function Feed({ feed }) {
  const theme = useTheme()

  // return useObserver(() => {
  return (
    <View style={{ ...styles.wrap, backgroundColor: theme.bg }}>
      <Divider mt={5} mb={5} />

      {feed.map(tribe => {
        return <Item key={tribe.uuid} tribe={tribe} />
      })}
    </View>
  )
  // })
}

function Item({ tribe }) {
  return useObserver(() => {
    const msgs = useMsgs(tribe.chat) || []

    const media = useMediaType(msgs, 6)

    return (
      <>
        {media.length > 0 &&
          media.map((m, index) => {
            return (
              <View key={index} style={{ ...styles.container }}>
                <Media
                  key={m.id}
                  id={m.id}
                  {...m}
                  tribe={tribe}
                  chat={tribe.chat}
                  // onMediaPress={onMediaPress}
                />
              </View>
            )
          })}
      </>
    )
  })
}

const styles = StyleSheet.create({
  wrap: {
    // flex: 1
  },
  container: {}
})
