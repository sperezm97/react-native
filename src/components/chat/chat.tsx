import React, { useEffect, useState } from 'react'
import {
  View,
  StyleSheet,
  InteractionManager,
  BackHandler,
  KeyboardAvoidingView,
  Platform
} from 'react-native'
import { useRoute, useNavigation } from '@react-navigation/native'
import { ActivityIndicator } from 'react-native-paper'
import Toast from 'react-native-simple-toast'
import { ifIphoneX } from 'react-native-iphone-x-helper'

import Header from './header'
import MsgList from './msgList'
import BottomBar from './bottomBar'
import { ChatRouteProp } from '../../types'
import { useStores, useTheme } from '../../store'
import { contactForConversation } from './utils'
import EE, { LEFT_GROUP, LEFT_IMAGE_VIEWER } from '../utils/ee'
import { constants } from '../../constants'
import Frame from './frame'
import { StreamPayment } from '../../store/feed'
import { useIncomingPayments } from '../../store/hooks/pod'
import Pod from './pod'
import Anim from './pod/anim'

export type RouteStatus = 'active' | 'inactive' | null

export default function Chat() {
  const { contacts, user, chats, ui, msg } = useStores()
  const theme = useTheme()

  const [show, setShow] = useState(false)
  const [pricePerMessage, setPricePerMessage] = useState(0)
  const [appMode, setAppMode] = useState(false)
  // const [showPod, setShowPod] = useState(false)
  const [status, setStatus] = useState<RouteStatus>(null)
  const [tribeParams, setTribeParams] = useState(null)
  const [pod, setPod] = useState(null)
  const [podError, setPodError] = useState(null)

  const route = useRoute<ChatRouteProp>()
  const chatID = route.params.id
  const chat = chats.chats.find(c => c.id === chatID) || route.params

  const navigation = useNavigation()

  function handleBack() {
    BackHandler.addEventListener('hardwareBackPress', function () {
      navigation.navigate('Home', { params: { rnd: Math.random() } })
      return true
    })
  }

  useEffect(() => {
    // check for contact key, exchange if none
    const contact = contactForConversation(chat, contacts.contacts)

    if (contact && !contact.contact_key) {
      contacts.exchangeKeys(contact.id)
    }
    EE.on(LEFT_GROUP, () => {
      navigation.navigate('Home', { params: { rnd: Math.random() } })
    })
    EE.on(LEFT_IMAGE_VIEWER, () => {
      handleBack()
    })
    InteractionManager.runAfterInteractions(() => {
      setShow(true)
    })

    handleBack()

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
  const theShow = show

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

  const isIOS = Platform.OS === 'ios'
  const statusBarHeight = isIOS ? ifIphoneX(50, 20) : 0
  const headerHeight = statusBarHeight + 64
  let pricePerMinute = 0
  if (pod && pod.value && pod.value.model && pod.value.model.suggested) {
    pricePerMinute = Math.round(parseFloat(pod.value.model.suggested) * 100000000)
  }

  return (
    <View style={{ ...styles.wrap, backgroundColor: theme.bg }}>
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

      <View style={{ ...styles.content }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior='padding'
          keyboardVerticalOffset={headerHeight}
        >
          {(appURL ? true : false) && (
            <View
              style={{ ...styles.layer, zIndex: appMode ? 100 : 99 }}
              accessibilityLabel='chat-application-frame'
            >
              <Frame url={appURL} />
            </View>
          )}

          {!theShow && (
            <View style={{ ...styles.loadWrap, backgroundColor: theme.bg }}>
              <ActivityIndicator animating={true} color={theme.subtitle} />
            </View>
          )}

          {theShow && <MsgList chat={chat} pricePerMessage={pricePerMessage} />}

          <Pod
            pod={pod}
            show={feedURL ? true : false}
            chat={chat}
            onBoost={onBoost}
            podError={podError}
          />

          {/* <Anim dark={theme.dark} /> */}
          {theShow && (
            <BottomBar
              chat={chat}
              pricePerMessage={pricePerMessage}
              tribeBots={tribeBots}
            />
          )}
        </KeyboardAvoidingView>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1
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
