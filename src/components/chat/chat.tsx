import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { KeyboardAvoidingView } from 'react-native'
import { useRoute, useNavigation } from '@react-navigation/native'

import { useStores, useTheme } from '../../store'
import { StreamPayment } from '../../store/feed'
import { constants } from '../../constants'
import { ChatRouteProp } from '../../types'
import { contactForConversation } from './utils'
import EE, { LEFT_GROUP } from '../utils/ee'
import Header from './header'
import MsgList from './msgList'
import BottomBar from './BottomBar/bottomBar'
import Podcast from '../Podcast'

export type RouteStatus = 'active' | 'inactive' | null

export default function Chat() {
  const { contacts, user, chats, msg } = useStores()
  const theme = useTheme()
  const myid = user.myid
  const route = useRoute<ChatRouteProp>()

  const [pricePerMessage, setPricePerMessage] = useState(0)
  const [appMode, setAppMode] = useState(false)
  const [status, setStatus] = useState<RouteStatus>(null)
  const [tribeParams, setTribeParams] = useState(null)
  const [pod, setPod] = useState(null)
  const [podError, setPodError] = useState(null)

  const feedURL = tribeParams && tribeParams.feed_url
  const tribeBots = tribeParams && tribeParams.bots
  const chatID = route.params.id
  const chat = useMemo(
    () => chats.chats.find((c) => c.id === chatID) || route.params,
    [chatID, chats.chats, route.params]
  )

  const navigation = useNavigation()

  const loadPod = useCallback(
    async (tr) => {
      const params = await chats.loadFeed(chat.host, chat.uuid, tr.feed_url)

      if (params) setPod(params)
      if (!params) setPodError('no podcast found')
    },
    [chat.host, chat.uuid, chats]
  )

  const fetchTribeParams = useCallback(async () => {
    const isTribe = chat && chat.type === constants.chat_types.tribe
    const isTribeAdmin = isTribe && chat.owner_pubkey === user.publicKey
    // let isAppURL = false
    // let isFeedURL = false
    if (isTribe) {
      //&& !isTribeAdmin) {
      setAppMode(true)
      // setLoadingChat(true)
      const params = await chats.getTribeDetails(chat.host, chat.uuid)
      if (params) {
        const price = params.price_per_message + params.escrow_amount
        setPricePerMessage(price)
        // Toast.showWithGravity('Price Per Message: ' + price + ' sat', 0.3, Toast.CENTER)

        if (!isTribeAdmin) {
          if (chat.name !== params.name || chat.photo_url !== params.img) {
            chats.updateTribeAsNonAdmin(chat.id, params.name, params.img)
          }
        }
        setTribeParams(params)
        if (params.feed_url) {
          loadPod(params)
        }
      }
      // setLoadingChat(false)
    } else {
      setAppMode(false)
      setTribeParams(null)
    }

    const r = await chats.checkRoute(chat.id, myid)

    if (r && r.success_prob && r.success_prob > 0) {
      setStatus('active')
    } else {
      setStatus('inactive')
    }
  }, [chat, chats, loadPod, myid, user.publicKey])

  useEffect(() => {
    // check for contact key, exchange if none
    const contact = contactForConversation(chat, contacts.contacts, myid)

    if (contact && !contact.contact_key) {
      contacts.exchangeKeys(contact.id)
    }
    EE.on(LEFT_GROUP, () => {
      navigation.navigate('Tribes', { params: { rnd: Math.random() } })
    })

    fetchTribeParams()

    return () => {
      setTribeParams(null)
    }
  }, [chat, contacts, fetchTribeParams, myid, navigation])

  function onBoost(sp: StreamPayment) {
    if (!(chat && chat.id)) return
    msg.sendMessage({
      contact_id: null,
      text: `boost::${JSON.stringify(sp)}`,
      chat_id: chat.id || null,
      amount: pricePerMessage,
      reply_uuid: '',
    })
  }

  let pricePerMinute = 0
  if (pod && pod.value && pod.value.model && pod.value.model.suggested) {
    pricePerMinute = Math.round(parseFloat(pod.value.model.suggested) * 100000000)
  }

  const showPod = feedURL ? true : false

  return (
    <KeyboardAvoidingView behavior='padding' style={{ flex: 1, backgroundColor: theme.bg }} keyboardVerticalOffset={1}>
      <Header
        chat={chat}
        appMode={appMode}
        setAppMode={setAppMode}
        status={status}
        tribeParams={tribeParams}
        pricePerMinute={pricePerMinute}
        podId={pod?.id}
      />

      <MsgList chat={chat} pricePerMessage={pricePerMessage} />

      {/* <View style={{ ...styles.loadWrap, backgroundColor: theme.bg }}>
        <ActivityIndicator animating={true} />
      </View> */}

      {showPod && <Podcast pod={pod} chat={chat} onBoost={onBoost} podError={podError} />}

      <BottomBar chat={chat} pricePerMessage={pricePerMessage} tribeBots={tribeBots} />
    </KeyboardAvoidingView>
  )
}
