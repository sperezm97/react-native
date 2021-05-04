import React, { useState, useRef, useLayoutEffect } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { SwipeRow } from 'react-native-swipe-list-view'
import { IconButton } from 'react-native-paper'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import Ionicon from 'react-native-vector-icons/Ionicons'
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5'
import ReactNativeHapticFeedback from 'react-native-haptic-feedback'
import Popover, { PopoverPlacement } from 'react-native-popover-view'
import Clipboard from '@react-native-community/clipboard'

import { useTheme } from '../../../store'
import { constantCodes, constants } from '../../../constants'
import EE, { CANCEL_REPLY_UUID, CLEAR_REPLY_UUID, REPLY_UUID } from '../../utils/ee'
import TextMsg from './textMsg'
import PaymentMessage from './paymentMsg'
import MediaMsg from './mediaMsg'
import Invoice from './invoice'
import InfoBar from './infoBar'
import sharedStyles from './sharedStyles'
import GroupNotification from './groupNotification'
import ReplyContent from './replyContent'
import Avatar from '../../common/Avatar'
import MemberRequest from './memberRequest'
import BotResMsg from './botResMsg'
import BoostMsg from './boostMsg'

export default function MsgRow(props) {
  const theme = useTheme()
  const [showReply, setShowReply] = useState(false)

  const swipeRowRef = useRef<any>(null)

  function clearReplyUUID() {
    const sr = swipeRowRef.current
    if (sr && sr.isOpen) {
      if (sr && sr.closeRow) sr.closeRow()
      setShowReply(false)
    }
  }
  useLayoutEffect(() => {
    EE.on(CLEAR_REPLY_UUID, clearReplyUUID)
    return () => {
      EE.removeListener(CLEAR_REPLY_UUID, clearReplyUUID)
    }
  }, [swipeRowRef])

  const isGroupNotification =
    props.type === constants.message_types.group_join ||
    props.type === constants.message_types.group_leave
  if (isGroupNotification) {
    return <GroupNotification {...props} />
  }

  const chat = props.chat
  let isTribe = false
  let isTribeOwner = false
  if (chat) {
    isTribe = chat.type === constants.chat_types.tribe
    isTribeOwner = chat.owner_pubkey === props.myPubkey
  }

  const memberReqTypes = [
    constants.message_types.member_request,
    constants.message_types.member_approve,
    constants.message_types.member_reject
  ]
  const isMemberRequest = memberReqTypes.includes(props.type)
  if (isMemberRequest) {
    return (
      <MemberRequest
        {...props}
        isTribeOwner={isTribeOwner}
        onDeleteChat={props.onDeleteChat}
      />
    )
  }

  const isMe = props.sender === 1
  const w = props.windowWidth

  const onRowOpenHandler = () => {
    if (props.message_content) {
      EE.emit(REPLY_UUID, props.uuid)
      setShowReply(true)
    }
  }
  const onRowCloseHandler = () => {
    EE.emit(CANCEL_REPLY_UUID, '')
    setShowReply(false)
  }

  return (
    <View
      style={{
        display: 'flex',
        width: '100%',
        flexDirection: 'row',
        marginBottom: 30
      }}
    >
      <Avatar
        alias={props.senderAlias}
        photo={props.senderPic ? `${props.senderPic}?thumb=true` : null}
        size={26}
        aliasSize={12}
        // hide={!props.showInfoBar || isMe}
        hide={isMe}
        style={{ marginLeft: !isMe ? 10 : 0 }}
      />
      {/* </View> */}

      <View style={{ display: 'flex', width: w - 40 }}>
        {/* {props.showInfoBar && <InfoBar {...props} senderAlias={props.senderAlias} />} */}
        <InfoBar {...props} senderAlias={props.senderAlias} />
        <SwipeRow
          ref={swipeRowRef}
          disableRightSwipe={true}
          friction={100}
          disableLeftSwipe={!props.message_content}
          rightOpenValue={-60}
          stopRightSwipe={-60}
          onRowOpen={onRowOpenHandler}
          onRowClose={onRowCloseHandler}
        >
          <View style={styles.replyWrap}>
            {showReply && (
              <IconButton
                icon={() => (
                  <FontAwesome5Icon name='reply' size={20} color={theme.darkGrey} />
                )}
                style={{
                  marginLeft: 0,
                  marginRight: 15,
                  backgroundColor: theme.lightGrey
                }}
              />
            )}
          </View>
          <MsgBubble
            {...props}
            isTribe={isTribe}
            isTribeOwner={isTribeOwner}
            myAlias={props.myAlias}
          />
        </SwipeRow>
      </View>
    </View>
  )
}

