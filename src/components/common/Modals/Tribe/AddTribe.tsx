import React, { useState } from 'react'
import { StyleSheet, View, ScrollView, Modal } from 'react-native'
import { useObserver } from 'mobx-react-lite'

import { useStores, useTheme } from '../../../../store'
import ModalHeader from '../ModalHeader'
import Form from '../../../form'
import { tribe } from '../../../form/schemas'

export default function AddTribe() {
  const { ui, chats } = useStores()
  const [loading, setLoading] = useState(false)
  const theme = useTheme()

  async function finish(v) {
    setLoading(true)
    await chats.createTribe(v)
  }

  function close() {
    ui.setNewTribeModal(false)
  }

  return useObserver(() => (
    <Modal visible={ui.newTribeModal} animationType='slide' presentationStyle='pageSheet' onDismiss={close}>
      <ModalHeader title='Add Community' onClose={close} />

      <View style={{ ...styles.wrap, backgroundColor: theme.bg }}>
        <ScrollView style={styles.scroller} contentContainerStyle={styles.container}>
          <Form
            schema={tribe}
            loading={loading}
            buttonAccessibilityLabel='add-tribe-form-button'
            buttonText='Create Community'
            onSubmit={finish}
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
      </View>
    </Modal>
  ))
}

const styles = StyleSheet.create({
  wrap: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    minHeight: 400
  },
  scroller: {
    width: '100%',
    flex: 1,
    display: 'flex'
  },
  container: {
    width: '100%',
    paddingBottom: 20
  }
})
