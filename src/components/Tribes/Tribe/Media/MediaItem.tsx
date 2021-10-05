import React, { useEffect, useState, useMemo } from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { observer, useObserver } from 'mobx-react-lite'
import FastImage from 'react-native-fast-image'
import Ionicon from 'react-native-vector-icons/Ionicons'
import { ActivityIndicator } from 'react-native-paper'
import { display, log } from 'lib/logging'

import { useTheme } from 'store'
import { parseLDAT } from '../../../utils/ldat'
import { useCachedEncryptedFile } from '../../../chat/msg/hooks'
import { SCREEN_WIDTH } from '../../../../constants'
import { isBase64 } from 'lib/crypto/Base64'
import { getRumbleLink, getYoutubeLink } from '../../../chat/msg/utils'
import EmbedVideo from '../../../chat/msg/embedVideo'

const MediaItem = observer((props: any) => {
  const { index, id, media_type, media_token, onMediaPress }: any = props
  const ldat = parseLDAT(media_token)

  const [buying] = useState(false)
  const theme = useTheme()
  let { data, uri, trigger, paidMessageText } = useCachedEncryptedFile(props, ldat)

  let amt = null
  let purchased = false
  if (ldat.meta?.amt) {
    amt = ldat.meta.amt
    if (ldat.sig) purchased = true
  }

  const isMe = props.sender === props.myid
  const hasImgData = !!(data || uri)
  const showPurchaseButton = !!(amt && !isMe)

  const decodedMessageInCaseOfEmbedVideo = isBase64(paidMessageText).text
  const rumbleLink = useMemo(
    () => getRumbleLink(decodedMessageInCaseOfEmbedVideo),
    [decodedMessageInCaseOfEmbedVideo]
  )
  const youtubeLink = useMemo(
    () => getYoutubeLink(decodedMessageInCaseOfEmbedVideo),
    [decodedMessageInCaseOfEmbedVideo]
  )

  // Before implementation uses youtubeLink || rumbleLink;
  // but this is only available once the user pay for this content
  const isEmbedVideo = decodedMessageInCaseOfEmbedVideo

  useEffect(() => {
    trigger()
  }, [media_token])

  function handleMediaPress() {
    log(`MEDIA PRESS ${id}`)
    return onMediaPress(id)
  }

  // if (!hasImgData && )

  if (!isEmbedVideo && !hasImgData) {
    display({
      name: 'MediaItem',
      important: true,
      preview: `ID: ${id} - media_type ${media_type}`,
      value: {
        ...props,
        decodedMessageInCaseOfEmbedVideo,
        rumbleLink,
        youtubeLink,
        ldat,
        data,
        uri,
        trigger,
        paidMessageText,
        isMe,
        hasImgData,
        showPurchaseButton,
        purchased,
        isEmbedVideo,
      },
    })
    display({
      name: `MediaItem ${props.id}`,
      preview: 'No img or video data - returning empty obj',
      important: true,
    })
    return <></>
  }

  return (
    <>
      <TouchableOpacity
        onPress={isEmbedVideo ? () => null : handleMediaPress}
        delayLongPress={150}
        activeOpacity={0.8}
        style={{
          ...styles.photoWrap,
          marginRight: (index + 1) % 3 === 0 ? 0 : 5,
        }}
      >
        {hasImgData ? <MediaType type={media_type} data={data} uri={uri} /> : null}

        {showPurchaseButton && !purchased ? (
          <View style={{ ...styles.locked, backgroundColor: theme.main }}>
            {buying ? (
              <ActivityIndicator size='small' />
            ) : (
              <>
                <Ionicon name='lock-closed' color={theme.silver} size={30} />
              </>
            )}
          </View>
        ) : null}
        {Boolean(youtubeLink || rumbleLink) ? (
          <View style={{ width: 20 }}>
            <EmbedVideo squareSize={SCREEN_WIDTH / 3 - 10 / 3} type='rumble' link={rumbleLink} />
            <EmbedVideo squareSize={SCREEN_WIDTH / 3 - 10 / 3} type='youtube' link={youtubeLink} />
          </View>
        ) : null}
      </TouchableOpacity>
    </>
  )
})

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
  return null
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    position: 'absolute',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoWrap: {
    position: 'relative',
    width: SCREEN_WIDTH / 3 - 10 / 3,
    height: SCREEN_WIDTH / 3 - 10 / 3,
    marginBottom: 5,
  },
  photo: {
    width: '100%',
    height: '100%',
    // borderRadius: 5
  },
  locked: {
    height: '100%',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default React.memo(MediaItem)
