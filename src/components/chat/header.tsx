import React from 'react'
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native'
import { useObserver } from 'mobx-react-lite'
import { Appbar } from 'react-native-paper'
import { useNavigation, useRoute } from '@react-navigation/native'
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'

import { useStores, useTheme } from '../../store'
import { Chat } from '../../store/chats'
import { contactForConversation } from './utils'
import { useChatPicSrc } from '../utils/picSrc'
import { constants } from '../../constants'
import { randAscii } from '../../crypto/rand'
import { RouteStatus } from './chat'
import Icon from '../common/Icon'
import Avatar from '../common/Avatar'

const conversation = constants.chat_types.conversation
const tribe = constants.chat_types.tribe

export default function Header({
  chat,
  appMode,
  setAppMode,
  status,
  tribeParams,
  earned,
  spent,
  pricePerMinute
}: {
  chat: Chat
  appMode: boolean
  setAppMode: Function
  status: RouteStatus
  tribeParams: { [k: string]: any }
  earned: number
  spent: number
  pricePerMinute: number
}) {
  const { contacts, ui, user, details, chats } = useStores()
  const isTribeAdmin = tribeParams && tribeParams.owner_pubkey === user.publicKey
  const isPodcast = tribeParams && tribeParams.feed_url ? true : false
  const theme = useTheme()
  const navigation = useNavigation()

  return useObserver(() => {
    const theChat = chats.chats.find(c => c.id === chat.id)

    let contact
    if (chat && chat.type === conversation) {
      contact = contactForConversation(chat, contacts.contacts)
    }

    function handleChatInfoClick() {
      if (chat.type === conversation) {
        if (contact)
          navigation.navigate('Contacts', {
            screen: 'Contact',
            params: { contact }
          })
      } else {
        navigation.navigate('ChatDetails', {
          group: { ...chat, ...tribeParams, pricePerMinute }
        })
      }
    }

    function clickTitle() {
      // TODO: This will go to tribe community screen
      // if (chat.type === conversation) {
      //   if (contact)
      //     navigation.navigate('Contacts', {
      //       screen: 'Contact',
      //       params: { contact }
      //     })
      //   // ui.setEditContactModal(contact)
      // } else {
      //   ui.setGroupModal({ ...chat, ...tribeParams, pricePerMinute })
      // }
    }

    async function launchVideo() {
      const id = await randAscii()
      ui.setRtcParams({ id })
    }

    const isMuted = (theChat && theChat.is_muted) || false
    async function muteChat() {
      chats.muteChat(chat.id, isMuted ? false : true)
    }

    const name = (chat && chat.name) || (contact && contact.alias)

    function onBackHandler() {
      requestAnimationFrame(() => {
        // msg.seeChat(chat.id)
        details.getBalance()
        navigation.goBack()
      })
    }

    function setAppModeHandler() {
      setAppMode(!appMode)
    }

    let uri = useChatPicSrc(chat)
    const appURL = tribeParams && tribeParams.app_url

    return (
      <Appbar.Header style={{ ...styles.wrap, backgroundColor: theme.bg, borderBottomColor: theme.border }}>
        <TouchableOpacity onPress={onBackHandler} style={{ marginLeft: 6, marginRight: 6 }}>
          <Icon name='ChevronLeft' size={28} color={theme.icon} />
        </TouchableOpacity>

        <TouchableOpacity onPress={clickTitle} style={{ ...styles.detailsWrap }}>
          <View style={{ marginRight: 10 }}>
            <Avatar alias={name} photo={uri || ''} size={38} big aliasSize={15} />
          </View>
          <View style={{ height: 45 }}>
            <View style={{ ...styles.title }}>
              <Text style={{ fontSize: 18, color: theme.text }}>{name}</Text>
              {status !== null && <MaterialIcon name='lock' style={{ marginLeft: 16 }} size={13} color={status === 'active' ? theme.active : theme.inactive} />}
            </View>
            {isPodcast && <Text style={{ ...styles.stats, color: theme.subtitle }}>{isTribeAdmin ? `Earned: ${earned} sats` : `Contributed: ${spent} sats`}</Text>}
          </View>
        </TouchableOpacity>

        {/* <Appbar.Action icon='video' onPress={launchVideo} color='grey' /> */}
        {/* {theChat && (
        )} */}

        {/* <Appbar.Action icon={isMuted ? 'bell-off' : 'bell'} onPress={muteChat} color={theme.icon} /> */}

        <TouchableOpacity style={{ position: 'absolute', right: 16 }} onPress={handleChatInfoClick}>
          <Icon name='Info' size={24} color={theme.icon} />
        </TouchableOpacity>
        {theChat && theChat.type === tribe && (appURL ? true : false) && <Appbar.Action color={theme.icon} icon={appMode ? 'android-messages' : 'open-in-app'} onPress={setAppModeHandler} />}
      </Appbar.Header>
    )
  })
}

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
    alignItems: 'center'
  },
  detailsWrap: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  title: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center'
  },
  textWrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 13
  },
  stats: {
    fontSize: 12
  }
})