function MsgBubble(props) {
  const theme = useTheme()
  const [deleting, setDeleting] = useState(false)
  const isMe = props.sender === 1
  const isInvoice = props.type === constants.message_types.invoice
  const isPaid = props.status === constants.statuses.confirmed
  const [showPopover, setShowPopover] = useState(false)

  let backgroundColor = isMe ? theme.main : theme.bg
  if (isInvoice && !isPaid) {
    backgroundColor = theme.dark ? '#202a36' : 'white'
  }

  const isDeleted = props.status === constants.statuses.deleted

  const onRequestCloseHandler = () => setShowPopover(false)
  const onLongPressHandler = () => {
    ReactNativeHapticFeedback.trigger('impactLight', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false
    })
    setShowPopover(true)
  }
  const onCopyHandler = () => {
    Clipboard.setString(props.message_content || '')
    onRequestCloseHandler()
  }
  const onBoostHandler = async () => {
    await props.onBoostMsg(props)
    onRequestCloseHandler()
  }
  const onDeleteHandler = async () => {
    if (!deleting) {
      setDeleting(true)
      await props.onDelete(props.id)
      setDeleting(false)
      onRequestCloseHandler()
    }
  }

  const allowBoost = !isMe && !(props.message_content || '').startsWith('boost::')

  return (
    <Popover
      isVisible={showPopover}
      onRequestClose={onRequestCloseHandler}
      placement={PopoverPlacement.BOTTOM}
      arrowStyle={{ width: 0, height: 0 }}
      popoverStyle={{ display: 'flex', flexDirection: 'row', borderRadius: 40 }}
      from={
        <View
          style={{
            ...sharedStyles.bubble,
            alignSelf: isMe ? 'flex-end' : 'flex-start',
            backgroundColor,
            borderColor: !isMe ? theme.border : 'transparent',
            overflow: 'hidden'
          }}
        >
          {isDeleted && <DeletedMsg />}
          {!isDeleted && (props.reply_message_content ? true : false) && (
            <ReplyContent
              content={props.reply_message_content}
              senderAlias={props.reply_message_sender_alias}
            />
          )}
          {!isDeleted && (
            <Message
              {...props}
              id={props.id}
              onLongPress={onLongPressHandler}
              myAlias={props.myAlias}
              isMe={isMe}
            />
          )}
        </View>
      }
    >
      {allowBoost && (
        <IconButton
          onPress={onBoostHandler}
          icon={() => <Ionicon name='rocket' color={theme.primary} size={20} />}
          style={{
            backgroundColor: theme.lightGrey,
            marginHorizontal: 10
          }}
        />
      )}

      <IconButton
        onPress={onCopyHandler}
        icon={() => <Ionicon name='copy' color={theme.darkGrey} size={20} />}
        style={{
          backgroundColor: theme.lightGrey
        }}
      />
      {(isMe || props.isTribeOwner) && (
        <IconButton
          onPress={onDeleteHandler}
          icon={() => <Ionicon name='trash' color={theme.red} size={20} />}
          color={theme.red}
          style={{
            backgroundColor: theme.lightGrey,
            marginHorizontal: 10
          }}
        />
      )}
    </Popover>
  )
}

// Message content component
function Message(props) {
  const typ = constantCodes['message_types'][props.type]
  // console.log('props.type', props.type)
  // console.log('message_content', props.message_content)

  switch (typ) {
    case 'message':
      return <TextMsg {...props} />
    case 'attachment':
      return <MediaMsg {...props} />
    case 'invoice':
      return <Invoice {...props} />
    case 'payment':
      return <PaymentMessage {...props} />
    case 'direct_payment':
      return <PaymentMessage {...props} />
    case 'attachment':
      return <TextMsg {...props} />
    case 'bot_res':
      return <BotResMsg {...props} />
    case 'boost':
      return <BoostMsg {...props} />
    default:
      return <></>
  }
}

// Delete Message component
function DeletedMsg() {
  return (
    <View
      style={{ padding: 10, display: 'flex', flexDirection: 'row', alignItems: 'center' }}
    >
      <MaterialCommunityIcon name='cancel' color='#aaa' size={12} />
      <Text style={{ color: '#aaa', marginLeft: 5 }}>This message has been deleted</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  replyWrap: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  content: {
    backgroundColor: 'white',
    borderRadius: 8,
    width: 100
  },
  arrow: {
    borderTopColor: 'white'
  },
  background: {
    backgroundColor: 'rgba(0, 0, 0, 0.35)'
  }
})
