import React from 'react'
import { StyleSheet, View, FlatList, TouchableOpacity } from 'react-native'

import { useObserver } from 'mobx-react-lite'
import { useNavigation } from '@react-navigation/native'

import { useStores, useTheme } from '../../store'
import { DEFAULT_TRIBE_SERVER } from '../../config'
import Typography from '../common/Typography'
import Avatar from '../common/Avatar'
import Button from '../common/Button'

export default function List(props) {
  const { data } = props
  const theme = useTheme()

  const renderItem = ({ index, item }) => <Item {...item} />

  return useObserver(() => {
    return (
      <View style={{ ...styles.wrap, backgroundColor: theme.bg }}>
        <FlatList data={data} keyExtractor={item => item.uuid} renderItem={renderItem} />
      </View>
    )
  })
}

function Item(props) {
  const { name, description, img, joined, uuid } = props
  const { ui, chats } = useStores()
  const theme = useTheme()
  const navigation = useNavigation()

  const onItemPress = () => navigation.navigate('Tribe', { tribe: { ...props } })

  async function onJoinPress() {
    const host = chats.getDefaultTribeServer().host
    const tribeParams = await chats.getTribeDetails(host, uuid)
    ui.setJoinTribeParams(tribeParams)
  }

  return (
    <TouchableOpacity
      style={{
        ...styles.itemRow,
        backgroundColor: theme.main
      }}
      activeOpacity={0.5}
      onPress={onItemPress}
    >
      <View style={styles.avatarWrap}>
        <Avatar photo={img} size={70} />
      </View>

      <View style={styles.itemContent}>
        <View style={styles.itemContentTop}>
          <Typography color={theme.text} size={16} fw='500'>
            {name}
          </Typography>
          <View style={{ marginRight: 4 }}>
            {joined ? (
              <Typography size={13} color={theme.primary} ls={0.5}>
                Joined
              </Typography>
            ) : (
              <Button size='small' labelStyle={{ textTransform: 'capitalize' }} onPress={onJoinPress}>
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
  itemRow: {
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
  itemContent: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1
  },
  itemContentTop: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    maxHeight: 38,
    paddingBottom: 5
  }
})
