import React, { useMemo, useState } from 'react'
import { KeyboardAvoidingView } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useStores, useTheme } from 'store'
import { ChatRouteProp, RouteStatus } from 'types'
import { observer } from 'mobx-react-lite'
import { ChatHeader } from '../chat-header'
import MsgList from '../msg-list/msg-list'
import BottomBar from '../BottomBar/bottomBar'
import Podcast from 'components/Podcast'
import { display, log } from 'lib/logging'
import { StreamPayment } from 'store/feed-store'

export const Chat = observer(() => {
  const { contacts, user, chats, msg } = useStores()
  const theme = useTheme()
  const myid = user.myid
  const route = useRoute<ChatRouteProp>()
  const navigation = useNavigation()

  const [pricePerMessage, setPricePerMessage] = useState(0)
  const [appMode, setAppMode] = useState(false)
  const [status, setStatus] = useState<RouteStatus>(null)
  const [tribeParams, setTribeParams] = useState(null)
  const [pod, setPod] = useState(null)
  const [podError, setPodError] = useState(null)

  const feedURL = tribeParams?.feed_url
  const tribeBots = tribeParams?.bots
  const chatID = route.params.id
  const chat = useMemo(
    () => chats.chatsArray.find((c) => c.id === chatID) || route.params,
    [chatID, chats.chats, route.params]
  )

  function onBoost(sp: StreamPayment) {
    if (!chat?.id) return
    msg.sendMessage({
      contact_id: null,
      text: `boost::${JSON.stringify(sp)}`,
      chat_id: chat.id || null,
      amount: pricePerMessage,
      reply_uuid: '',
    })
  }

  let pricePerMinute = 0
  if (pod?.value && pod.value.model && pod.value.model.suggested) {
    pricePerMinute = Math.round(parseFloat(pod.value.model.suggested) * 100000000)
  }

  const showPod = !!feedURL

  display({
    name: 'Chat',
    value: chat,
    important: true,
  })

  return (
    <KeyboardAvoidingView
      behavior='padding'
      style={{ flex: 1, backgroundColor: theme.bg }}
      keyboardVerticalOffset={1}
    >
      <ChatHeader
        chat={chat}
        appMode={appMode}
        setAppMode={setAppMode}
        status={status}
        tribeParams={tribeParams}
        pricePerMinute={pricePerMinute}
        podId={pod?.id}
      />
      <MsgList chat={chat} pricePerMessage={pricePerMessage} />
      {showPod && <Podcast pod={pod} chat={chat} onBoost={onBoost} podError={podError} />}

      <BottomBar chat={chat} pricePerMessage={pricePerMessage} tribeBots={tribeBots} />
    </KeyboardAvoidingView>
  )
})
