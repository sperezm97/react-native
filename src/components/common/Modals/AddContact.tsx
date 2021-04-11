import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { useObserver } from 'mobx-react-lite'

import { useStores } from '../../../store'
import Form from '../../form'
import { contact } from '../../form/schemas'
import ModalWrap from './ModalWrap'
import Header from './ModalHeader'

export default function AddContact() {
  const { ui, contacts } = useStores()
  const [loading, setLoading] = useState(false)

  function close() {
    ui.setAddContactModal(false)
  }

  return useObserver(() => (
    <ModalWrap onClose={close} visible={ui.addContactModal} noSwipe>
      <Header title='Add Contact' onClose={close} />
      <View style={styles.content}>
        <Form
          schema={contact}
          loading={loading}
          buttonAccessibilityLabel='add-friend-form-button'
          buttonText='Save'
          onSubmit={async values => {
            setLoading(true)
            await contacts.addContact(values)
            setLoading(false)
            close()
          }}
        />
      </View>
    </ModalWrap>
  ))
}

const styles = StyleSheet.create({
  content: {
    flex: 1
  }
})
