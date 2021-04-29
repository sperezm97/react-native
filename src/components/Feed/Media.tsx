import React, { useEffect, useState, useRef } from 'react'
import { StyleSheet, View, ActivityIndicator, TouchableOpacity } from 'react-native'
import { useObserver } from 'mobx-react-lite'
import FastImage from 'react-native-fast-image'

import { parseLDAT } from '../utils/ldat'
import { useCachedEncryptedFile } from '../chat/msg/hooks'
import { SCREEN_WIDTH, SCREEN_HEIGHT, STATUS_BAR_HEIGHT } from '../../constants'
import Typography from '../common/Typography'

function Media(props) {
  const {
    index,
    id,
    message_content,
    media_type,
    chat,
    media_token,
    onMediaPress
  } = props

  const ldat = parseLDAT(media_token)
  let { data, uri, loading, trigger, paidMessageText } = useCachedEncryptedFile(
    props,
    ldat
  )

  useEffect(() => {
    trigger()
  }, [media_token])

  const hasImgData = data || uri ? true : false

  return (
    <>
      <View style={{ ...styles.mediaItem }}>
        {/* <MediaType type={media_type} data={data} uri={uri} /> */}

        {hasImgData ? (
          <MediaType type={media_type} data={data} uri={uri} />
        ) : (
          // <Typography>{media_type}</Typography>
          <ActivityIndicator animating={true} color='grey' />
        )}
      </View>
    </>
  )
}

function MediaType({ type, data, uri }) {
  const h = SCREEN_HEIGHT - STATUS_BAR_HEIGHT - 60
  const w = SCREEN_WIDTH
  const [photoH, setPhotoH] = useState(h)

  if (type === 'n2n2/text') return <></>
  if (type.startsWith('image')) {
    return (
      <View
        style={{
          width: w,
          height: photoH
        }}
      >
        <FastImage
          resizeMode='contain'
          source={{ uri: uri || data }}
          style={{ ...styles.photo }}
          onLoad={evt => {
            setPhotoH((evt.nativeEvent.height / evt.nativeEvent.width) * w)
          }}
        />
      </View>
    )
  } else {
    return <></>
  }
}

const styles = StyleSheet.create({
  mediaItem: {
    // flex: 1
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
  }
})

export default React.memo(Media)
