import React, { useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import { useObserver } from 'mobx-react-lite'
import { IconButton } from 'react-native-paper'
import FastImage from 'react-native-fast-image'
import Ionicon from 'react-native-vector-icons/Ionicons'

import { useTheme } from '../../../store'
import { useAvatarColor } from '../../../store/hooks/msg'
import { useCachedEncryptedFile } from './hooks'
import { parseLDAT } from '../../utils/ldat'
import { constantCodes, constants } from '../../../constants'
import Typography from '../../common/Typography'

export default function ReplyContent(props) {
  const theme = useTheme()

  // console.log('props replyMsg', props.replyMsg)

  const extraStyles = props.extraStyles || {}
  const onCloseHandler = () => {
    if (props.onClose) props.onClose()
  }
  const nameColor = props.color || useAvatarColor(props.senderAlias || '')

  return useObserver(() => {
    return (
      <View style={{ ...styles.wrap, ...extraStyles }}>
        <View style={{ ...styles.replyBar, backgroundColor: nameColor }} />
        <View style={{ ...styles.replyWrap }}>
          {props.replyMsg && <ReplySource {...props} />}

          <View style={{ ...styles.replyContent }}>
            <Typography color={nameColor} numberOfLines={1} fw='500'>
              {props.senderAlias || ''}
            </Typography>
            <Typography style={{ maxWidth: '100%' }} numberOfLines={1}>
              {props.content}
            </Typography>
          </View>
        </View>
        {props.showClose && (
          <IconButton
            icon='close'
            size={18}
            color='#666'
            style={{ ...styles.close }}
            onPress={onCloseHandler}
          />
        )}
      </View>
    )
  })
}

function ReplySource(props) {
  const typ = constantCodes['message_types'][props.replyMsg.type]

  switch (typ) {
    case 'message':
      return <></>

    case 'attachment':
      return <Media {...props.replyMsg} showClose={props.showClose} />

    case 'boost':
    default:
      return <></>
  }
}

function Media(props) {
  const { id, message_content, media_type, chat, media_token } = props
  const theme = useTheme()
  const isMe = props.sender === 1

  const ldat = parseLDAT(media_token)

  let amt = null
  let purchased = false
  if (ldat.meta && ldat.meta.amt) {
    amt = ldat.meta.amt
    if (ldat.sig) purchased = true
  }

  let { data, uri, loading, trigger, paidMessageText } = useCachedEncryptedFile(
    props,
    ldat
  )

  useEffect(() => {
    trigger()
  }, [media_token])

  const hasImgData = data || uri ? true : false
  const showPurchaseButton = amt && !isMe ? true : false

  return (
    <View style={{ width: props.showClose ? '15%' : '25%' }}>
      {!hasImgData ? (
        <Ionicon name='lock-closed' color={theme.silver} size={30} />
      ) : (
        <FastImage
          style={{ ...styles.photo }}
          resizeMode='cover'
          source={{ uri: uri || data }}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    height: 50,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 20,
    paddingRight: 40,
    position: 'relative'
  },
  replyBar: {
    width: 5,
    height: '90%',
    marginRight: 10
  },
  replyWrap: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%'
  },
  replyContent: {
    display: 'flex',
    width: '85%'
  },
  photo: {
    width: 40,
    height: 40,
    borderRadius: 10
  },
  close: {
    position: 'absolute',
    top: -5,
    right: 5
  }
})
