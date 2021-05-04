import React, { useEffect, useState } from 'react'
import { StyleSheet, View, ScrollView, Modal, Animated, Dimensions } from 'react-native'
import { useObserver } from 'mobx-react-lite'

import { useStores, useTheme } from '../../../../store'
import { SCREEN_WIDTH } from '../../../../constants'
import ModalHeader from '../ModalHeader'
import Form from '../../../form'
import { tribe } from '../../../form/schemas'
import AddMembers from '../../../Tribes/Members/AddMembers'

export default function AddTribe() {
  const { ui, chats } = useStores()
  const [loading, setLoading] = useState(false)
  const [next, setNext] = useState(1)
  const [form, setForm] = useState(null)
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
    setLoading(true)
    setNext(2)
    setForm(v)
    setLoading(false)
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

  return useObserver(() => (
    <Modal
      visible={ui.newTribeModal}
      animationType='slide'
      presentationStyle='pageSheet'
      onDismiss={close}
    >
      <ModalHeader title='Add Community' onClose={close} />
      <View style={{ ...styles.wrap, backgroundColor: theme.bg }}>
        {next === 1 ? (
          <ScrollView style={styles.scroller} contentContainerStyle={styles.container}>
            <Form
              schema={tribe}
              loading={loading}
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
            <AddMembers initialMemberIds={[]} loading={loading} finish={finish} />
          </Animated.View>
        )}
      </View>
    </Modal>
  ))
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  content: {
    flex: 1
    // width: SCREEN_WIDTH,
    // width: '100%',
    // position: 'relative'
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
