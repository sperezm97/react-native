import React, { useState } from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'
import { useObserver } from 'mobx-react-lite'
import { useNavigation } from '@react-navigation/native'
import RNFetchBlob from 'rn-fetch-blob'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { IconButton } from 'react-native-paper'

import { useStores, useTheme, hooks } from '../../../store'
import { useTribeHistory } from '../../../store/hooks/tribes'
import BackHeader from '../../common/BackHeader'
import Typography from '../../common/Typography'
import Avatar from '../../common/Avatar'
import Button from '../../common/Button'
import Divider from '../../common/Layout/Divider'
import BoxHeader from '../../common/Layout/BoxHeader'
import Empty from '../../common/Empty'
import TribeSettings from '../../common/Dialogs/TribeSettings'
import DialogWrap from '../../common/Dialogs/DialogWrap'
import ImageDialog from '../../common/Dialogs/ImageDialog'
import AvatarEdit from '../../common/Avatar/AvatarEdit'
import TribeTags from './TribeTags'

const { useTribes } = hooks

export default function Tribe({ route }) {
  const { chats, meme, ui } = useStores()
  const theme = useTheme()
  const navigation = useNavigation()
  const [uploading, setUploading] = useState(false)
  const [uploadPercent, setUploadedPercent] = useState(0)
  const [tribeDialog, setTribeDialog] = useState(false)
  const [imageDialog, setImageDialog] = useState(false)
  const [tribePhoto, setTribePhoto] = useState('')

  const tribe = route.params.tribe

  async function tookPic(img) {
    setUploading(true)
    try {
      await upload(img.uri)
    } catch (e) {
      setUploading(false)
    }
  }

  async function upload(uri) {
    const type = 'image/jpg'
    const name = 'Image.jpg'
    const server = meme.getDefaultServer()
    if (!server) return

    uri = uri.replace('file://', '')

    RNFetchBlob.fetch(
      'POST',
      `https://${server.host}/public`,
      {
        Authorization: `Bearer ${server.token}`,
        'Content-Type': 'multipart/form-data'
      },
      [
        {
          name: 'file',
          filename: name,
          type: type,
          data: RNFetchBlob.wrap(uri)
        },
        { name: 'name', data: name }
      ]
    )
      .uploadProgress({ interval: 250 }, (written, total) => {
        setUploadedPercent(Math.round((written / total) * 100))
      })
      .then(async resp => {
        let json = resp.json()

        if (json.muid) {
          setTribePhoto(`https://${server.host}/public/${json.muid}`)

          await chats.editTribe({
            ...tribe,
            id: tribe.chat.id
          })
        }

        setUploading(false)
      })
      .catch(err => {
        console.log(err)
        setUploading(false)
      })
  }

  function handleEditTribePress() {
    navigation.navigate('EditTribe', { tribe })
  }

  function handleTribeMembersPress() {
    // navigation.navigate('EditTribe', {})
  }

  return useObserver(() => {
    const { createdDate, lastActiveDate } = useTribeHistory(tribe.created, tribe.last_active)

    if (tribePhoto) tribe.img = tribePhoto

    return (
      <View style={{ ...styles.wrap, backgroundColor: theme.bg }}>
        <BackHeader
          // title={tribe.name}
          navigate={() => navigation.goBack()}
          border
          action={tribe.owner && <TribeHeader tribe={tribe} openDialog={() => setTribeDialog(true)} />}
        />
        <ScrollView>
          <View style={styles.content}>
            {/* Start Tribe Header */}
            <View style={{ ...styles.header }}>
              <View style={{ ...styles.avatarWrap }}>
                {tribe.owner ? (
                  <AvatarEdit onPress={() => setImageDialog(true)} uploading={uploading} uploadPercent={uploadPercent}>
                    <Avatar photo={tribe.img} size={80} round={50} />
                  </AvatarEdit>
                ) : (
                  <Avatar photo={tribe.img} size={80} round={50} />
                )}
              </View>

              <View style={styles.headerContent}>
                <Typography size={22} fw='500' style={{ marginBottom: 8 }}>
                  {tribe.name}
                </Typography>
                <View style={{ flexDirection: 'row' }}>
                  <View style={{ ...styles.publicText }}>
                    <MaterialIcon name='public' size={18} color={theme.grey} />
                    <Typography size={14} style={{ marginBottom: 16, paddingLeft: 4 }}>
                      {tribe.private ? 'Private Tribe' : 'Public Tribe'}
                    </Typography>
                  </View>
                  <View style={styles.membersWrap}>
                    <View style={{ ...styles.dot, backgroundColor: theme.text }}></View>
                    <Typography size={14} fw='600' style={{ marginBottom: 16, paddingLeft: 4 }}>
                      {tribe.member_count}
                    </Typography>
                    <Typography size={14}> members</Typography>
                  </View>
                </View>

                <TribeActions tribe={tribe} />
              </View>
            </View>
            {/* End Tribe Header */}

            <Divider mt={30} />

            {/* Start Tribe Content */}
            <View style={{ marginBottom: 18 }}>
              <Typography size={20} fw='500' style={{ marginBottom: 8 }}>
                About
              </Typography>

              <Typography size={14} color={theme.darkGrey} style={{ marginBottom: 26 }}>
                {tribe.description} Tribe is one of the best tribes if you want to know more about how to code and learn about software engineering topics.
              </Typography>

              <View style={{ ...styles.description }}>
                <MaterialIcon name='access-time' size={26} color={theme.grey} />
                <View style={{ ...styles.dContent }}>
                  <Typography size={18} style={{ marginBottom: 6 }}>
                    History
                  </Typography>
                  <Typography size={13} color={theme.darkGrey}>
                    Tribe created on {createdDate}. Last Active on {lastActiveDate}
                  </Typography>
                </View>
              </View>

              <View style={{ ...styles.description }}>
                <FontAwesome5Icon name='coins' size={26} color={theme.yellow} />
                <View style={{ ...styles.dContent }}>
                  <Typography size={18} style={{ marginBottom: 6 }}>
                    Prices
                  </Typography>
                  <Typography size={13} color={theme.darkGrey} style={{ marginBottom: 6 }}>
                    Price per message {tribe?.price_per_message}.
                  </Typography>
                  <Typography size={13} color={theme.darkGrey}>
                    Price to join {tribe?.name} {tribe?.price_to_join}.
                  </Typography>
                </View>
              </View>
            </View>
            <Tags tags={tribe.tags} owner={tribe.owner} tribe={tribe} />
          </View>
          {/* End Tribe Content */}
        </ScrollView>

        {tribe.owner && <TribeSettings visible={tribeDialog} onCancel={() => setTribeDialog(false)} onEditPress={handleEditTribePress} onMembersPress={handleTribeMembersPress} />}
        <ImageDialog visible={imageDialog} onCancel={() => setImageDialog(false)} onPick={tookPic} onSnap={tookPic} setImageDialog={setImageDialog} />
      </View>
    )
  })
}

