import React, { useEffect, useState, useRef } from 'react'
import { StyleSheet, View, ActivityIndicator, TouchableOpacity } from 'react-native'
import { useObserver } from 'mobx-react-lite'
import FastImage from 'react-native-fast-image'

import { parseLDAT } from '../../../utils/ldat'
import { useCachedEncryptedFile } from '../../../chat/msg/hooks'
import { SCREEN_WIDTH } from '../../../../constants'

function MediaItem(props) {
  //   const [containerWidth, setContainerWidth] = useState<number>(0)
  //   const containerRef = useRef<TouchableOpacity>(null)
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
      <TouchableOpacity
        onPress={() => {
          onMediaPress(id)
        }}
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
        {hasImgData ? (
          <MediaType type={media_type} data={data} uri={uri} />
        ) : (
          <ActivityIndicator animating={true} color='grey' />
        )}
      </TouchableOpacity>
    </>
  )
}

function MediaType({ type, data, uri }) {
  if (type === 'sphinx/text') return <></>
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
  }
})

export default React.memo(MediaItem)
