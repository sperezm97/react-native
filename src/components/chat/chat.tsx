import React, { useEffect, useState } from 'react'
import { StyleSheet, KeyboardAvoidingView } from 'react-native'
import { useRoute, useNavigation } from '@react-navigation/native'
import Toast from 'react-native-simple-toast'

import { useStores, useTheme } from '../../store'
import { StreamPayment } from '../../store/feed'
import { useIncomingPayments } from '../../store/hooks/pod'
import { constants } from '../../constants'
import { ChatRouteProp } from '../../types'
import { contactForConversation } from './utils'
import EE, { LEFT_GROUP } from '../utils/ee'
import Header from './header'
import MsgList from './msgList'
import BottomBar from './bottomBar'
import Podcast from '../Podcast'

export type RouteStatus = 'active' | 'inactive' | null

export default function Chat() {
  const { contacts, user, chats, ui, msg } = useStores()
  const theme = useTheme()

  const [pricePerMessage, setPricePerMessage] = useState(0)
  const [appMode, setAppMode] = useState(false)
  const [status, setStatus] = useState<RouteStatus>(null)
  const [tribeParams, setTribeParams] = useState(null)
  const [pod, setPod] = useState(null)
  const [podError, setPodError] = useState(null)

  const route = useRoute<ChatRouteProp>()
  const chatID = route.params.id
  const chat = chats.chats.find(c => c.id === chatID) || route.params

  const navigation = useNavigation()

  useEffect(() => {
    // check for contact key, exchange if none
    const contact = contactForConversation(chat, contacts.contacts)

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
  }, [])

  async function fetchTribeParams() {
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

    const r = await chats.checkRoute(chat.id)

    // console.log('r', r)

    if (r && r.success_prob && r.success_prob > 0) {
      setStatus('active')
    } else {
      setStatus('inactive')
    }
  }

  async function loadPod(tr) {
    const params = await chats.loadFeed(chat.host, chat.uuid, tr.feed_url)

    if (params) setPod(params)
    if (!params) setPodError('no podcast found')
    // if (params) initialSelect(params)
  }

  const appURL = tribeParams && tribeParams.app_url
  const feedURL = tribeParams && tribeParams.feed_url
  const tribeBots = tribeParams && tribeParams.bots

  function onBoost(sp: StreamPayment) {
    if (!(chat && chat.id)) return
    msg.sendMessage({
      contact_id: null,
      text: `boost::${JSON.stringify(sp)}`,
      chat_id: chat.id || null,
      amount: pricePerMessage,
      reply_uuid: ''
    })
  }

  const podID = pod && pod.id
  const { earned, spent } = useIncomingPayments(podID)

  let pricePerMinute = 0
  if (pod && pod.value && pod.value.model && pod.value.model.suggested) {
    pricePerMinute = Math.round(parseFloat(pod.value.model.suggested) * 100000000)
  }

  const showPod = feedURL ? true : false

  return (
    <KeyboardAvoidingView
      behavior='padding'
      style={{ flex: 1, backgroundColor: theme.bg }}
      keyboardVerticalOffset={1}
    >
      <Header
        chat={chat}
        appMode={appMode}
        setAppMode={setAppMode}
        status={status}
        tribeParams={tribeParams}
        earned={earned}
        spent={spent}
        pricePerMinute={pricePerMinute}
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

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    height: '100%',
    width: '100%'
  },
  content: {
    flex: 1
  },
  main: {
    display: 'flex',
    width: '100%',
    height: '100%',
    position: 'relative'
  },
  layer: {
    display: 'flex',
    width: '100%',
    height: '100%',
    position: 'absolute',
    paddingTop: 50
  },
  loadWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
})
