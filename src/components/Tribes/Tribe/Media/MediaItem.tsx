import React, { useEffect, useState, useRef } from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { useObserver } from 'mobx-react-lite'
import FastImage from 'react-native-fast-image'
import Ionicon from 'react-native-vector-icons/Ionicons'
import { ActivityIndicator } from 'react-native-paper'

import { useStores, useTheme } from '../../../../store'
import { parseLDAT } from '../../../utils/ldat'
import { useCachedEncryptedFile } from '../../../chat/msg/hooks'
import { SCREEN_WIDTH } from '../../../../constants'
import Typography from '../../../common/Typography'

function MediaItem(props) {
  const [buying, setBuying] = useState(false)
  const { meme, ui, msg } = useStores()
  const theme = useTheme()
  const { index, id, message_content, media_type, chat, media_token, onMediaPress } =
    props

  const ldat = parseLDAT(media_token)
  let { data, uri, loading, trigger, paidMessageText } = useCachedEncryptedFile(
    props,
    ldat
  )

  useEffect(() => {
    trigger()
  }, [media_token])

  let amt = null
  let purchased = false
  if (ldat.meta && ldat.meta.amt) {
    amt = ldat.meta.amt
    if (ldat.sig) purchased = true
  }

  const isMe = props.sender === props.myid
  const hasImgData = data || uri ? true : false
  const hasContent = message_content ? true : false
  const showPurchaseButton = amt && !isMe ? true : false
  const showStats = isMe && amt
  const sold = props.sold

  let isImg = false
  let minHeight = 60
  let showPayToUnlockMessage = false
  if (media_type === 'n2n2/text') {
    if (!isMe && !loading && !paidMessageText) showPayToUnlockMessage = true
  }
  if (media_type.startsWith('image') || media_type.startsWith('video')) {
    isImg = true
  }

  function handleMediaPress() {
    // if (isImg && showPurchaseButton && !purchased) {
    //   // if (!purchased) buy(amt)
    //   // return
    // } else {
    return onMediaPress(id)
    // }
  }

  async function buy(amount) {
    setBuying(true)
    let contact_id = props.sender
    if (!contact_id) {
      contact_id = chat.contact_ids && chat.contact_ids.find(cid => cid !== props.myid)
    }

    await msg.purchaseMedia({
      chat_id: chat.id,
      media_token,
      amount,
      contact_id
    })
    setBuying(false)
  }

  return useObserver(() => {
    return (
      <>
        <TouchableOpacity
          onPress={handleMediaPress}
          //   ref={containerRef}
          delayLongPress={150}
          //   onLongPress={_onLongPressHandler}
          //   onPressOut={_onPressOutHandler}
          activeOpacity={0.8}
          style={{
            ...styles.photoWrap,
            marginRight: (index + 1) % 3 === 0 ? 0 : 5
          }}
        >
          {hasImgData && <MediaType type={media_type} data={data} uri={uri} />}

          {isImg && showPurchaseButton && !purchased && (
            <View style={{ ...styles.locked, backgroundColor: theme.main }}>
              {buying ? (
                <ActivityIndicator size='small' />
              ) : (
                <>
                  <Ionicon name='lock-closed' color={theme.silver} size={30} />
                </>
              )}
            </View>
          )}
        </TouchableOpacity>
      </>
    )
  })
}

function MediaType({ type, data, uri }) {
  if (type === 'n2n2/text') return <></>
  if (type.startsWith('image')) {
    return (
      <FastImage
        // resizeMode='cover'
        source={{ uri: uri || data }}
        style={{ ...styles.photo }}
      />
    )
  }
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    position: 'absolute',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  photoWrap: {
    position: 'relative',
    width: SCREEN_WIDTH / 3 - 10 / 3,
    height: SCREEN_WIDTH / 3 - 10 / 3,
    marginBottom: 5
  },
  photo: {
    width: '100%',
    height: '100%'
    // borderRadius: 5
  },
  locked: {
    height: '100%',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export default React.memo(MediaItem)
