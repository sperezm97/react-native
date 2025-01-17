import React, { useState, useRef, useLayoutEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import { SwipeRow } from 'react-native-swipe-list-view'
import { IconButton } from 'react-native-paper'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import Ionicon from 'react-native-vector-icons/Ionicons'
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5'
import ReactNativeHapticFeedback from 'react-native-haptic-feedback'
import Popover, { PopoverPlacement } from 'react-native-popover-view'
import Clipboard from '@react-native-community/clipboard'

import { useTheme, hooks } from '../../../store'
import { useChatReply } from '../../../store/hooks/chat'
import { constantCodes, constants, SCREEN_HEIGHT, SCREEN_WIDTH } from '../../../constants'
import EE, { CLEAR_REPLY_UUID, REPLY_UUID } from '../../utils/ee'
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
import Typography from '../../common/Typography'

const { useMsgs } = hooks

export default function MsgRow(props) {
  const theme = useTheme()
  const [, setShowReply] = useState(false) // showReply

  const swipeRowRef = useRef<any>(null)

  const isMe = props.sender === props.myid
  const isTribeOwner = props?.chat?.owner_pubkey === props.myPubkey

  useLayoutEffect(() => {
    EE.on(CLEAR_REPLY_UUID, clearReplyUUID)
    return () => {
      EE.removeListener(CLEAR_REPLY_UUID, clearReplyUUID)
    }
  }, [swipeRowRef])

  const clearReplyUUID = () => {
    const sr = swipeRowRef.current
    if (sr && sr.isOpen) {
      if (sr && sr.closeRow) sr.closeRow()
      setShowReply(false)
    }
  }

  const onRowDidOpenHandler = () => {
    clearReplyUUID()
  }

  const onRowOpenHandler = () => {
    EE.emit(REPLY_UUID, props.uuid)

    ReactNativeHapticFeedback.trigger('impactLight', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    })
  }

  const isGroupNotification =
    props.type === constants.message_types.group_join || props.type === constants.message_types.group_leave

  const memberReqTypes = [
    constants.message_types.member_request,
    constants.message_types.member_approve,
    constants.message_types.member_reject,
  ]
  const isMemberRequest = memberReqTypes.includes(props.type)

  /**
   * Returns
   */

  if (isGroupNotification) {
    return <GroupNotification {...props} />
  }

  if (isMemberRequest) {
    return <MemberRequest {...props} isTribeOwner={isTribeOwner} onDeleteChat={props.onDeleteChat} />
  }

  return (
    <View
      style={{
        display: 'flex',
        width: '100%',
        marginTop: props.showInfoBar ? 16 : 5,
      }}
    >
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
        }}
      >
        <SwipeRow
          ref={swipeRowRef}
          disableRightSwipe={true}
          friction={100}
          // disableLeftSwipe={!props.message_content}
          rightOpenValue={-60}
          stopRightSwipe={-60}
          onRowOpen={onRowOpenHandler}
          onRowDidOpen={onRowDidOpenHandler}
          // onRowClose={onRowCloseHandler}
        >
          <View />
          <View
            style={{
              flexDirection: 'row',
              width: SCREEN_WIDTH - 30,
            }}
          >
            <View>
              <Avatar
                alias={props.senderAlias}
                photo={props.senderPic ? `${props.senderPic}` : null}
                size={26}
                aliasSize={12}
                hide={isMe || !props.showInfoBar}
                style={{ marginLeft: !isMe ? 10 : 0 }}
              />
            </View>
            <View
              style={{
                marginRight: isMe ? 5 : 0,
                width: '100%',
              }}
            >
              {props.showInfoBar ? <InfoBar {...props} senderAlias={props.senderAlias} /> : null}
              <MsgBubble {...props} isTribeOwner={isTribeOwner} myAlias={props.myAlias} myid={props.myid} />
            </View>
            <View
              style={{
                ...styles.replyWrap,
              }}
            >
              <IconButton
                icon={() => <FontAwesome5Icon name='reply' size={20} color={theme.darkGrey} />}
                style={{
                  marginRight: 15,
                  backgroundColor: theme.lightGrey,
                }}
              />
            </View>
          </View>
        </SwipeRow>
      </View>
    </View>
  )
}