function TribeHeader({ tribe, openDialog }) {
  const theme = useTheme()

  return <IconButton icon={() => <MaterialCommunityIcon name='dots-horizontal' color={theme.white} size={30} />} onPress={openDialog} />
}

function TribeActions({ tribe }) {
  const { chats, ui } = useStores()
  const theme = useTheme()
  const navigation = useNavigation()

  async function onJoinPress() {
    const host = chats.getDefaultTribeServer().host
    const tribeParams = await chats.getTribeDetails(host, tribe.uuid)
    ui.setJoinTribeParams(tribeParams)
  }

  //   async function onExitTribePress() {}
  async function onChatPress() {}

  return (
    <>
      {!tribe.owner ? (
        <>
          {tribe.joined ? (
            <View style={{ ...styles.tribeActions }}>
              {/* <Button color={theme.primary} onPress={onExitTribePress} w='35%'>
                Joined
              </Button> */}
              <Button icon={() => <MaterialCommunityIcon name='chat-outline' color={theme.white} size={20} />} onPress={onChatPress} w='60%'>
                Play Wall
              </Button>
            </View>
          ) : (
            <Button color={theme.primary} onPress={onJoinPress} w='35%'>
              Join
            </Button>
          )}
        </>
      ) : (
        <Button icon={() => <MaterialCommunityIcon name='chat-outline' color={theme.white} size={20} />} onPress={onChatPress} w='60%'>
          Play Wall
        </Button>
      )}
    </>
  )
}

function Tags(props) {
  const { chats } = useStores()
  const { tags, owner, tribe } = props
  const [topicsEdit, setTopicsEdit] = useState(false)

  async function finish(tags) {
    tribe.tags = tags
    await chats.editTribe({
      ...tribe,
      id: tribe.chat.id
    })

    setTopicsEdit(false)
  }

  return (
    <>
      {!owner ? (
        <>{tags.length > 0 && <TribeTags tags={tags} displayOnly={true} containerStyle={{ paddingTop: 18 }} />}</>
      ) : (
        <>
          <BoxHeader title='Topics in this Tribe'>
            <Button mode='text' onPress={() => setTopicsEdit(true)} size='small'>
              Edit
            </Button>
          </BoxHeader>
          <>{tags.length > 0 ? <TribeTags tags={tags} displayOnly={true} containerStyle={{ paddingTop: 18 }} /> : <Empty text='No topics found.' />}</>
        </>
      )}

      <DialogWrap title='Edit Tags' visible={topicsEdit} onDismiss={() => setTopicsEdit(false)}>
        <TribeTags tags={tags} finish={finish} />
      </DialogWrap>
    </>
  )
}

// function Tag({ tag }) {
//   return <LabelBadge>{tag}</LabelBadge>
// }

const styles = StyleSheet.create({
  wrap: {
    flex: 1
  },
  content: {
    flex: 1,
    paddingTop: 25,
    paddingRight: 14,
    paddingLeft: 14
  },
  header: {
    display: 'flex',
    flexDirection: 'row'
    // alignItems: 'center'
  },
  headerContent: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    flex: 1
  },
  avatarWrap: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 80,
    marginRight: 24
  },
  publicText: {
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center'
  },
  membersWrap: {
    display: 'flex',
    flexDirection: 'row',
    paddingLeft: 18,
    position: 'relative'
  },
  dot: {
    width: 2,
    height: 2,
    position: 'absolute',
    top: '25%',
    left: 10
  },
  description: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20
  },
  dContent: {
    display: 'flex',
    flexDirection: 'column',
    width: '80%',
    paddingLeft: 14
  },
  badgeContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    width: '100%'
  },
  tribeActions: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1
  }
})
