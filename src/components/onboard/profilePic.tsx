import React, { useState } from 'react'
import { View, StyleSheet, Text, Image } from 'react-native'
import { useObserver } from 'mobx-react-lite'
import { Button, IconButton } from 'react-native-paper'
import ImagePicker from 'react-native-image-picker'
import RNFetchBlob from 'rn-fetch-blob'

import { useStores, useTheme } from '../../store'
import Slider from '../utils/slider'

export default function ProfilePic({ z, show, onDone, onBack }) {
  const { contacts, user, meme } = useStores()
  const [uploading, setUploading] = useState(false)
  const [img, setImg] = useState(null)
  const theme = useTheme()

  async function pickImage() {
    ImagePicker.launchImageLibrary({}, result => {
      if (!result.didCancel) {
        setImg(result)
      }
    })
  }

  async function finish() {
    if (img) {
      setUploading(true)
      const url = await uploadSync(img.uri)
      if (url) {
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
      <Slider z={z} show={show} style={{ backgroundColor: theme.lightGrey }} accessibilityLabel='onboard-profile'>
        <IconButton icon='arrow-left' style={styles.backArrow} color={theme.grey} onPress={onBack} accessibilityLabel='onboard-profile-back' />
        <View style={styles.nicknameWrap} accessibilityLabel='onboard-profile-nickname-wrap'>
          <Text style={styles.nickname}>{user.alias}</Text>
        </View>
        <View style={styles.mid} accessibilityLabel='onboard-profile-middle'>
          {img && <Image source={{ uri: img.uri }} style={{ width: 180, height: 180, borderRadius: 90 }} resizeMode={'cover'} />}
          {!img && <Image source={require('../../../android_assets/avatar3x.png')} style={{ width: 180, height: 180 }} resizeMode={'cover'} />}
          <Button
            mode='contained'
            accessibilityLabel='onboard-profile-choose-image'
            onPress={pickImage}
            style={{ ...styles.selectButton, backgroundColor: theme.lightGrey }}
            contentStyle={{ height: 60 }}
          >
            <Text style={{ color: theme.black }}>Select Image</Text>
          </Button>
        </View>
        <View style={styles.buttonWrap} accessibilityLabel='onboard-profile-button-wrap'>
          <Button
            mode='contained'
            accessibilityLabel='onboard-profile-button'
            loading={uploading}
            onPress={finish}
            contentStyle={{ height: 60 }}
            style={{ ...styles.button, backgroundColor: theme.primary }}
          >
            <Text style={{ color: theme.white }}> {img ? 'Next' : 'Skip'}</Text>
          </Button>
        </View>
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
    borderRadius: 30,
    width: 200,
    marginTop: 20,
    display: 'flex',
    justifyContent: 'center'
  },
  buttonWrap: {
    position: 'absolute',
    bottom: 42,
    width: '100%',
    height: 60,
    display: 'flex',
    flexDirection: 'row-reverse'
  },
  button: {
    width: 150,
    marginRight: '12.5%',
    borderRadius: 30,
    display: 'flex',
    justifyContent: 'center'
  }
})
