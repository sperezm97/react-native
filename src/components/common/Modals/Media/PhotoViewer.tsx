import React, { useEffect, useState } from 'react'
import { useObserver } from 'mobx-react-lite'
import { StyleSheet, View, Modal, Text } from 'react-native'
import FastImage from 'react-native-fast-image'
import { IconButton } from 'react-native-paper'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import Swiper from 'react-native-swiper'
import Ionicon from 'react-native-vector-icons/Ionicons'
import { ActivityIndicator } from 'react-native-paper'
import { isIphoneX, getBottomSpace } from 'react-native-iphone-x-helper'
import ViewMoreText from 'react-native-view-more-text'

import { useStores, useTheme } from '../../../../store'
import { SCREEN_WIDTH, SCREEN_HEIGHT, STATUS_BAR_HEIGHT } from '../../../../constants'
import { parseLDAT } from '../../../utils/ldat'
import { useCachedEncryptedFile } from '../../../chat/msg/hooks'
import Button from '../../../common/Button'
import Typography from '../../../common/Typography'
import BoostDetails from './BoostDetails'

export default function PhotoViewer({ visible, close, photos, chat, initialIndex }) {
  const theme = useTheme()

  // return useObserver(() => (
  return (
    <Modal
      visible={visible}
      animationType='slide'
      presentationStyle='fullScreen'
      onDismiss={close}
    >
      <View style={{ ...styles.wrap, backgroundColor: theme.black }}>
        <IconButton
          icon={() => <MaterialCommunityIcon name='close' color={theme.icon} size={30} />}
          onPress={close}
          style={{ ...styles.closeButton }}
        />
        <Swiper
          horizontal={false}
          showsButtons={false}
          showsPagination={false}
          index={initialIndex}
          loop={false}
        >
          {photos.map((p, index) => (
            <SwipeItem key={index} {...p} chat={chat} />
          ))}
        </Swiper>
      </View>
    </Modal>
  )
  // ))
}

function SwipeItem(props) {
  const [photoH, setPhotoH] = useState(0)
  const {
    uuid,
    message_content,
    media_type,
    media_token,
    chat,
    boosts_total_sats
  } = props
  const [buying, setBuying] = useState(false)
  const { meme, ui, chats, msg, user } = useStores()
  const theme = useTheme()

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

  const isMe = props.sender === 1
  const hasImgData = data || uri ? true : false
  const hasContent = message_content ? true : false
  const showPurchaseButton = amt && !isMe ? true : false
  const showStats = isMe && amt
  const sold = props.sold

  let isImg = false
  let showPayToUnlockMessage = false
  if (media_type === 'n2n2/text') {
    if (!isMe && !loading && !paidMessageText) showPayToUnlockMessage = true
  }
  if (media_type.startsWith('image') || media_type.startsWith('video')) {
    isImg = true
  }

  async function buy(amount) {
    setBuying(true)
    let contact_id = props.sender
    if (!contact_id) {
      contact_id = chat.contact_ids && chat.contact_ids.find(cid => cid !== 1)
    }

    await msg.purchaseMedia({
      chat_id: chat.id,
      media_token,
      amount,
      contact_id
    })
    setBuying(false)
  }

  function onPurchasePress() {
    if (!purchased) buy(amt)
  }

  async function onBoostPress() {
    const tribe = await chats.getTribeDetails(chat.host, chat.uuid)
    const pricePerMessage = tribe.price_per_message + tribe.escrow_amount

    if (!uuid) return
    const amount = (user.tipAmount || 100) + pricePerMessage
    const r = msg.sendMessage({
      boost: true,
      contact_id: null,
      text: '',
      amount,
      chat_id: chat.id || null,
      reply_uuid: uuid,
      message_price: pricePerMessage
    })

    // if (r) {
    // }
  }

  const h = SCREEN_HEIGHT - STATUS_BAR_HEIGHT - 60
  const w = SCREEN_WIDTH

  const showBoostRow = boosts_total_sats ? true : false

  function renderViewMore(onPress) {
    return (
      <Typography onPress={onPress} color={theme.primary}>
        View more
      </Typography>
    )
  }

  function renderViewLess(onPress) {
    return (
      <Typography onPress={onPress} color={theme.primary}>
        View less
      </Typography>
    )
  }

  return (
    <View style={{ ...styles.swipeItem }}>
      {isImg && showPurchaseButton && !purchased && (
        <View style={{ ...styles.locked }}>
          <>
            <Ionicon name='lock-closed' color={theme.silver} size={50} />
            {showPurchaseButton && (
              <Button
                w='50%'
                onPress={onPurchasePress}
                loading={buying}
                style={{ marginTop: 14 }}
              >
                {purchased ? 'Purchased' : `Pay ${amt} sat`}
              </Button>
            )}
          </>
        </View>
      )}
      {hasImgData && (
        <View
          style={{
            width: w,
            height: photoH
          }}
        >
          <FastImage
            resizeMode='contain'
            source={{ uri: data || uri }}
            onLoad={evt => {
              setPhotoH((evt.nativeEvent.height / evt.nativeEvent.width) * w)
            }}
            style={{
              ...styles.photo,
              width: w,
              height: photoH
              // width: w,
              // height: h,
              // maxHeight: h - 100
            }}
          />
        </View>
      )}

      <View style={{ ...styles.footer }}>
        <View style={{ ...styles.row, marginBottom: 10 }}>
          {hasContent && (
            <>
              {message_content.length > 50 ? (
                <ViewMoreText
                  numberOfLines={1}
                  renderViewMore={renderViewMore}
                  renderViewLess={renderViewLess}
                >
                  <Typography size={16} color={theme.white}>
                    {message_content}
                  </Typography>
                </ViewMoreText>
              ) : (
                <Typography size={16} color={theme.white}>
                  {message_content}
                </Typography>
              )}
            </>
          )}
        </View>

        <View style={styles.row}>
          {!isMe ? (
            <IconButton
              icon={() => <Ionicon name='rocket-outline' color={theme.white} size={24} />}
              onPress={onBoostPress}
            />
          ) : (
            <View></View>
          )}

          <View>{showBoostRow && <BoostDetails {...props} myAlias={user.alias} />}</View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    height: '100%',
    position: 'relative'
  },
  swipeItem: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%'
  },
  footer: {
    position: 'absolute',
    // bottom: 0,
    bottom: isIphoneX() ? getBottomSpace() : 15,
    width: '100%',
    // height: isIphoneX() ? 100 + getBottomSpace() : 90,
    paddingTop: 10,
    paddingRight: 16,
    paddingLeft: 16
  },
  closeButton: {
    position: 'absolute',
    top: STATUS_BAR_HEIGHT + 1,
    right: 0,
    zIndex: 1
  },

  photo: {
    width: '100%',
    height: '100%'
  },
  locked: {
    height: '100%',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
})
