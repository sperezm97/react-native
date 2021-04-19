import React, { useState } from 'react'
import { View, ScrollView, StyleSheet } from 'react-native'

import { useStores } from '../../../store'
import Form from '../../form'
import { tribe } from '../../form/schemas'

export default function EditTribe() {
  const { ui, chats } = useStores()
  const [loading, setLoading] = useState(false)
  const [img, setImg] = useState(null)

  async function finish(v) {
    setLoading(true)
    await chats.editTribe({
      ...v,
      id: ui.editTribeParams.id
    })

    // if(img && img.uri) {
    //   await createChatPic(group.id, img.uri)
    //   chats.updateChatPhotoURI(group.id, img.uri)
    // }
    // setTimeout(() => {
    //   onFinish()
    //   setLoading(false)
    // }, 150)
  }

  return (
    <>
      <View style={styles.wrap}>
        <ScrollView style={styles.scroller} contentContainerStyle={styles.container}>
          <Form
            schema={tribe}
            loading={loading}
            // buttonAccessibilityLabel="tribe-form-button"
            buttonText='Edit'
            onSubmit={finish}
            initialValues={{
              ...ui.editTribeParams,
              is_private: ui.editTribeParams.private
            }}
          />
        </ScrollView>
      </View>
    </>
  )
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
