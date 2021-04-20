import React, { useState } from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'
import { useObserver } from 'mobx-react-lite'
import RNFetchBlob from 'rn-fetch-blob'
import { useNavigation } from '@react-navigation/native'
import { Portal, Dialog, Title } from 'react-native-paper'
import AntDesignIcon from 'react-native-vector-icons/AntDesign'

import { useStores, useTheme } from '../../store'
import Header from './Header'
import { usePicSrc } from '../utils/picSrc'
import ActionMenu from '../common/ActionMenu'
import ImageDialog from '../common/Dialogs/ImageDialog'
import TabBar from '../common/TabBar'
import Avatar from '../common/Avatar'
import AvatarEdit from '../common/Avatar/AvatarEdit'
import DialogWrap from '../common/Dialogs/DialogWrap'
import Form from '../form'
import { me } from '../form/schemas'

export default function Account() {
  const { user, contacts, meme } = useStores()
  const theme = useTheme()
  const [uploading, setUploading] = useState(false)
  const [uploadPercent, setUploadedPercent] = useState(0)
  const [userDialog, setUserDialog] = useState(false)
  const [imageDialog, setImageDialog] = useState(false)
  const [photo_url, setPhotoUrl] = useState('')
  const [saving, setSaving] = useState(false)
  const navigation = useNavigation()

  async function tookPic(img) {
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
          setPhotoUrl(`https://${server.host}/public/${json.muid}`)
        }
        await contacts.updateContact(1, {
          photo_url
        })
        setUploading(false)
      })
      .catch(err => {
        console.log(err)
        setUploading(false)
      })
  }

  async function saveUser(values) {
    setSaving(true)
    await contacts.updateContact(1, {
      alias: values.alias
    })
    setSaving(false)
    setUserDialog(false)
  }

  const items = [
    [
      {
        title: 'Account',
        icon: 'ChevronRight',
        thumbIcon: 'Settings',
        thumbBgColor: theme.primary,
        action: () => navigation.navigate('Settings')
      },
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
      },
      {
        title: 'Contacts',
        icon: 'ChevronRight',
        thumbIcon: <AntDesignIcon name='contacts' color={theme.white} size={18} />,
        thumbBgColor: theme.primary,
        action: () => navigation.navigate('Contacts')
      },
      {
        title: 'Support',
        icon: 'ChevronRight',
        thumbIcon: 'Mail',
        thumbBgColor: theme.primary,
        action: () => navigation.navigate('Support')
      }
    ]
  ]

  return useObserver(() => {
    const meContact = contacts.contacts.find(c => c.id === 1)
    let imgURI = usePicSrc(meContact)

    if (photo_url) imgURI = photo_url

    return (
      <View style={{ ...styles.wrap, backgroundColor: theme.bg }}>
        <Header onEdit={() => setUserDialog(true)} />
        <ScrollView>
          <View style={{ flex: 1, backgroundColor: theme.bg }}>
            <View style={{ ...styles.userInfoSection, borderBottomColor: theme.border }}>
              <View
                style={{
                  ...styles.userInfoContent
                }}
              >
                <AvatarEdit onPress={() => setImageDialog(true)} uploading={uploading} uploadPercent={uploadPercent}>
                  <Avatar size={100} photo={imgURI} round={50} />
                </AvatarEdit>
                <View style={{ display: 'flex', flexDirection: 'column' }}>
                  <Title style={{ ...styles.title, color: theme.text }}>{user.alias}</Title>
                </View>
              </View>
            </View>

            <ActionMenu items={items} />

            <ImageDialog visible={imageDialog} onCancel={() => setImageDialog(false)} onPick={tookPic} onSnap={tookPic} setImageDialog={setImageDialog} />

            <DialogWrap title='Edit Name' visible={userDialog} onDismiss={() => setUserDialog(false)}>
              <Form
                nopad
                schema={me}
                loading={saving}
                buttonMode='text'
                buttonText='Save'
                initialValues={{
                  alias: user.alias
                }}
                onSubmit={values => saveUser(values)}
                action
                actionType='Dialog'
              />
            </DialogWrap>
          </View>
        </ScrollView>

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
    // paddingTop: 5,
    paddingBottom: 10,
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
  title: {
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10
  },
  spinner: {
    position: 'absolute',
    left: 19,
    top: 19
  }
})
