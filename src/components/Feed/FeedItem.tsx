import React, { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { useObserver } from 'mobx-react-lite'
import { useNavigation } from '@react-navigation/native'
import AntDesignIcon from 'react-native-vector-icons/AntDesign'

import { useStores, useTheme, hooks } from '../../store'
import { useMediaType } from '../../store/hooks/tribes'
import Typography from '../common/Typography'
import Button from '../common/Button'
import Empty from '../common/Empty'
import Avatar from '../common/Avatar'
import Media from './Media'
import Divider from '../common/Layout/Divider'

const { useMsgs } = hooks

export default function FeedItem({ tribe }) {
  const theme = useTheme()

  return useObserver(() => {
    const msgs = useMsgs(tribe.chat) || []
    const media = useMediaType(msgs, 6)
    // console.log('media', media.length)

    return (
      <View style={{ ...styles.wrap, backgroundColor: theme.bg }}>
        <Divider mt={5} mb={5} />
        {media.length > 0 &&
          media.map((m, index) => (
            <View key={index} style={{ ...styles.container }}>
              <View style={{ ...styles.header }}>
                <View style={styles.avatarWrap}>
                  <Avatar size={35} photo={tribe.img} round={50} />
                </View>
                <Typography size={14}>{tribe.name}</Typography>
              </View>

              {/* <Typography>{m.amount}</Typography> */}
              <Media
                key={m.id}
                id={m.id}
                // index={index}
                {...m}
                // onMediaPress={onMediaPress}
              />
            </View>
          ))}
      </View>
    )
  })
}

const styles = StyleSheet.create({
  wrap: {
    // flex: 1
  },
  container: {},
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14
    // marginBottom: 10
  },
  avatarWrap: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 10
    // width: 60,
    // height: 60,
    // paddingLeft: 4
  }
})
