import React from 'react'
import { StyleSheet, View, FlatList, TouchableOpacity } from 'react-native'

import { useObserver } from 'mobx-react-lite'
import { useNavigation } from '@react-navigation/native'

import { useStores, useTheme } from '../../store'
import Typography from '../common/Typography'
import Avatar from '../common/Avatar'
import Button from '../common/Button'

export default function List(props) {
  const { data, listHeader } = props
  const theme = useTheme()

  const renderItem = ({ index, item }) => <Item {...item} />

  return useObserver(() => {
    return (
      <View style={{ ...styles.wrap, backgroundColor: theme.bg }}>
        <FlatList data={data} keyExtractor={item => item.uuid} renderItem={renderItem} ListHeaderComponent={listHeader} />
      </View>
    )
  })
}

function Item(props) {
  const { name, description, img, joined, uuid, owner } = props
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
        <Avatar size={60} photo={img} />
      </View>

      <View style={styles.itemContent}>
        <View style={{ ...styles.row, ...styles.itemContentTop }}>
          <Typography color={theme.text} size={17} fw='500'>
            {name}
          </Typography>
          <View style={{ marginRight: 4 }}>
            {!owner && (
              <>
                {joined ? (
                  <Typography size={13} color={theme.primary} ls={0.5}>
                    Joined
                  </Typography>
                ) : (
                  <Button size='small' tf='capitalize' onPress={onJoinPress}>
                    Join
                  </Button>
                )}
              </>
            )}
          </View>
        </View>
        <View style={{ ...styles.row, ...styles.itemContentBottom }}>
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
    height: 100,
    marginVertical: 8,
    marginHorizontal: 14,
    padding: 12,
    borderRadius: 5
  },
  avatarWrap: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
    marginRight: 18,
    paddingLeft: 4
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1
  },
  itemContent: {
    flex: 1,
    height: 60
  },
  itemContentTop: {},
  itemContentBottom: {}
})
