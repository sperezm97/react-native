import React, { useEffect, useState } from 'react'
import { StyleSheet, View, ScrollView, Modal, Animated, Dimensions } from 'react-native'
import { useObserver } from 'mobx-react-lite'
import RNFetchBlob from 'rn-fetch-blob'

import { useStores, useTheme } from '../../../../store'
import { SCREEN_WIDTH } from '../../../../constants'
import ModalHeader from '../ModalHeader'
import Form from '../../../form'
import { tribe } from '../../../form/schemas'
import AddMembers from '../../../Tribes/Members/AddMembers'
import Typography from '../../Typography'
import Avatar from '../../Avatar'
import Button from '../../Button'
import ImageDialog from '../../Dialogs/ImageDialog'
import AvatarEdit from '../../Avatar/AvatarEdit'

export default function AddTribe() {
  const { ui, chats } = useStores()
  const [loading, setLoading] = useState(false)
  const [next, setNext] = useState(1)
  const [form, setForm] = useState(null)
  const [photo, setPhoto] = useState(null)
  const theme = useTheme()
  const appearAnim = new Animated.Value(SCREEN_WIDTH)

  useEffect(() => {
    Animated.timing(appearAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true
    }).start()
  })

  async function finishForm(v) {
    // setLoading(true)
    setNext(2)
    setForm(v)
    // setLoading(false)
  }

  function finishPhoto(v) {
    setPhoto(v)
    console.log('vv:::', v)
  }

  async function finish(values) {
    const contact_ids = values
    setLoading(true)

    const newTribe = {
      ...form,
      contact_ids
    }

    await chats.createTribe(newTribe)
    setLoading(false)
    close()
  }

  function close() {
    ui.setNewTribeModal(false)
    setNext(1)
  }

  function getTitle() {
    if (next === 1) {
      return 'Add Community'
    } else if (next === 2) {
      return 'Add Photo'
    }
  }

  return useObserver(() => (
    <Modal
      visible={ui.newTribeModal}
      animationType='slide'
      presentationStyle='pageSheet'
      onDismiss={close}
    >
      <ModalHeader title={getTitle()} onClose={close} />
      <View style={{ ...styles.wrap, backgroundColor: theme.bg }}>
        {next === 1 ? (
          <ScrollView style={styles.scroller} contentContainerStyle={styles.container}>
            <Form
              schema={tribe}
              // loading={loading}
              buttonAccessibilityLabel='add-tribe-form-button'
              buttonText='Next'
              onSubmit={finishForm}
              initialValues={{
                feed_url: '',
                app_url: '',
                escrow_amount: 10,
                escrow_time: 12,
                price_to_join: 0,
                price_per_message: 0,
                name: '',
                description: '',
                img: '',
                tags: [],
                unlisted: false,
                is_private: false
              }}
            />
          </ScrollView>
        ) : (
          <Animated.View
            style={{
              transform: [
                {
                  translateX: appearAnim
                }
              ]
            }}
          >
            <AddPhoto finish={finishPhoto} />
            {/* <AddMembers initialMemberIds={[]} loading={loading} finish={finish} /> */}
          </Animated.View>
        )}
      </View>
    </Modal>
  ))
}

function AddPhoto({ finish }) {
  const [imageDialog, setImageDialog] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadPercent, setUploadedPercent] = useState(0)
  const [photo, setPhoto] = useState('')
  const { chats, meme } = useStores()

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
          setPhoto(`https://${server.host}/public/${json.muid}`)
          finish(`https://${server.host}/public/${json.muid}`)
          setUploading(false)
        }
      })
      .catch(err => {
        console.log(err)
        setUploading(false)
      })
  }

  return useObserver(() => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          marginBottom: 60
        }}
      >
        <AvatarEdit
          uploading={uploading}
          uploadPercent={uploadPercent}
          display={true}
          onPress={() => setImageDialog(true)}
          size={250}
          round={200}
          top='42%'
          percentSize={20}
        >
          <Avatar size={250} round={200} photo={photo} />
        </AvatarEdit>

        <Button
          onPress={() => setImageDialog(true)}
          style={{ marginTop: 20 }}
          size='large'
        >
          Select Photo
        </Button>
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

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  content: {
    flex: 1
  },
  scroller: {
    width: '100%',
    flex: 1,
    display: 'flex'
  },
  container: {
    width: '100%'
    // paddingBottom: 20
  }
})
