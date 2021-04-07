import React, { useState } from 'react'
import { useObserver } from 'mobx-react-lite'
import { View, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native'
import { Portal, Title } from 'react-native-paper'

import RNFetchBlob from 'rn-fetch-blob'
import { useNavigation, useFocusEffect } from '@react-navigation/native'

import { useStores, useTheme } from '../../store'
import Header from './Header'
import Cam from '../utils/cam'
import ImgSrcDialog from '../utils/imgSrcDialog'
import { usePicSrc } from '../utils/picSrc'
import ActionMenu from '../common/ActionMenu'
import TabBar from '../common/TabBar'
import Icon from '../common/Icon'

export default function Account() {
  const { user, contacts, meme } = useStores()
  const theme = useTheme()
  const [uploading, setUploading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [takingPhoto, setTakingPhoto] = useState(false)
  const [photo_url, setPhotoUrl] = useState('')
  const [avatar, setAvatar] = useState({
    newImage: require('../../assets/avatars/balvin.png'),
    randomImages: [
      {
        image: require('../../assets/avatars/balvin.png')
      },
      {
        image: require('../../assets/avatars/bieber.png')
      },
      {
        image: require('../../assets/avatars/blu.png')
      },
      {
        image: require('../../assets/avatars/cardi.png')
      },
      {
        image: require('../../assets/avatars/cardi2.png')
      },
      {
        image: require('../../assets/avatars/guy.png')
      },
      {
        image: require('../../assets/avatars/kittle.png')
      }
    ]
  })
  const navigation = useNavigation()

  useFocusEffect(
    React.useCallback(() => {
      setAvatar({ ...avatar, newImage: avatar.randomImages[Math.floor(Math.random() * 3)].image })
    }, [])
  )

  async function tookPic(img) {
    setDialogOpen(false)
    setTakingPhoto(false)
    setUploading(true)
    try {
      await upload(img.uri)
    } catch (e) {
      console.log(e)
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
      `http://${server.host}/public`,
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
        console.log('uploaded', written / total)
      })
      .then(async resp => {
        let json = resp.json()

        console.log('json:', json)

        if (json.muid) {
          setPhotoUrl(`http://${server.host}/public/${json.muid}`)
        }
        setUploading(false)
      })
      .catch(err => {
        console.log(err)
        setUploading(false)
      })
  }

  const items = [
    [
      {
        title: 'Network',
        icon: 'ChevronRight',
        thumbIcon: 'Network',
        thumbBgColor: theme.primary,
        action: () => navigation.navigate('Network')
      },
      {
        title: 'Security & Backup',
        icon: 'ChevronRight',
        thumbIcon: 'Lock',
        thumbBgColor: theme.primary,
        action: () => navigation.navigate('Security')
      },
      {
        title: 'Appearance',
        icon: 'ChevronRight',
        thumbIcon: 'Moon',
        thumbBgColor: theme.primary,
        action: () => navigation.navigate('Appearance')
      }
    ]
  ]

  return useObserver(() => {
    const meContact = contacts.contacts.find(c => c.id === 1)
    let imgURI = usePicSrc(meContact)

    if (photo_url) imgURI = photo_url

    return (
      <View style={{ ...styles.wrap, backgroundColor: theme.bg }}>
        <Header />
        <View style={{ flex: 1, backgroundColor: theme.bg }}>
          <ScrollView>
            <View style={{ ...styles.userInfoSection, borderBottomColor: theme.border }}>
              <View
                style={{
                  ...styles.userInfoContent
                }}
              >
                <TouchableOpacity onPress={() => setDialogOpen(true)} style={styles.imgWrap}>
                  <Image resizeMode='cover' source={imgURI ? { uri: imgURI } : avatar.newImage} style={{ ...styles.userImg, borderColor: theme.border }} />
                  <View style={styles.imgIcon}>
                    <Icon name='PlusCircle' color={theme.primary} />
                  </View>
                </TouchableOpacity>

                <View style={{ display: 'flex', flexDirection: 'column' }}>
                  <Title style={{ ...styles.title, color: theme.title }}>{user.alias}</Title>
                </View>
              </View>
            </View>

            <ActionMenu items={items} />

            <ImgSrcDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onPick={res => tookPic(res)} onChooseCam={() => setTakingPhoto(true)} />

            {takingPhoto && (
              <Portal>
                <Cam onCancel={() => setTakingPhoto(false)} onSnap={pic => tookPic(pic)} />
              </Portal>
            )}
          </ScrollView>
        </View>

        <TabBar />
      </View>
    )
  })
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1
  },
  userInfoSection: {
    paddingTop: 25,
    paddingBottom: 25,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  userInfoContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  imgWrap: {
    position: 'relative'
  },
  imgIcon: {
    position: 'absolute',
    right: -5,
    top: '50%'
  },
  userImg: {
    width: 90,
    height: 90,
    borderRadius: 50,
    borderWidth: 1
  },
  title: {
    fontWeight: '600',
    marginTop: 20
  },
  spinner: {
    position: 'absolute',
    left: 19,
    top: 19
  }
})
