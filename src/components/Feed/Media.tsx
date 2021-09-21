import React, { useEffect, useState, useRef } from 'react'
import { StyleSheet, View, ActivityIndicator, TouchableOpacity } from 'react-native'
import { useObserver } from 'mobx-react-lite'
import { useNavigation } from '@react-navigation/native'
import FastImage from 'react-native-fast-image'
import { IconButton } from 'react-native-paper'
import Ionicon from 'react-native-vector-icons/Ionicons'
import moment from 'moment'

import { useStores, useTheme, hooks } from '../../store'
import { calendarDate } from '../../store/utils/date'
import { usePicSrc } from '../utils/picSrc'
import { parseLDAT } from '../utils/ldat'
import { useCachedEncryptedFile } from '../chat/msg/hooks'
import { SCREEN_WIDTH, SCREEN_HEIGHT, STATUS_BAR_HEIGHT } from '../../constants'
import Typography from '../common/Typography'
import Avatar from '../common/Avatar'
import Divider from '../common/Layout/Divider'
import Boost from '../common/Button/Boost'
import BoostDetails from './BoostDetails'

function Media(props) {
  const {
    index,
    mediaLength,
    item,
    id,
    uuid,
    message_content,
    media_type,
    chat,
    media_token,
    onMediaPress,
    created_at,
    tribe,
    boosts_total_sats,
  } = props
  const [boosted, setBoosted] = useState(false)
  const { msg, ui, user, contacts, chats } = useStores()
  const theme = useTheme()
  const navigation = useNavigation()

  const ldat = parseLDAT(media_token)

  let { data, uri, loading, trigger, paidMessageText } = useCachedEncryptedFile(props, ldat)

  let amt = null
  let purchased = false
  if (ldat.meta && ldat.meta.amt) {
    amt = ldat.meta.amt
    if (ldat.sig) purchased = true
  }

  useEffect(() => {
    trigger()
  }, [media_token])

  const hasImgData = data || uri ? true : false

  async function onBoostPress() {
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
      message_price: pricePerMessage,
    })
    if (r) {
      setBoosted(true)
    }
  }

  const onTribeOwnerPress = () => navigation.navigate('Tribe' as never, { tribe: { ...tribe } } as never)

  const showBoostRow = boosts_total_sats ? true : false

  const meContact = contacts.contacts.find((c) => c.id === user.myid)
  const myPhoto = usePicSrc(meContact)

  return (
    <>
      {hasImgData && (
        <View style={{ ...styles.wrap }}>
          <View style={{ ...styles.header }}>
            <TouchableOpacity activeOpacity={0.6} onPress={onTribeOwnerPress}>
              <View style={{ ...styles.headerInfo }}>
                <View style={styles.avatarWrap}>
                  <Avatar size={35} photo={tribe.img} alias={tribe.name} round={50} />
                </View>
                <Typography size={14}>{tribe.name}</Typography>
              </View>
            </TouchableOpacity>

            <Typography size={12} color={theme.subtitle}>
              {calendarDate(moment(created_at), 'MMM DD, YYYY')}
            </Typography>
          </View>

          {!loading ? <MediaType type={media_type} data={data} uri={uri} /> : <ActivityIndicator animating={true} />}

          <View style={{ ...styles.footer }}>
            <Boost onPress={onBoostPress} circleH={30} circleW={30} />
            {showBoostRow && <BoostDetails {...props} myAlias={user.alias} myPhoto={myPhoto} myid={user.myid} />}
          </View>
          {/* <View style={{ ...styles.meta }}></View> */}

          {index + 1 !== mediaLength && <Divider mt={10} mb={10} />}
        </View>
      )}
    </>
  )
}

function MediaType({ type, data, uri }) {
  const h = SCREEN_HEIGHT - STATUS_BAR_HEIGHT - 60
  const w = SCREEN_WIDTH
  const [photoH, setPhotoH] = useState(0)

  if (type === 'n2n2/text') return <></>

  if (type.startsWith('image')) {
    return (
      <View
        style={{
          width: w,
          height: photoH,
        }}
      >
        <FastImage
          resizeMode='contain'
          source={{ uri: uri || data }}
          style={{ ...styles.photo }}
          onLoad={(evt) => {
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
  wrap: {
    // flex: 1
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    // marginBottom: 10
  },
  headerInfo: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  footer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingRight: 5,
    paddingLeft: 5,
    // marginBottom: 10
  },
  meta: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 5,
    paddingLeft: 14,
  },
  avatarWrap: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 10,
    // width: 60,
    // height: 60,
    // paddingLeft: 4
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
  },
})

export default React.memo(Media)
