import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native'

import { useObserver } from 'mobx-react-lite'

import { useStores, useTheme, hooks } from '../../store'
import { useOwnedTribes } from '../../store/hooks/tribes'
import Typography from '../common/Typography'
import Avatar from '../common/Avatar'
import Button from '../common/Button'

const { useSearchTribes, useTribes } = hooks

// const tribes = useTribes()

//     const ownedTribes = useOwnedTribes(tribes)

export default function TribesList() {
  const theme = useTheme()
  const { chats } = useStores()

  useEffect(() => {
    chats.getTribes()
  }, [])

  const renderItem = ({ index, item }) => <TribeItem {...item} />

  return useObserver(() => {
    const tribesToShow = useSearchTribes()

    return (
      <View style={{ ...styles.wrap, backgroundColor: theme.bg }}>
        <FlatList data={tribesToShow} keyExtractor={item => item.uuid} renderItem={renderItem} />
      </View>
    )
  })
}

function TribeItem(props) {
  const { name, description, img, joined } = props
  const theme = useTheme()

  return (
    <TouchableOpacity
      style={{
        ...styles.tribeRow,
        backgroundColor: theme.main
      }}
      activeOpacity={0.5}
      onPress={() => console.log('ss')}
    >
      <View style={styles.avatarWrap}>
        <Avatar photo={img} size={70} />
      </View>

      <View style={styles.tribeContent}>
        <View style={styles.tribeContentTop}>
          <Typography color={theme.text} size={16} fw='500'>
            {name}
          </Typography>
          <View style={{ marginRight: 4 }}>
            {joined ? (
              <Typography size={13} color={theme.primary}>
                Joined
              </Typography>
            ) : (
              <Button size='small' labelStyle={{ textTransform: 'capitalize' }} onPress={() => console.log('join pressed')}>
                Join
              </Button>
            )}
          </View>
        </View>
        <View>
          <Typography color={theme.subtitle} size={13}>
            {description}
          </Typography>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1
  },
  container: {
    flex: 1
  },
  tribeRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    height: 90,
    marginVertical: 8,
    marginHorizontal: 14,
    padding: 12,
    borderRadius: 5
    // width: '100%'
  },
  avatarWrap: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 52,
    height: 52,
    marginRight: 18
    // marginLeft: 10
  },
  tribeContent: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1
  },
  tribeContentTop: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    maxHeight: 38,
    paddingBottom: 5
  },
  item: {
    marginVertical: 8,
    marginHorizontal: 14,
    padding: 12
  },
  title: {
    fontSize: 32
  }
})
