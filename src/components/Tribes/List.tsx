import React from 'react'
import { StyleSheet, View, FlatList, TouchableOpacity } from 'react-native'
import { useObserver } from 'mobx-react-lite'
import { useNavigation } from '@react-navigation/native'
import { ActivityIndicator } from 'react-native-paper'

import { useStores, useTheme } from '../../store'
import Typography from '../common/Typography'
import Avatar from '../common/Avatar'
import Button from '../common/Button'
import RefreshLoading from '../common/RefreshLoading'

export default function List(props) {
  const { data, loading, listEmpty, refreshing, onRefresh } = props
  const theme = useTheme()

  const renderItem = ({ index, item }) => <Item {...item} />

  return useObserver(() => {
    return (
      <View style={{ ...styles.wrap, backgroundColor: theme.bg }}>
        {loading ? (
          <View style={{ paddingTop: 30 }}>
            <ActivityIndicator />
          </View>
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            data={data}
            keyExtractor={item => item.uuid}
            renderItem={renderItem}
            // ListHeaderComponent={listHeader}
            ListEmptyComponent={listEmpty}
            refreshing={refreshing}
            onRefresh={onRefresh && onRefresh}
            refreshControl={
              <RefreshLoading refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        )}
      </View>
    )
  })
}

function Item(props) {
  const { name, description, img, joined, uuid, owner, owner_alias } = props
  const { ui, chats } = useStores()
  const theme = useTheme()
  const navigation = useNavigation()

  const onItemPress = () => navigation.navigate('Tribe', { tribe: { ...props } })

  async function onJoinPress() {
    const host = chats.getDefaultTribeServer().host
    const tribeParams = await chats.getTribeDetails(host, uuid)
    ui.setJoinTribeModal(true, tribeParams)
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
        <Avatar size={60} photo={img} round={50} />
      </View>

      <View style={styles.itemContent}>
        <View style={{ ...styles.row }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Typography size={16} fw='500'>
              {name}
            </Typography>
            {/* {!owner && (
              <>
                <View style={{ ...styles.dot, backgroundColor: theme.text }}></View>
                <Typography size={12}>{owner_alias?.trim()}</Typography>
              </>
            )} */}
          </View>

          <View style={{ paddingRight: 4 }}>
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
        <View style={{ ...styles.row }}>
          <Typography color={theme.subtitle} size={13} numberOfLines={1}>
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
    // marginVertical: 8,
    padding: 16
  },
  itemContent: {
    flex: 1
  },
  avatarWrap: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 14
    // width: 60,
    // height: 60,
    // paddingLeft: 4
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 5,
    marginHorizontal: 10
  }
})