const isMsgBiggerThanScreen = (msgHeight: number) => msgHeight > SCREEN_HEIGHT - 300

function MsgBubble(props) {
  const theme = useTheme()

  const [popoverPlacement, setPopoverPlacement] = useState(PopoverPlacement.BOTTOM)
  const [showPopover, setShowPopover] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const msgRefHeight = useRef<number>(0)

  const isInvoice = props.type === constants.message_types.invoice
  const isPaid = props.status === constants.statuses.confirmed
  const isMe = props.sender === props.myid
  const isDeleted = props.status === constants.statuses.deleted
  const allowBoost = !isMe && !(props.message_content || '').startsWith('boost::')

  let backgroundColor = isMe ? (theme.dark ? theme.main : theme.lightGrey) : theme.bg
  if (isInvoice && !isPaid) {
    backgroundColor = theme.dark ? '#202a36' : 'white'
  }

  const msgs = useMsgs(props.chat) || []
  const { replyMessage } = useChatReply(msgs, props.reply_uuid)

  const onRequestCloseHandler = () => setShowPopover(false)
  const onLongPressHandler = () => {
    if (isMsgBiggerThanScreen(msgRefHeight.current)) setPopoverPlacement(PopoverPlacement.CENTER)
    ReactNativeHapticFeedback.trigger('impactLight', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
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

  return (
    <Popover
      isVisible={showPopover}
      onRequestClose={onRequestCloseHandler}
      placement={popoverPlacement}
      arrowStyle={{ width: 0, height: 0 }}
      popoverStyle={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        borderRadius: 40,
        minWidth: 140,
      }}
      from={
        <View
          style={{
            ...sharedStyles.bubble,
            alignSelf: isMe ? 'flex-end' : 'flex-start',
            backgroundColor,
            borderColor: !isMe ? theme.border : 'transparent',
            overflow: 'hidden',
          }}
          onLayout={(event) => {
            msgRefHeight.current = event.nativeEvent.layout.height
          }}
        >
          {isDeleted ? <DeletedMsg /> : null}
          {!isDeleted && (props.reply_uuid ? true : false) ? (
            <ReplyContent
              content={props.reply_message_content}
              senderAlias={props.reply_message_sender_alias}
              replyMessageExtraContent={replyMessage}
            />
          ) : null}
          {!isDeleted ? (
            <Message
              {...props}
              id={props.id}
              onLongPress={onLongPressHandler}
              myAlias={props.myAlias}
              myid={props.myid}
            />
          ) : null}
        </View>
      }
    >
      {allowBoost ? (
        <IconButton
          onPress={onBoostHandler}
          icon={() => <Ionicon name='rocket' color={theme.primary} size={20} />}
          style={{
            backgroundColor: theme.lightGrey,
            marginHorizontal: 14,
          }}
        />
      ) : null}

      <IconButton
        onPress={onCopyHandler}
        icon={() => <Ionicon name='copy' color={theme.darkGrey} size={20} />}
        style={{
          backgroundColor: theme.lightGrey,
          marginHorizontal: 14,
        }}
      />
      {(isMe || props.isTribeOwner) && (
        <IconButton
          onPress={onDeleteHandler}
          icon={() => <Ionicon name='trash' color={theme.red} size={20} />}
          color={theme.red}
          style={{
            backgroundColor: theme.lightGrey,
            marginHorizontal: 14,
          }}
        />
      )}
    </Popover>
  )
}

// Message content component
function Message(props) {
  const typ = constantCodes?.message_types[props.type]

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
  const theme = useTheme()

  return (
    <View
      style={{
        paddingVertical: 10,
        paddingHorizontal: 12,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <MaterialCommunityIcon name='cancel' color={theme.subtitle} size={12} />
      <Typography style={{ marginLeft: 5 }} size={13} color={theme.subtitle} lh={18}>
        This message has been deleted
      </Typography>
    </View>
  )
}

const styles = StyleSheet.create({
  replyWrap: {
    // width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    // position: 'absolute'
  },
  content: {
    backgroundColor: 'white',
    borderRadius: 8,
    width: 100,
  },
  arrow: {
    borderTopColor: 'white',
  },
  background: {
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
})
