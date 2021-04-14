import React, { useState } from 'react'
import { useObserver } from 'mobx-react-lite'
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native'
import RNFetchBlob from 'rn-fetch-blob'
import { useNavigation } from '@react-navigation/native'
import { Portal, Dialog, Title } from 'react-native-paper'
import AntDesign from 'react-native-vector-icons/AntDesign'

import { useStores, useTheme } from '../../store'
import Header from './Header'
import { usePicSrc } from '../utils/picSrc'
import ActionMenu from '../common/ActionMenu'
import ImageDialog from '../common/Dialogs/ImageDialog'
import TabBar from '../common/TabBar'
import Icon from '../common/Icon'
import Avatar from '../common/Avatar'
import Form from '../form'
import { me } from '../form/schemas'

export default function Account() {
  const { user, contacts, meme } = useStores()
  const theme = useTheme()
  const [uploading, setUploading] = useState(false)
  const [userDialog, setUserDialog] = React.useState(false)
  const [imageDialog, setImageDialog] = useState(false)
  const [photo_url, setPhotoUrl] = useState('')
  const [saving, setSaving] = useState(false)
  const [uploadPercent, setUploadedPercent] = useState(0)
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

        console.log('json:', json)

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
        thumbIcon: <AntDesign name='contacts' color={theme.white} size={18} />,
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
        <View style={{ flex: 1, backgroundColor: theme.bg }}>
          <ScrollView>
            <View style={{ ...styles.userInfoSection, borderBottomColor: theme.border }}>
              <View
                style={{
                  ...styles.userInfoContent
                }}
              >
                <TouchableOpacity onPress={() => setImageDialog(true)} style={styles.imgWrap}>
                  <Avatar size={100} uri={imgURI && { uri: imgURI }} borderless={false} />
                  {uploading && <Text style={{ ...styles.uploadPercent, color: theme.primary }}>{`${uploadPercent}%`}</Text>}
                  <View style={styles.imgIcon}>
                    <Icon name='PlusCircle' fill={theme.primary} color={theme.white} />
                  </View>
                </TouchableOpacity>

                <View style={{ display: 'flex', flexDirection: 'column' }}>
                  <Title style={{ ...styles.title, color: theme.text }}>{user.alias}</Title>
                </View>
              </View>
            </View>

            <ActionMenu items={items} />

            <ImageDialog visible={imageDialog} onCancel={() => setImageDialog(false)} onPick={tookPic} onSnap={tookPic} setImageDialog={setImageDialog} />

            <Portal>
              <Dialog visible={userDialog} onDismiss={() => setUserDialog(false)} style={{ backgroundColor: theme.bg }}>
                <Dialog.Title style={{ color: theme.primary, marginBottom: 30, fontWeight: '400' }}>Edit Name</Dialog.Title>
                <Dialog.Content>
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
                </Dialog.Content>
              </Dialog>
            </Portal>
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
  imgWrap: {
    position: 'relative'
  },
  uploadPercent: {
    position: 'absolute',
    top: '45%',
    height: '100%',
    width: '100%',
    textAlign: 'center',
    fontWeight: '500'
  },
  imgIcon: {
    position: 'absolute',
    right: -5,
    top: '50%'
  },
  title: {
    fontWeight: '600',
    marginTop: 10
  },
  spinner: {
    position: 'absolute',
    left: 19,
    top: 19
  }
})
