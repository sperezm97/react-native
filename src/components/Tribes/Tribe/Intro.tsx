import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { useObserver } from 'mobx-react-lite'
import { useNavigation } from '@react-navigation/native'
import RNFetchBlob from 'rn-fetch-blob'

import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'

import { useStores, useTheme } from '../../../store'
import Typography from '../../common/Typography'
import Avatar from '../../common/Avatar'
import Button from '../../common/Button'
import ImageDialog from '../../common/Dialogs/ImageDialog'
import AvatarEdit from '../../common/Avatar/AvatarEdit'

export default function Intro({ tribe }) {
  const { chats, meme } = useStores()
  const theme = useTheme()
  const [uploading, setUploading] = useState(false)
  const [uploadPercent, setUploadedPercent] = useState(0)
  const [imageDialog, setImageDialog] = useState(false)
  const [tribePhoto, setTribePhoto] = useState('')

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

  return useObserver(() => {
    if (tribePhoto) tribe.img = tribePhoto

    return (
      <View style={{ ...styles.wrap, backgroundColor: theme.bg }}>
        <View style={{ ...styles.header }}>
          <View style={{ ...styles.avatarWrap }}>
            {tribe.owner ? (
              <AvatarEdit
                onPress={() => setImageDialog(true)}
                uploading={uploading}
                uploadPercent={uploadPercent}
              >
                <Avatar photo={tribe.img} size={80} round={50} />
              </AvatarEdit>
            ) : (
              <Avatar photo={tribe.img} size={80} round={50} />
            )}
          </View>

          <View style={styles.headerContent}>
            <View style={{ ...styles.nameWrap }}>
              <Typography size={22} fw='600'>
                {tribe.name}
              </Typography>
              <View
                style={{
                  position: 'relative'
                }}
              >
                {/* <View style={{ ...styles.dot, backgroundColor: theme.text }}></View> */}
              </View>
              {/* 
              <Typography
                size={14}
                fw='500'
                color={theme.subtitle}
                style={{ paddingLeft: 10 }}
              >
                by {tribe.owner_alias}
              </Typography> */}
            </View>

            <View style={{ flexDirection: 'row' }}>
              <View style={{ ...styles.publicText }}>
                <MaterialIcon name='public' size={18} color={theme.grey} />
                <Typography size={14} style={{ marginBottom: 16, paddingLeft: 4 }}>
                  {tribe.private ? 'Private Tribe' : 'Public Tribe'}
                </Typography>
              </View>
              <View style={styles.membersWrap}>
                <View style={{ ...styles.dot, backgroundColor: theme.text }}></View>
                <Typography
                  size={14}
                  fw='600'
                  style={{ marginBottom: 16, paddingLeft: 4 }}
                >
                  {tribe.member_count}
                </Typography>
                <Typography size={14}> members</Typography>
              </View>
            </View>

            <TribeActions tribe={tribe} />
          </View>
        </View>
        <ImageDialog
          visible={imageDialog}
          onCancel={() => setImageDialog(false)}
          onPick={tookPic}
          onSnap={tookPic}
          setImageDialog={setImageDialog}
        />
      </View>
    )
  })
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
  async function onChatPress() {
    navigation.navigate('Chat', { ...tribe.chat })
  }

  return (
    <>
      {!tribe.owner ? (
        <>
          {tribe.joined ? (
            <View style={{ ...styles.headerActions }}>
              {/* <Button color={theme.primary} onPress={onExitTribePress} w='35%'>
                Joined
              </Button> */}
              <Button
                icon={() => (
                  <MaterialCommunityIcon
                    name='chat-outline'
                    color={theme.white}
                    size={20}
                  />
                )}
                onPress={onChatPress}
                w='60%'
              >
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
        <Button
          icon={() => (
            <MaterialCommunityIcon name='chat-outline' color={theme.white} size={20} />
          )}
          onPress={onChatPress}
          w='60%'
        >
          Play Wall
        </Button>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
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
    flex: 1,
    marginLeft: 34
  },
  avatarWrap: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 80
  },
  nameWrap: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
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
  headerActions: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1
  }
})
