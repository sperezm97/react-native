import React, { useState, useCallback } from 'react'
import { useObserver } from 'mobx-react-lite'
import { StyleSheet, View, TouchableOpacity, FlatList, Dimensions } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import ReactNativeHapticFeedback from 'react-native-haptic-feedback'

import { useStores, useTheme, hooks } from '../../store'
import { useSearchChats } from '../../store/hooks/chats'
import InviteRow, { styles } from './inviteRow'
import { chatPicSrc, useChatPicSrc } from '../utils/picSrc'
import RefreshLoading from '../common/RefreshLoading'
import Avatar from '../common/Avatar'
import Typography from '../common/Typography'

const { useChats, useChatRow } = hooks

export default function ChatList(props) {
  const { ui, user, contacts, msg, details, chats } = useStores()
  const myid = user.myid

  const [refreshing, setRefreshing] = useState(false)
  const onRefresh = useCallback(async () => {
    ReactNativeHapticFeedback.trigger('impactLight', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    })

    setRefreshing(true)
    await contacts.getContacts()
    await msg.getMessages()
    await details.getBalance()
    setRefreshing(false)
  }, [refreshing])

  /**
   * renderItem component
   * @param {object} item - item object getting from map chatToShow array
   * @param {number} index - index of item in the array
   */
  const renderItem: any = ({ item, index }) => {
    const chatID = (item.id || rando()) + ''
    let showInvite = false
    if (item.invite && item.invite.status !== 4) showInvite = true
    if (showInvite) return <InviteRow key={`invite_${index}`} {...item} />
    return <ChatRow key={chatID} {...item} />
  }

  return useObserver(() => {
    const chats = useChats()
    const chatsToShow = useSearchChats(chats)

    return (
      <View style={{ width: '100%', flex: 1 }} accessibilityLabel='chatlist'>
        <FlatList<any>
          data={chatsToShow}
          renderItem={renderItem}
          keyExtractor={(item) => {
            if (!item.id) {
              const contact_id = item.contact_ids.find((id) => id !== myid)
              return 'contact_' + String(contact_id)
            }
            return String(item.id)
          }}
          refreshControl={<RefreshLoading refreshing={refreshing} onRefresh={onRefresh} />}
          ListHeaderComponent={props.listHeader}
        />
      </View>
    )
  })
}

function ChatRow(props) {
  const { id, name, date, contact_ids } = props
  const navigation = useNavigation()
  const { msg, user } = useStores()

  const onSeeChatHandler = () => {
    requestAnimationFrame(() => {
      msg.seeChat(props.id)
      msg.getMessages()
      navigation.navigate('Chat' as never, { ...props } as never)
    })
  }

  const theme = useTheme()
  return useObserver(() => {
    let uri = useChatPicSrc(props)
    const hasImg = uri ? true : false

    const { lastMsgText, lastMsgDate, hasLastMsg, unseenCount, hasUnseen } = useChatRow(props.id)

    const w = Math.round(Dimensions.get('window').width)
    return (
      <TouchableOpacity
        style={{
          ...styles.chatRow,
          backgroundColor: theme.main,
        }}
        activeOpacity={0.5}
        onPress={onSeeChatHandler}
      >
        <View style={styles.avatarWrap}>
          <Avatar alias={name} photo={uri && uri} size={50} aliasSize={18} big />
        </View>
        <View style={{ ...styles.chatContent }}>
          <View style={styles.top}>
            <Typography size={16} fw='500'>
              {name}
            </Typography>
            <Typography size={13} style={{ ...styles.chatDate }} color={theme.subtitle}>
              {lastMsgDate}
            </Typography>
          </View>
          <View style={styles.bottom}>
            {hasLastMsg && (
              <Typography
                numberOfLines={1}
                color={theme.subtitle}
                fw={hasUnseen ? '500' : '400'}
                size={13}
                style={{
                  maxWidth: w - 150,
                }}
              >
                {lastMsgText}
              </Typography>
            )}
            {hasUnseen && (
              <View style={{ ...moreStyles.badge, backgroundColor: theme.green }}>
                <Typography color={theme.white} size={12}>
                  {unseenCount}
                </Typography>
              </View>
            )}
          </View>
          <View style={{ ...styles.borderBottom, borderBottomColor: theme.border }}></View>
        </View>
      </TouchableOpacity>
    )
  })
}

const moreStyles = StyleSheet.create({
  buttonsWrap: {
    marginTop: 40,
    marginBottom: 25,
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
  },
  badgeWrap: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  badge: {
    width: 22,
    height: 22,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    marginRight: 14,
  },
})

function rando() {
  return Math.random().toString(36).substring(7)
}
