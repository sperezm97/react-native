import React from 'react'
import { View } from 'react-native'

import { useTheme } from 'store'
import Media from './Media'

export default function Feed({ feed }) {
  const theme = useTheme()
  console.log('here in the feed')
  return (
    <View style={{ ...styles.wrap, backgroundColor: theme.bg }}>
      {feed.map((f, index) => {
        return (
          <Media
            index={index}
            mediaLength={feed.length}
            key={f.id}
            id={f.id}
            {...f}
            tribe={f.tribe}
            chat={f.tribe.chat}
          />
        )
      })}
    </View>
  )
}

const styles = {
  wrap: {
    flex: 1,
  },
}
