import React, { useRef, useMemo, useState, useCallback, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { StyleSheet, VirtualizedList, View, Text, Keyboard, Dimensions, ActivityIndicator } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import Toast from 'react-native-simple-toast'

import { useStores, useTheme, hooks } from '../../store'
import { Chat } from '../../store/chats'
import { useMsgSender } from '../../store/hooks/msg'
import Message from './msg'
import { constants } from '../../constants'
import EE, { SHOW_REFRESHER } from '../utils/ee'
import Typography from '../common/Typography'

const { useMsgs } = hooks

const group = constants.chat_types.group
const tribe = constants.chat_types.tribe

const MsgListWrap = ({ chat, pricePerMessage }: { chat: Chat; pricePerMessage: number }) => {
  const { msg, user, chats, details } = useStores()
  const [limit, setLimit] = useState(40)
  const navigation = useNavigation()

  function onLoadMoreMsgs() {
    setLimit((c) => c + 40)
  }

  const onBoostMsg = useCallback(
    async (m) => {
      const { uuid } = m
      if (!uuid) return
      const amount = (user.tipAmount || 100) + pricePerMessage

      if (amount > details.balance) {
        Toast.showWithGravity('Not Enough Balance', Toast.SHORT, Toast.TOP)
        return
      }

      msg.sendMessage({
        boost: true,
        contact_id: null,
        text: '',
        amount,
        chat_id: chat.id || null,
        reply_uuid: uuid,
        message_price: pricePerMessage,
      })
    },
    [chat.id, details.balance, msg, pricePerMessage, user.tipAmount]
  )

  const onDelete = useCallback(
    async (id) => {
      await msg.deleteMessage(id)
    },
    [msg]
  )

  const onApproveOrDenyMember = useCallback(
    async (contactId, status, msgId) => {
      await msg.approveOrRejectMember(contactId, status, msgId)
    },
    [msg]
  )

  const onDeleteChat = useCallback(async () => {
    navigation.navigate('Home' as never, { params: { rnd: Math.random() } } as never)
    await chats.exitGroup(chat.id)
  }, [chat.id, chats, navigation])

  const msgs = useMsgs(chat, limit) || []

  return (
    <MsgList
      msgsLength={(msgs && msgs.length) || 0}
      msgs={msgs}
      chat={chat}
      onDelete={onDelete}
      myPubkey={user.publicKey}
      myAlias={user.alias}
      myid={user.myid}
      onApproveOrDenyMember={onApproveOrDenyMember}
      onDeleteChat={onDeleteChat}
      onLoadMoreMsgs={onLoadMoreMsgs}
      onBoostMsg={onBoostMsg}
    />
  )
}

function MsgList({
  msgsLength,
  msgs,
  chat,
  onDelete,
  myPubkey,
  myAlias,
  onApproveOrDenyMember,
  onDeleteChat,
  onLoadMoreMsgs,
  onBoostMsg,
  myid,
}) {
  const scrollViewRef = useRef(null)
  const theme = useTheme()

  async function onEndReached() {
    // EE.emit(SHOW_REFRESHER)
    onLoadMoreMsgs()
  }

  // Keyboard logic
  useEffect(() => {
    const ref = setTimeout(() => {
      if (scrollViewRef && scrollViewRef.current && msgs && msgs.length) {
        scrollViewRef.current.scrollToOffset({ offset: 0 })
      }
    }, 500)
    Keyboard.addListener('keyboardDidShow', (e) => {
      if (scrollViewRef && scrollViewRef.current && msgs && msgs.length) {
        scrollViewRef.current.scrollToOffset({ offset: 0 })
      }
    })
    return () => {
      clearTimeout(ref)
      Keyboard.removeListener('keyboardDidShow', () => {})
      scrollViewRef.current = null
    }
  }, [msgs, msgsLength])

  if (chat.status === constants.chat_statuses.pending) {
    return (
      <View style={{ display: 'flex', alignItems: 'center' }}>
        <Text style={{ marginTop: 27, color: theme.subtitle }}>Waiting for admin approval</Text>
      </View>
    )
  }

  const windowWidth = Math.round(Dimensions.get('window').width)

  const isGroup = chat.type === group
  const isTribe = chat.type === tribe
  const initialNumToRender = 20

  // console.log("msgs last one:", msgs[1]);

  return (
    <>
      <Refresher />
      <VirtualizedList
        accessibilityLabel='message-list'
        inverted
        style={{ zIndex: 100 }}
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 40 }}
        windowSize={5}
        ref={scrollViewRef}
        data={msgs}
        initialNumToRender={initialNumToRender}
        initialScrollIndex={0}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.1}
        viewabilityConfig={{
          waitForInteraction: false,
          viewAreaCoveragePercentThreshold: 20,
        }}
        renderItem={({ item }) => {
          return (
            <ListItem
              key={item.id}
              windowWidth={windowWidth}
              m={item}
              chat={chat}
              myid={myid}
              isGroup={isGroup}
              isTribe={isTribe}
              onDelete={onDelete}
              myPubkey={myPubkey}
              myAlias={myAlias}
              onApproveOrDenyMember={onApproveOrDenyMember}
              onDeleteChat={onDeleteChat}
              onBoostMsg={onBoostMsg}
            />
          )
        }}
        keyExtractor={(item: any) => item.id + ''}
        getItemCount={() => msgs.length}
        getItem={(data, index) => data[index]}
        ListHeaderComponent={<View style={{ height: 13 }} />}
      />
    </>
  )
}

