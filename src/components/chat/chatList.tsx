import React, { useState, useCallback } from 'react'
import { useObserver } from 'mobx-react-lite'
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Dimensions } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import ReactNativeHapticFeedback from 'react-native-haptic-feedback'

import { useStores, hooks, useTheme } from '../../store'
import InviteRow, { styles } from './inviteRow'
import { chatPicSrc, useChatPicSrc } from '../utils/picSrc'
import PushableButton from '../common/Button/PushableButton'
import RefreshLoading from '../common/RefreshLoading'
import Avatar from '../common/Avatar'

const { useChats, useChatRow } = hooks

export default function ChatList() {
  const { ui, contacts, msg, details, chats } = useStores()
  const theme = useTheme()

  const [refreshing, setRefreshing] = useState(false)
  const onRefresh = useCallback(async () => {
    ReactNativeHapticFeedback.trigger('impactLight', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false
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

  const setAddFriendModalHandler = () => ui.setAddFriendDialog(true)
  const setNewGroupModalHandler = () => ui.setNewGroupModal(true)

  const footerComponent: any = () => (
    <View style={moreStyles.buttonsWrap}>
      <PushableButton dark={true} icon='plus' accessibilityLabel='add-friend-button' onPress={setAddFriendModalHandler} style={{ ...moreStyles.button, backgroundColor: theme.secondary }}>
        Friend
      </PushableButton>
      <PushableButton dark={true} icon='plus' accessibilityLabel='new-group-button' onPress={setNewGroupModalHandler} style={moreStyles.button}>
        Tribe
      </PushableButton>
    </View>
  )

  return useObserver(() => {
    const chatsToShow = useChats()
    return (
      <View style={{ width: '100%', flex: 1 }} accessibilityLabel='chatlist'>
        <FlatList<any>
          data={chatsToShow}
          renderItem={renderItem}
          keyExtractor={item => {
            if (!item.id) {
              const contact_id = item.contact_ids.find(id => id !== 1)
              return 'contact_' + String(contact_id)
            }
            return String(item.id)
          }}
          refreshControl={<RefreshLoading refreshing={refreshing} onRefresh={onRefresh} />}
          ListFooterComponent={footerComponent}
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
      navigation.navigate('Chat', { ...props })
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
          backgroundColor: theme.bg
        }}
        activeOpacity={0.5}
        onPress={onSeeChatHandler}
      >
        <View style={styles.avatarWrap}>
          <Avatar alias={name} photo={uri && uri} size={50} aliasSize={18} big />
          {hasUnseen && (
            <View style={moreStyles.badgeWrap}>
              <View style={{ ...moreStyles.badge, backgroundColor: theme.badge }}>
                <Text style={{ ...moreStyles.badgeText, color: theme.white }}>{unseenCount}</Text>
              </View>
            </View>
          )}
        </View>
        <View style={styles.chatContent}>
          <View style={styles.chatContentTop}>
            <Text style={{ ...styles.chatName, color: theme.text, fontFamily: 'Proxima Nova Regular', fontWeight: '400' }}>{name}</Text>
            <Text style={{ ...styles.chatDate, color: theme.subtitle }}>{lastMsgDate}</Text>
          </View>
          <View style={styles.chatMsgWrap}>
            {hasLastMsg && (
              <Text
                numberOfLines={1}
                style={{
                  ...styles.chatMsg,
                  fontWeight: hasUnseen ? 'bold' : 'normal',
                  maxWidth: w - 105,
                  color: theme.subtitle
                }}
              >
                {lastMsgText}
              </Text>
            )}
          </View>
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
    justifyContent: 'space-around'
  },
  button: {
    borderRadius: 25,
    width: 140
  },
  badgeWrap: {
    position: 'absolute',
    width: '100%',
    height: '100%'
  },
  badge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 18,
    height: 18,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '500'
  }
})

function rando() {
  return Math.random().toString(36).substring(7)
}
