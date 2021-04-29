import React, { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { useObserver } from 'mobx-react-lite'
import { useNavigation } from '@react-navigation/native'
import { IconButton } from 'react-native-paper'
import Ionicon from 'react-native-vector-icons/Ionicons'

import { useStores, useTheme, hooks } from '../../store'
import { useMediaType } from '../../store/hooks/tribes'
import { useTribeHistory } from '../../store/hooks/tribes'
import Typography from '../common/Typography'
import Button from '../common/Button'
import Empty from '../common/Empty'
import Avatar from '../common/Avatar'
import Media from './Media'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Divider from '../common/Layout/Divider'

const { useMsgs } = hooks

export default function FeedItem({ tribe }) {
  const theme = useTheme()
  const navigation = useNavigation()

  return useObserver(() => {
    const msgs = useMsgs(tribe.chat) || []
    const media = useMediaType(msgs, 6)

    const { createdDate, lastActiveDate } = useTribeHistory(
      tribe.created,
      tribe.last_active
    )

    const onTribeOwnerPress = () => navigation.navigate('Tribe', { tribe: { ...tribe } })

    return (
      <View style={{ ...styles.wrap, backgroundColor: theme.bg }}>
        {media.length > 0 &&
          media.map((m, index) => {
            return (
              <View key={index} style={{ ...styles.container }}>
                <TouchableOpacity activeOpacity={0.6} onPress={onTribeOwnerPress}>
                  <View style={{ ...styles.header }}>
                    <View style={styles.avatarWrap}>
                      <Avatar size={35} photo={tribe.img} round={50} />
                    </View>
                    <Typography size={14}>{tribe.name}</Typography>
                  </View>
                </TouchableOpacity>

                {/* <Typography>{m.amount}</Typography> */}
                <Media
                  key={m.id}
                  id={m.id}
                  // index={index}
                  {...m}
                  // onMediaPress={onMediaPress}
                />
              </View>
            )
          })}
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
  footer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingRight: 5,
    paddingLeft: 5
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
