import React, { useEffect, useState, useRef } from 'react'
import { StyleSheet, View, AppState } from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FastImage from 'react-native-fast-image'
import TrackPlayer, { TrackPlayerEvents } from 'react-native-track-player'
import { useTrackPlayerEvents } from 'react-native-track-player/lib/hooks'
import { Modalize } from 'react-native-modalize'
import { isIphoneX, getStatusBarHeight } from 'react-native-iphone-x-helper'
import Toast from 'react-native-simple-toast'

import { useStores, useTheme } from 'store'
import { Destination, StreamPayment, NUM_SECONDS, StreamPaymentModel } from 'store/feed-store'
import { SCREEN_WIDTH } from '../../constants'
import useInterval from '../utils/useInterval'
import EE, { CLIP_PAYMENT, PLAY_ANIMATION } from '../utils/ee'
import Controls from './Controls'
import { getPosition, setPosition } from './Position'
import MiniPodcast from './MiniPodcast'
import Typography from '../common/Typography'
import Button from '../common/Button'
import BoostButton from '../common/Button/BoostButton'
import BoostControls from '../common/Button/BoostControls'

export default function Podcast({ pod, chat, onBoost, podError }) {
  const theme = useTheme()
  const { feed, user, msg, chats, details, ui } = useStores()
  const chatID = chat.id
  const myid = user.myid
  const [playing, setPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [selectedEpisodeID, setSelectedEpisodeID] = useState(null)
  const [queuedTrackID, setQueuedTrackID] = useState(null)
  const [speed, setSpeed] = useState('1')
  const modalizeRef = useRef<Modalize>(null)

  function getAndSetDuration() {
    setTimeout(async () => {
      const dur = await TrackPlayer.getDuration()
      setDuration(dur)
    }, 850)
  }

  async function onToggle() {
    // const trackID = await TrackPlayer.getCurrentTrack()
    // if(episode && trackID && trackID!==episode.id) {
    //   console.log("RESET HERE")
    //   TrackPlayer.reset()
    // }
    if (playing) TrackPlayer.pause()
    else {
      await TrackPlayer.play()
      if (!duration) getAndSetDuration()
    }
    setPlaying(!playing)
  }

  async function addEpisodeToQueue(episode) {
    await TrackPlayer.add({
      id: episode.id,
      url: episode.enclosureUrl,
      title: episode.title,
      artist: episode.author || 'author',
      artwork: episode.image,
    })

    await TrackPlayer.updateMetadataForTrack(`${episode.id}`, {
      title: episode.title,
      artist: episode.author || 'author',
      artwork: episode.image,
    })
  }

  async function selectEpisode(episode) {
    TrackPlayer.reset()
    setDuration(0)
    setSelectedEpisodeID(episode.id)
    await addEpisodeToQueue(episode)
    await TrackPlayer.play()
    setPlaying(true)
    getAndSetDuration()
  }

  function setRate(r: string) {
    TrackPlayer.setRate(parseFloat(r))
    setSpeed(r)
  }

  function setDefaultRate() {
    TrackPlayer.setRate(1)
  }

  useTrackPlayerEvents([TrackPlayerEvents.PLAYBACK_STATE], async (event) => {
    // console.log("EVENT === ", event)
    if (event.state === TrackPlayer.STATE_STOPPED) {
      // console.log("STOPPING")
      TrackPlayer.pause()
      setPlaying(false)
      await TrackPlayer.seekTo(0)
      setPosition()
    }
  })

  async function initialSelect(ps) {
    console.tron.display({
      name: 'podcast initialSelect',
      preview: 'what we got',
      value: ps,
      important: true,
    })
    let theID = queuedTrackID
    if (chat.meta?.itemID) {
      theID = chat.meta.itemID
    }
    let episode = ps?.episodes && ps.episodes.length && ps.episodes[0]
    await TrackPlayer.setupPlayer({})
    await TrackPlayer.updateOptions({
      stopWithApp: true,
      capabilities: [
        TrackPlayer.CAPABILITY_PLAY,
        TrackPlayer.CAPABILITY_PAUSE,
        TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
        TrackPlayer.CAPABILITY_STOP,
        TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
        TrackPlayer.CAPABILITY_STOP,
      ],
      compactCapabilities: [TrackPlayer.CAPABILITY_PLAY, TrackPlayer.CAPABILITY_PAUSE],
    })

    if (theID) {
      const qe = ps?.episodes && ps.episodes.length && ps.episodes.find((e) => e.id == theID)
      if (qe) episode = qe
      else {
        TrackPlayer.reset()
      }
    }
    if (!episode) return

    setSelectedEpisodeID(episode.id)
    await addEpisodeToQueue(episode)
    if (!duration) getAndSetDuration()

    // if its the same, dont seek
    if (queuedTrackID && queuedTrackID !== episode.id) {
      const ts = chat.meta?.ts
      if ((!playing && ts) || ts === 0) {
        await TrackPlayer.seekTo(ts)
        setPosition()
      }
    }

    const spm = chat.meta?.sats_per_minute
    if (spm || spm === 0) {
      chats.setPricePerMinute(chatID, spm)
    }

    const spee = chat.meta?.speed
    if (spee) {
      setRate(spee)
    } else {
      setDefaultRate()
    }
  }

  async function checkState() {
    const state = await TrackPlayer.getState()
    // console.log(state)
    if (state === TrackPlayer.STATE_PAUSED || state === TrackPlayer.STATE_STOPPED) {
      setPlaying(false)
    }
    if (state === TrackPlayer.STATE_PLAYING) {
      setPlaying(true)
      const trackID = await TrackPlayer.getCurrentTrack()
      if (trackID) {
        setQueuedTrackID(trackID)
      }
    }
  }

  let pricePerMinute = 0
  try {
    if (!chats.pricesPerMinute[chatID]) {
      console.tron.display({
        name: 'podcast',
        preview: "Couldn't get pricesPerMinute for chatID",
        important: true,
      })
    } else if (chats.pricesPerMinute[chatID] || chats.pricesPerMinute[chatID] === 0) {
      pricePerMinute = chats.pricesPerMinute[chatID]
    } else if (pod?.value && pod.value.model && pod.value.model.suggested) {
      pricePerMinute = Math.round(parseFloat(pod.value.model.suggested) * 100000000)
    }
  } catch (e) {
    console.tron.error('couldnt fetch pricesPerMinute', e)
  }

  async function sendPayments(mult: number) {
    if (!pricePerMinute) return
    console.log('=> sendPayments!')
    const pos = await TrackPlayer.getPosition()
    const dests = pod?.value && pod.value.destinations
    if (!dests) return
    if (!pod.id || !selectedEpisodeID) return
    const sp: StreamPayment = StreamPaymentModel.create({
      feedID: pod.id,
      itemID: selectedEpisodeID,
      ts: Math.round(pos) || 0,
      speed: speed,
    })
    const memo = JSON.stringify(sp)
    feed.sendPayments({
      destinations: dests,
      text: memo,
      amount: pricePerMinute * mult || 1,
      chat_id: chatID,
      update_meta: true,
    })
  }

  const count = useRef(0)
  const storedTime = useRef(0)
  useInterval(() => {
    if (playing) {
      setPosition()
      const c = count.current
      if (c && c % NUM_SECONDS === 0) {
        sendPayments(1)
      }
      count.current += 1
    }
  }, 1000)

  const appState = useRef(AppState.currentState)
  function handleAppStateChange(nextAppState) {
    if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
      const now = Math.round(Date.now().valueOf() / 1000)
      const gap = now - storedTime.current
      if (gap > 0) {
        const n = Math.floor(gap / NUM_SECONDS)
        if (n) sendPayments(n)
      }
    }
    if (appState.current.match(/active/) && nextAppState === 'background') {
      storedTime.current = Math.round(Date.now().valueOf() / 1000)
    }
    appState.current = nextAppState
  }

  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange)
    return () => {
      AppState.removeEventListener('change', handleAppStateChange)
    }
  }, [])

  useEffect(() => {
    checkState()
  }, [])

  useEffect(() => {
    if (pod) initialSelect(pod)
  }, [pod])

  function onClipPayment(d) {
    if (pricePerMinute && d.pubkey && d.ts) {
      const dests = pod?.value && pod.value.destinations
      if (!dests) return
      const extraDest: Destination = {
        address: d.pubkey,
        split: 1,
        type: 'node',
      }
      const finalDests = dests.concat(extraDest)
      const sp: StreamPayment = StreamPaymentModel.create({
        feedID: pod.id,
        itemID: selectedEpisodeID,
        ts: d.ts || 0,
      })
      if (d.uuid) sp.uuid = d.uuid
      const memo = JSON.stringify(sp)
      feed.sendPayments({
        destinations: finalDests,
        text: memo,
        amount: pricePerMinute,
        chat_id: chatID,
        update_meta: false,
      })
    }
  }

  useEffect(() => {
    EE.on(CLIP_PAYMENT, onClipPayment)
    return () => {
      EE.removeListener(CLIP_PAYMENT, onClipPayment)
    }
  }, [pod])

  const episode =
    selectedEpisodeID &&
    pod &&
    pod.episodes &&
    pod.episodes.length &&
    pod.episodes.find((e) => e.id === selectedEpisodeID)

  const replayMsgs = useRef([])

  function closeFull() {
    replayMsgs.current = []
    modalizeRef.current.close()
  }

  function onClose() {
    replayMsgs.current = []
  }

  function openFull() {
    if (!chatID) return
    const msgs = msg.messages[chatID] || []
    const msgsForEpisode = msgs.filter(
      (m) => m.message_content?.includes('::') && m.message_content.includes(episode.id)
    )
    const msgsforReplay = []
    msgsForEpisode.forEach((m) => {
      const arr = m.message_content.split('::')
      if (arr.length < 2) return
      try {
        const dat = JSON.parse(arr[1])
        if (dat)
          msgsforReplay.push({
            ...dat,
            type: arr[0],
            alias: m.sender_alias || (m.sender === myid ? user.alias : ''),
            date: m.date,
          })
      } catch (e) {}
    })
    replayMsgs.current = msgsforReplay
    modalizeRef.current?.open()
  }

  function boost(amount) {
    amount = amount || user.tipAmount || 100

    if (amount > details.balance) {
      Toast.showWithGravity('Not Enough Balance', Toast.SHORT, Toast.CENTER)
      return
    }

    EE.emit(PLAY_ANIMATION)
    requestAnimationFrame(async () => {
      const pos = getPosition()
      const sp: StreamPayment = StreamPaymentModel.create({
        feedID: pod.id,
        itemID: selectedEpisodeID,
        ts: Math.round(pos) || 0,
        amount,
      })
      onBoost(sp)
      const dests = pod?.value && pod.value.destinations
      if (!dests) return
      if (!pod.id || !selectedEpisodeID) return
      const memo = JSON.stringify(sp)
      feed.sendPayments({
        destinations: dests,
        text: memo,
        amount,
        chat_id: chatID,
        update_meta: false,
      })
    })

    ui.setPodcastBoostAmount(null)
  }

  function Footer() {
    return (
      <View
        style={{
          ...styles.footer,
          backgroundColor: theme.main,
          borderTopColor: theme.border,
        }}
      >
        <BoostButton
          onPress={() => {
            const isBoostAmount = ui.podcastBoostAmount && ui.podcastBoostAmount
            const amount = isBoostAmount || user.tipAmount || 100
            boost(amount)
          }}
        />
        <View style={{ width: 130, marginHorizontal: 10 }}>
          <BoostControls />
        </View>
      </View>
    )
  }

  function Header() {
    return (
      <View style={{ alignItems: 'center', backgroundColor: theme.bg }}>
        {pod.image && (
          <View
            style={{
              ...styles.imgWrap,
              width: SCREEN_WIDTH,
              height: SCREEN_WIDTH - 140,
            }}
          >
            <FastImage
              source={{ uri: episode.image || pod.image }}
              style={{
                width: SCREEN_WIDTH - 180,
                height: SCREEN_WIDTH - 180,
                borderRadius: 25,
              }}
              resizeMode={'cover'}
            />
            {/* <Replay msgs={replayMsgs.current} playing={playing} /> */}
          </View>
        )}
        <View style={styles.top}>
          {episode.title && (
            <Typography size={18} numberOfLines={1}>
              {episode.title}
            </Typography>
          )}
        </View>
        <View style={styles.track}>
          <Controls
            theme={theme}
            onToggle={onToggle}
            playing={playing}
            duration={duration}
            episode={episode}
            pod={pod}
            myPubkey={user.publicKey}
            boost={boost}
            speed={speed}
            setRate={setRate}
            quoteCallback={closeFull}
          />
        </View>

        {!!pod.episodes && (
          <View style={styles.list}>
            <View
              style={{
                ...styles.episodesLabel,
                borderBottomColor: theme.border,
              }}
            >
              <Typography color={theme.subtitle} size={12} fw='500'>
                EPISODES
              </Typography>
              <Typography
                color={theme.subtitle}
                size={12}
                style={{
                  opacity: 0.85,
                  marginLeft: 10,
                }}
              >
                {pod.episodes.length}
              </Typography>
            </View>
          </View>
        )}
      </View>
    )
  }

  function renderItem({ item, index }) {
    const selected = selectedEpisodeID === item.id
    const fallbackImage = pod?.image

    return (
      <View key={index}>
        <Button
          color={theme.transparent}
          mode='text'
          h={60}
          round={0}
          style={{
            ...styles.episode,
            borderBottomColor: theme.border,
            backgroundColor: selected ? theme.main : theme.bg,
          }}
          onPress={() => selectEpisode(item)}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                width: 20,
              }}
            >
              <MaterialCommunityIcons
                name='play'
                color={theme.icon}
                size={18}
                style={{ opacity: selected ? 1 : 0 }}
              />
            </View>

            <View style={{ width: 45 }}>
              <FastImage
                source={{ uri: item.image || fallbackImage }}
                style={{
                  width: 42,
                  height: 42,
                  marginLeft: 8,
                  marginRight: 12,
                }}
                resizeMode={'cover'}
              />
            </View>
            <Typography
              color={theme.title}
              numberOfLines={1}
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                paddingLeft: 15,
                flex: 1,
                flexWrap: 'wrap',
              }}
            >
              {item.title}
            </Typography>
          </View>
        </Button>
      </View>
    )
  }

  return (
    <>
      <Modalize
        ref={modalizeRef}
        // adjustToContentHeight={true}
        modalTopOffset={getStatusBarHeight()}
        openAnimationConfig={{
          timing: { duration: 300 },
        }}
        onClose={onClose}
        HeaderComponent={<Header />}
        FooterComponent={<Footer />}
        childrenStyle={{
          backgroundColor: theme.bg,
        }}
        rootStyle={
          {
            //   backgroundColor: theme.bg
          }
        }
        flatListProps={{
          data: pod?.episodes,
          renderItem: renderItem,
          keyExtractor: (item) => item.id,
          showsVerticalScrollIndicator: false,
        }}
      />

      {!episode ? (
        <MiniPodcast
          episode={episode}
          onToggle={onToggle}
          playing={playing}
          onShowFull={openFull}
          boost={() => {
            const amount = user.tipAmount || 100

            boost(amount)
          }}
          duration={duration}
          loading={true}
          podError={podError}
          pod={pod}
        />
      ) : (
        <MiniPodcast
          episode={episode}
          onToggle={onToggle}
          playing={playing}
          onShowFull={openFull}
          boost={() => {
            const amount = user.tipAmount || 100

            boost(amount)
          }}
          duration={duration}
          loading={false}
          podError={''}
          pod={pod}
        />
      )}
    </>
  )
}

const styles = StyleSheet.create({
  content: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  list: {
    width: '100%',
  },
  top: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
    // paddingHorizontal:14
  },
  imgWrap: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  spinWrap: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    position: 'absolute',
    top: 20,
  },
  track: {
    width: '90%',
    // height: 128
  },
  clickList: {
    position: 'absolute',
    top: 6,
    right: 6,
    zIndex: 150,
  },
  episode: {
    borderBottomWidth: 1,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  episodeInner: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  episodesLabel: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderBottomWidth: 2,
    paddingHorizontal: 14,
    paddingBottom: 14,
  },
  footer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    height: isIphoneX() ? 80 : 65,
    paddingBottom: isIphoneX() ? 10 : 0,
    borderTopWidth: 1,
    // paddingTop: isIphoneX() ? 30 : 0
  },
})
