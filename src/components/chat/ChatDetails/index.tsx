import React, { useState } from 'react'
import { useObserver } from 'mobx-react-lite'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { IconButton } from 'react-native-paper'
import ImagePicker from 'react-native-image-picker'
import Slider from '@react-native-community/slider'
import { useNavigation } from '@react-navigation/native'
import moment from 'moment'
import FeatherIcon from 'react-native-vector-icons/Feather'

import { useStores, useTheme } from '../../../store'
import { constants } from '../../../constants'
import { useChatPicSrc, createChatPic } from '../../utils/picSrc'
import EE, { LEFT_GROUP } from '../../utils/ee'
import BackHeader from '../../common/BackHeader'
import GroupSettings from '../../common/Dialogs/GroupSettings'
import Avatar from '../../common/Avatar'
import Typography from '../../common/Typography'

export default function ChatDetails({ route }) {
  const { ui, chats, user } = useStores()
  const theme = useTheme()
  const [loading, setLoading] = useState(false)
  const [groupSettingsDialog, setGroupSettingsDialog] = useState(false)
  const [loadingTribe, setLoadingTribe] = useState(false)
  const navigation = useNavigation()

  const group = route.params.group

  const [alias, setAlias] = useState((group && group['my_alias']) || '')
  function maybeUpdateAlias() {
    if (!(group && group.id)) return
    if (alias !== group['my_alias']) {
      chats.updateMyInfoInChat(group.id, alias, '')
    }
  }

  let initppm = chats.pricesPerMinute[group.id]
  if (!(initppm || initppm === 0)) initppm = group.pricePerMinute || 5
  const [ppm, setPpm] = useState(initppm)

  const uri = useChatPicSrc(group)
  const hasGroup = group ? true : false
  const hasImg = uri ? true : false

  function changePic() {
    return
    ImagePicker.launchImageLibrary(
      {
        mediaType: 'photo'
      },
      async img => {
        if (!img.didCancel) {
          if (group && group.id && img && img.uri) {
            await createChatPic(group.id, img.uri)
            chats.updateChatPhotoURI(group.id, img.uri)
          }
        }
      }
    )
  }

  const isTribe = group && group.type === constants.chat_types.tribe
  const isTribeAdmin = isTribe && group.owner_pubkey === user.publicKey

  function fuzzyIndexOf(arr, n) {
    let smallestDiff = Infinity
    let index = -1
    arr.forEach((m, i) => {
      const diff = Math.abs(m - n)
      if (diff < smallestDiff) {
        smallestDiff = diff
        index = i
      }
    })
    return index
  }

  const ppms = [0, 3, 5, 10, 20, 50, 100]
  function chooseSatsPerMinute(n) {
    if (!group.id) return
    const price = ppms[n] || 0
    chats.setPricePerMinute(group.id, price)
  }
  function satsPerMinuteChanged(n) {
    setPpm(ppms[n] || 0)
  }
  let sliderValue = fuzzyIndexOf(ppms, ppm)
  if (sliderValue < 0) sliderValue = 2

  const showValueSlider =
    isTribe && !isTribeAdmin && group && group.feed_url ? true : false

  async function exitGroup() {
    setLoading(true)
    await chats.exitGroup(group.id)
    setLoading(false)
    EE.emit(LEFT_GROUP)
  }

  function onExitGroup() {
    setGroupSettingsDialog(false)
    if (!loading) exitGroup()
  }

  function onShareGroup() {
    setGroupSettingsDialog(false)

    setTimeout(() => {
      ui.setShareTribeUUID(group.uuid)
    }, 500)
  }

  return useObserver(() => {
    return (
      <View style={{ ...styles.wrap, backgroundColor: theme.bg }}>
        <BackHeader
          title='Details'
          navigate={() => navigation.goBack()}
          border={true}
          action={<DetailsAction chat={group} />}
        />

        <View style={styles.content}>
          {hasGroup && (
            <View style={styles.groupInfo}>
              <View style={styles.groupInfoLeft}>
                <TouchableOpacity onPress={changePic}>
                  {group && (
                    <Avatar size={50} aliasSize={18} big alias={group.name} photo={uri} />
                  )}
                </TouchableOpacity>
                <View style={styles.groupInfoText}>
                  <Typography size={16} style={{ marginBottom: 4 }}>
                    {group.name}
                  </Typography>
                  <Typography
                    color={theme.title}
                    size={12}
                    style={{ marginBottom: 4 }}
                  >{`Created on ${moment(group.created_at).format('ll')}`}</Typography>
                  <Typography
                    size={12}
                    color={theme.subtitle}
                  >{`Price per message: ${group.price_per_message}, Amount to stake: ${group.escrow_amount}`}</Typography>
                </View>
              </View>
              <IconButton
                icon='dots-vertical'
                size={25}
                color={theme.icon}
                style={{ marginLeft: 0, marginRight: 0, position: 'absolute', right: 8 }}
                onPress={() => setGroupSettingsDialog(true)}
              />
            </View>
          )}

          {/* {showValueSlider && (
            <View style={styles.slideWrap}>
              <View style={styles.slideText}>
                <Text style={{ ...styles.slideLabel, color: theme.subtitle }}>
                  Podcast: sats per minute
                </Text>
                <Text style={{ ...styles.slideValue, color: theme.subtitle }}>{ppm}</Text>
              </View>
              <Slider
                minimumValue={0}
                maximumValue={6}
                value={sliderValue}
                step={1}
                minimumTrackTintColor={theme.primary}
                maximumTrackTintColor={theme.primary}
                thumbTintColor={theme.primary}
                onSlidingComplete={chooseSatsPerMinute}
                onValueChange={satsPerMinuteChanged}
                style={{ width: '90%' }}
              />
            </View>
          )} */}
        </View>
        <GroupSettings
          visible={groupSettingsDialog}
          owner={isTribeAdmin}
          onCancel={() => setGroupSettingsDialog(false)}
          shareGroup={onShareGroup}
          exitGroup={onExitGroup}
        />
      </View>
    )
  })
}

function DetailsAction({ chat }) {
  const { chats } = useStores()
  const theme = useTheme()

  return useObserver(() => {
    const theChat = chats.chats.find(c => c.id === chat.id)
    const isMuted = (theChat && theChat.is_muted) || false

    async function muteChat() {
      chats.muteChat(chat.id, isMuted ? false : true)
    }

    return (
      <>
        {chat && (
          <IconButton
            icon={() => (
              <FeatherIcon
                name={isMuted ? 'bell-off' : 'bell'}
                size={22}
                color={theme.icon}
              />
            )}
            onPress={muteChat}
          />
        )}
      </>
    )
  })
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 40,
    paddingTop: 40
  },
  groupInfo: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%'
  },
  groupInfoLeft: {
    marginLeft: 16,
    display: 'flex',
    flexDirection: 'row'
  },
  groupInfoText: {
    display: 'flex',
    height: 54,
    justifyContent: 'center',
    marginLeft: 14,
    maxWidth: '77%'
  },
  scroller: {
    width: '100%',
    position: 'relative'
  },
  slideWrap: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 62,
    marginTop: 20
  },
  slideText: {
    width: '90%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 15,
    paddingRight: 15,
    marginBottom: 10
  },
  slideLabel: {
    fontSize: 13
  },
  slideValue: {
    fontSize: 15,
    fontWeight: 'bold'
  },
  inputWrap: {
    display: 'flex',
    marginTop: 15
  },
  inputLabel: {
    fontSize: 11
  },
  input: {
    maxHeight: 55,
    minWidth: 240
  }
})
