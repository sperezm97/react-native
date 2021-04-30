import React, { useEffect, useState } from 'react'
import { useObserver } from 'mobx-react-lite'
import { StyleSheet, View, Modal, Text } from 'react-native'
import FastImage from 'react-native-fast-image'
import { IconButton } from 'react-native-paper'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import Swiper from 'react-native-swiper'

import { useTheme } from '../../../../store'
import { SCREEN_WIDTH, SCREEN_HEIGHT, STATUS_BAR_HEIGHT } from '../../../../constants'
import { parseLDAT } from '../../../utils/ldat'
import { useCachedEncryptedFile } from '../../../chat/msg/hooks'

export default function PhotoViewer({ visible, close, photos, photoId }) {
  const theme = useTheme()

  function getInitialPhotoIndex() {
    const initialIndex = photos.findIndex(m => m.id === photoId)

    return initialIndex || 0
  }

  return useObserver(() => (
    <Modal
      visible={visible}
      animationType='slide'
      presentationStyle='fullScreen'
      onDismiss={close}
    >
      <View style={{ ...styles.container, backgroundColor: theme.black }}>
        <IconButton
          icon={() => <MaterialCommunityIcon name='close' color={theme.icon} size={30} />}
          onPress={close}
          style={{ ...styles.closeButton }}
        />

        <Swiper
          horizontal={false}
          showsButtons={false}
          showsPagination={false}
          index={getInitialPhotoIndex()}
        >
          {photos.map((p, index) => (
            <SwipeItem key={index} {...p} />
          ))}
        </Swiper>
      </View>
    </Modal>
  ))
}

function SwipeItem(props) {
  const [photoH, setPhotoH] = useState(0)
  const { message_content, media_type, chat, media_token } = props

  const ldat = parseLDAT(media_token)
  let { data, uri, loading, trigger, paidMessageText } = useCachedEncryptedFile(
    props,
    ldat
  )

  useEffect(() => {
    trigger()
  }, [media_token])

  //   const hasImgData = data || uri ? true : false

  const h = SCREEN_HEIGHT - STATUS_BAR_HEIGHT - 60
  const w = SCREEN_WIDTH

  return (
    <View style={{ ...styles.swipeItem }}>
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
            ...styles.photo
            // width: w,
            // height: h,
            // maxHeight: h - 100
          }}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    position: 'relative'
  },
  closeButton: {
    position: 'absolute',
    top: STATUS_BAR_HEIGHT + 1,
    right: 0,
    zIndex: 1
  },
  swipeItem: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
  },
  photo: {
    width: '100%',
    height: '100%'
  }
})
