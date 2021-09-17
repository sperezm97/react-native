import React, { useEffect } from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { observer } from 'mobx-react-lite'
import { Appbar } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import FeatherIcon from 'react-native-vector-icons/Feather'

import { useStores, useTheme, hooks } from '../../store'
import { Chat } from '../../store/chats'
import { contactForConversation } from './utils'
import { useChatPicSrc } from '../utils/picSrc'
import { constants } from '../../constants'
import { RouteStatus } from './chat'
import Avatar from '../common/Avatar'
import Typography from '../common/Typography'
import { useMemoizedIncomingPaymentsFromPodcast } from '../../store/hooks/pod'

const { useTribes } = hooks

const conversation = constants.chat_types.conversation

type HeaderProps = {
  chat: Chat
  appMode: boolean
  setAppMode: Function
  status: RouteStatus
  tribeParams: {
    [k: string]: any
  }
  pricePerMinute: number
  podId?: string
}

const Header = ({ chat, status, tribeParams, podId, pricePerMinute }: HeaderProps) => {
  const { contacts, user, details, chats } = useStores()
  const isTribeAdmin = tribeParams && tribeParams.owner_pubkey === user.publicKey
  const isPodcast = tribeParams && tribeParams.feed_url ? true : false
  const theme = useTheme()
  const navigation = useNavigation()
  const tribes = useTribes()

  useEffect(() => {
    chats.getTribes()
  }, [])

  const theChat = chats.chats.find((c) => c.id === chat.id)

  let contact
  if (chat && chat.type === conversation) {
    contact = contactForConversation(chat, contacts.contacts, user.myid)
  }

  function onChatInfoPress() {
    if (chat.type === conversation) {
      if (contact) navigation.navigate('Contact', { contact: { ...contact } })
    } else {
      navigation.navigate('ChatDetails', {
        group: { ...theChat, ...tribeParams, pricePerMinute },
      })
    }
  }

  function onChatTitlePress() {
    if (chat.type === conversation) {
      if (contact) {
        navigation.goBack()
      }
    } else {
      const tribe = tribes.find((t) => t.chat?.uuid === chat?.uuid)
      navigation.navigate('Tribe', { tribe: { ...tribe } })
    }
  }

  const name = (chat && chat.name) || (contact && contact.alias)

  function onBackPress() {
    requestAnimationFrame(() => {
      // msg.seeChat(chat.id)
      details.getBalance()
      navigation.goBack()
    })
  }

  let uri = useChatPicSrc(chat)

  const { earned, spent } = useMemoizedIncomingPaymentsFromPodcast(podId, user.myid)

  return (
    <Appbar.Header
      style={{
        ...styles.wrap,
        backgroundColor: theme.bg,
        borderBottomColor: theme.border,
      }}
    >
      <View style={styles.row}>
        <TouchableOpacity onPress={onBackPress} style={{ marginLeft: 6, marginRight: 6 }}>
          <FeatherIcon name='chevron-left' size={28} color={theme.icon} />
        </TouchableOpacity>

        <TouchableOpacity onPress={onChatTitlePress} style={{ ...styles.row }} activeOpacity={0.6}>
          <View style={{ marginRight: 10 }}>
            <Avatar alias={name} photo={uri || ''} size={38} big aliasSize={15} />
          </View>
          <View>
            <View
              style={{
                ...styles.row,
              }}
            >
              <Typography
                size={16}
                numberOfLines={1}
                // style={{ width: name?.length > 20 ? SCREEN_WIDTH - 180 : 'auto' }}
              >
                {name}
              </Typography>

              {status !== null && (
                <MaterialIcon
                  name='lock'
                  style={{ marginLeft: 6 }}
                  size={13}
                  color={status === 'active' ? theme.active : theme.inactive}
                />
              )}
            </View>
            {isPodcast && (
              <Typography size={12} color={theme.subtitle}>
                {isTribeAdmin ? `Earned: ${earned} sats` : `Contributed: ${spent} sats`}
              </Typography>
            )}
          </View>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={{ marginRight: 6 }} onPress={onChatInfoPress}>
        <FeatherIcon name='info' size={24} color={theme.icon} />
      </TouchableOpacity>
    </Appbar.Header>
  )
}

export default observer(Header)

const styles = StyleSheet.create({
  wrap: {
    height: 64,
    width: '100%',
    elevation: 0,
    borderBottomWidth: 1,
    zIndex: 102,
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'center'
  },
})
