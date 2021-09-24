import React from 'react'
import { useObserver } from 'mobx-react-lite'
import { View } from 'react-native'
import Modal from './modalWrap'
import Header from './modalHeader'
import { WebView } from 'react-native-webview'

export default function Jitsi({ visible }) {
  function close() {
    console.log('close')
  }

  return useObserver(() => (
    <Modal visible={visible} onClose={close}>
      <Header title='Video Chat' onClose={close} />
      <View style={{ backgroundColor: 'black', flex: 1 }}>
        <WebView source={{ uri: 'https://meet.jit.si/sphinx.call' }} />
      </View>
    </Modal>
  ))
}