function Refresher() {
  const theme = useTheme()
  const [show, setShow] = useState(false)
  useEffect(() => {
    function doShow() {
      setShow(true)
      setTimeout(() => {
        setShow(false)
      }, 100)
    }
    EE.on(SHOW_REFRESHER, doShow)
    return () => {
      EE.removeListener(SHOW_REFRESHER, doShow)
    }
  }, [])
  if (!show) return <></>
  return (
    <View style={{ ...styles.refreshingWrap, height: show ? 60 : 0 }}>
      <ActivityIndicator animating={true} color={theme.icon} size={25} />
    </View>
  )
}

type IListItem = {
  m: any
  chat: any
  isGroup: any
  isTribe: any
  onDelete: any
  myPubkey: any
  myAlias: any
  windowWidth: any
  onApproveOrDenyMember: any
  onDeleteChat: any
  onBoostMsg: any
  myid: any
}

const ListItem = React.memo(
  ({
    m,
    chat,
    isGroup,
    isTribe,
    onDelete,
    myPubkey,
    myAlias,
    windowWidth,
    onApproveOrDenyMember,
    onDeleteChat,
    onBoostMsg,
    myid,
  }: IListItem) => {
    const { contacts } = useStores()

    const { senderAlias, senderPic } = useMsgSender(m, contacts.contacts, isTribe)

    if (m.dateLine) {
      return <DateLine dateString={m.dateLine} />
    }

    const msg = m

    if (!m.chat) msg.chat = chat

    return (
      <Message
        {...msg}
        chat={chat}
        isGroup={isGroup}
        isTribe={isTribe}
        senderAlias={senderAlias}
        senderPic={senderPic}
        onDelete={onDelete}
        myPubkey={myPubkey}
        myAlias={myAlias}
        myid={myid}
        windowWidth={windowWidth}
        onApproveOrDenyMember={onApproveOrDenyMember}
        onDeleteChat={onDeleteChat}
        onBoostMsg={onBoostMsg}
      />
    )
  }
)

// date label component
function DateLine({ dateString }) {
  const theme = useTheme()
  return (
    <View style={{ ...styles.dateLine }}>
      <View style={{ ...styles.dateString, backgroundColor: theme.main }}>
        <Typography size={12} color={theme.subtitle}>
          {dateString}
        </Typography>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  dateLine: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'relative',
    height: 22,
    width: '100%',
    marginTop: 30,
  },
  dateString: {
    paddingLeft: 16,
    paddingRight: 16,
    borderRadius: 15,
  },
  refreshingWrap: {
    position: 'absolute',
    zIndex: 102,
    top: 55,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
})

export default observer(MsgListWrap)
