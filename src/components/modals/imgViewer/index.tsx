import React, { useState, useRef, useEffect } from 'react'
import { useObserver } from 'mobx-react-lite'
import { View, StyleSheet, Image, Dimensions, TextInput, Text, TouchableOpacity, BackHandler, KeyboardAvoidingView } from 'react-native'
import { Portal, IconButton } from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import RNFetchBlob from 'rn-fetch-blob'
import { ActivityIndicator } from 'react-native-paper'
import * as base64 from 'base-64'
import FastImage from 'react-native-fast-image'

import { useStores, useTheme } from '../../../store'
import { randString } from '../../../crypto/rand'
import * as e2e from '../../../crypto/e2e'
import SetPrice from './setPrice'
import EE, { LEFT_IMAGE_VIEWER } from '../../utils/ee'
import { constants } from '../../../constants'
import { fileUpload } from '../../chat/fileUpload'
import ModalWrap from '../modalWrap'
import Header from '../modalHeader'

export default function ImageViewerWrap({ params, visible }) {
  const { ui } = useStores()

  function close() {
    ui.setImgViewerParams(null)
  }

  return (
    <ModalWrap onClose={close} visible={visible}>
      {visible && <ImageViewer params={params} close={close} />}
    </ModalWrap>
  )
}

function ImageViewer(props) {
  const { params, close, visible } = props
  const { data, uri, chat_id, contact_id, pricePerMessage } = params
  const { ui, meme, msg, chats } = useStores()
  const theme = useTheme()
  const [text, setText] = useState('')
  const [price, setPrice] = useState(0)
  const [inputFocused, setInputFocused] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadPercent, setUploadedPercent] = useState(0)
  const inputRef = useRef(null)

  const w = Math.round(Dimensions.get('window').width)
  const h = Math.round(Dimensions.get('window').height)
  const showImg = uri || data ? true : false
  const showInput = contact_id || chat_id ? true : false
  const showMsgMessage = params.msg ? true : false
  const title = showMsgMessage ? 'Send Paid Message' : 'Send Image'

  async function sendFinalMsg({ muid, media_key, media_type, price }) {
    await msg.sendAttachment({
      contact_id,
      chat_id,
      muid,
      price,
      media_key,
      media_type,
      text: showMsgMessage ? '' : text,
      amount: pricePerMessage || 0
    })
    close()
  }

  async function sendGif() {
    const gifJSON = JSON.stringify({
      id: params.id,
      url: params.uri,
      aspect_ratio: params.aspect_ratio,
      text: showMsgMessage ? '' : text
    })
    const b64 = base64.encode(gifJSON)
    await msg.sendMessage({
      contact_id,
      chat_id,
      text: 'giphy::' + b64,
      reply_uuid: '',
      amount: 0
    })
    close()
  }

  async function sendAttachment() {
    if (uploading) return

    const isGif = uri && uri.split(/[#?]/)[0].split('.').pop().trim() === 'gif'
    if (isGif) {
      sendGif()
      return
    }

    setUploading(true)
    inputRef.current.blur()
    const type = showMsgMessage ? 'n2n2/text' : 'image/jpg'
    const name = showMsgMessage ? 'Message.txt' : 'Image.jpg'

    const pwd = await randString(32)
    const server = meme.getDefaultServer()
    if (!server) return
    if (!(uri || (showMsgMessage && text))) return

    let enc = null
    if (showMsgMessage) {
      enc = await e2e.encrypt(text, pwd)
    } else {
      const newUri = uri.replace('file://', '')
      enc = await e2e.encryptFile(newUri, pwd)
    }

    RNFetchBlob.fetch(
      'POST',
      `http://${server.host}/file`,
      {
        Authorization: `Bearer ${server.token}`,
        'Content-Type': 'multipart/form-data'
      },
      [
        {
          name: 'file',
          filename: name,
          type: type,
          data: enc
        },
        { name: 'name', data: name }
      ]
    )
      // listen to upload progress event, emit every 250ms
      .uploadProgress({ interval: 250 }, (written, total) => {
        console.log('uploaded', written / total)
        setUploadedPercent(Math.round((written / total) * 100))
      })
      .then(async resp => {
        let json = resp.json()
        console.log('done uploading', json)
        await sendFinalMsg({
          muid: json.muid,
          media_key: pwd,
          media_type: type,
          price
        })
        setUploading(false)
      })
      .catch(err => {
        console.log(err)
      })
  }

  const boxStyles = { width: w, height: h - 160 }
  const disabled = uploading || (showMsgMessage && !price)

  const theChat = chat_id && chats.chats.find(c => c.id === chat_id)
  const isTribe = theChat && theChat.type === constants.chat_types.tribe

  function onShowAmount() {
    if (inputRef.current) {
      inputRef.current.blur()
    }
  }

  const headerHeight = 60

  return useObserver(() => (
    <Portal.Host>
      <Header title={title} onClose={close} />
      <View style={{ ...styles.wrap, backgroundColor: theme.black }}>
        {/* {showInput && !isTribe && <SetPrice setAmount={amt=> setPrice(amt)} />} */}
        {showInput && <SetPrice setAmount={amt => setPrice(amt)} onShow={onShowAmount} />}

        {showImg && <FastImage resizeMode='contain' source={{ uri: uri || data }} style={{ ...styles.img, ...boxStyles }} />}
        {showMsgMessage && !uploading && (
          <View style={{ ...styles.msgMessage, ...boxStyles }}>
            <Text style={styles.msgMessageText}>Set a price and enter your message</Text>
          </View>
        )}

        {uploading && (
          <View style={{ ...styles.activityWrap, width: w, height: h - 180 }}>
            <ActivityIndicator animating={true} color='white' size='large' />
            <Text style={styles.progressNum}>{`${uploadPercent}%`}</Text>
          </View>
        )}

        {showInput && (
          <KeyboardAvoidingView style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }} behavior='position' keyboardVerticalOffset={headerHeight}>
            <View style={styles.send}>
              <TextInput
                placeholder='Message...'
                ref={inputRef}
                style={{ ...styles.input, backgroundColor: theme.inputBg, color: theme.input }}
                placeholderTextColor={theme.subtitle}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
                onChangeText={e => setText(e)}
              >
                <Text>{text}</Text>
              </TextInput>
              <View style={styles.sendButtonWrap}>
                <TouchableOpacity activeOpacity={0.5} style={{ ...styles.sendButton, backgroundColor: theme.primary }} onPress={() => sendAttachment()} disabled={disabled}>
                  <Icon name='send' size={17} color={theme.white} />
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        )}
      </View>
    </Portal.Host>
  ))
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1
  },
  img: {
    width: '100%'
  },
  activityWrap: {
    height: '80%',
    width: '100%',
    position: 'absolute',
    top: '10%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  send: {
    position: 'absolute',
    width: '100%',
    left: 0,
    right: 0,
    bottom: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 10,
    paddingRight: 10
  },
  input: {
    flex: 1,
    borderRadius: 20,
    paddingLeft: 18,
    paddingRight: 18,
    height: 40,
    fontSize: 17,
    lineHeight: 20
  },
  sendButtonWrap: {
    width: 55,
    height: 40
  },
  sendButton: {
    marginLeft: 7,
    width: 39,
    maxWidth: 39,
    height: 39,
    maxHeight: 39,
    borderRadius: 19,
    marginTop: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  progressNum: {
    color: 'white',
    fontSize: 16,
    marginTop: 16
  },
  msgMessage: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  msgMessageText: {
    color: 'white'
  }
})
