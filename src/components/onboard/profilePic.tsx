import React, { useState } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { useObserver } from 'mobx-react-lite'
import { IconButton } from 'react-native-paper'
import RNFetchBlob from 'rn-fetch-blob'

import { useStores, useTheme } from '../../store'
import Slider from '../utils/slider'
import Button from '../common/Button'
import ImageDialog from '../common/Dialogs/ImageDialog'
import Avatar from '../common/Avatar'

export default function ProfilePic({ z, show, onDone, onBack }) {
  const { contacts, user, meme } = useStores()
  const [uploading, setUploading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [img, setImg] = useState(null)
  const theme = useTheme()

  async function pickImage(img) {
    setImg(img)
  }

  async function finish() {
    if (img) {
      setUploading(true)
      const url = await uploadSync(img.uri)

      if (url) {
        console.log('is url', url)

        await contacts.updateContact(1, {
          photo_url: url
        })
      }
      setUploading(false)
    }
    onDone()
  }

  async function uploadSync(uri) {
    return new Promise((resolve, reject) => {
      const type = 'image/jpg'
      const name = 'Image.jpg'
      const server = meme.getDefaultServer()
      if (!server) {
        resolve('')
        return
      }

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
          console.log('uploaded', written / total)
        })
        .then(async resp => {
          let json = resp.json()
          if (json.muid) {
            resolve(`https://${server.host}/public/${json.muid}`)
          }
          setUploading(false)
          return
        })
        .catch(err => {
          console.log(err)
          setUploading(false)
          resolve('')
          return
        })
    })
  }

  return useObserver(() => {
    return (
      <Slider
        z={z}
        show={show}
        style={{ backgroundColor: theme.bg }}
        accessibilityLabel='onboard-profile'
      >
        <IconButton
          icon='arrow-left'
          style={styles.backArrow}
          color={theme.grey}
          onPress={onBack}
          accessibilityLabel='onboard-profile-back'
        />
        <View
          style={styles.nicknameWrap}
          accessibilityLabel='onboard-profile-nickname-wrap'
        >
          <Text style={{ ...styles.nickname, color: theme.text }}>{user.alias}</Text>
        </View>
        <View style={styles.mid} accessibilityLabel='onboard-profile-middle'>
          <Avatar size={200} photo={img && img.uri} round={100} />
          <Button
            accessibilityLabel='onboard-profile-choose-image'
            onPress={() => setDialogOpen(true)}
            style={{ ...styles.selectButton }}
            color={theme.lightGrey}
            w={200}
          >
            <Text style={{ color: theme.black }}>Select Image</Text>
          </Button>
        </View>
        <View style={styles.buttonWrap} accessibilityLabel='onboard-profile-button-wrap'>
          <Button
            accessibilityLabel='onboard-profile-button'
            loading={uploading}
            onPress={finish}
            style={{ ...styles.button }}
            size='large'
            w={150}
          >
            <Text style={{ color: theme.white }}> {img ? 'Next' : 'Skip'}</Text>
          </Button>
        </View>

        <ImageDialog
          visible={dialogOpen}
          onCancel={() => setDialogOpen(false)}
          onPick={pickImage}
          onSnap={pickImage}
          setImageDialog={setDialogOpen}
        />
      </Slider>
    )
  })
}

const styles = StyleSheet.create({
  backArrow: {
    position: 'absolute',
    left: 15,
    top: 35
  },
  nicknameWrap: {
    position: 'absolute',
    top: 12
  },
  nickname: {
    fontSize: 32,
    marginTop: 60,
    textAlign: 'center',
    marginLeft: 50,
    marginRight: 50
  },
  mid: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  selectButton: {
    marginTop: 20
  },
  buttonWrap: {
    position: 'absolute',
    bottom: 42,
    width: '100%',
    display: 'flex',
    flexDirection: 'row-reverse'
  },
  button: {
    marginRight: '12.5%'
  }
})
