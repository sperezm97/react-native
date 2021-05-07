import React, { useState } from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { TextInput } from 'react-native-paper'

import { useStores, useTheme } from '../../../store'
import BackHeader from '../../common/BackHeader'
import Typography from '../../common/Typography'
import InputAccessoryView from '../../common/Accessories/InputAccessoryView'

export default function EditUserInfo({ route }) {
  const tribe = route.params.tribe
  const { chats } = useStores()
  const [loading, setLoading] = useState(false)
  const [alias, setAlias] = useState(
    (tribe && tribe.chat && tribe.chat['my_alias']) || ''
  )
  const theme = useTheme()
  const navigation = useNavigation()
  const nativeID = 'alias'

  tribe.escrow_time = tribe.escrow_millis
    ? Math.floor(tribe.escrow_millis / (60 * 60 * 1000))
    : 0

  async function finish(v) {
    setLoading(true)

    await chats.editTribe({
      ...v,
      id: tribe.chat.id
    })

    setTimeout(() => {
      setLoading(false)
      navigation.goBack()
    }, 150)
  }

  function updateAlias() {
    console.log('tribe', tribe.chat)
    if (!(tribe && tribe.chat && tribe.chat.id)) return
    if (alias !== tribe && tribe.chat && tribe.chat['my_alias']) {
      chats.updateMyInfoInChat(tribe.chat.id, alias, '')
    }
  }

  return (
    <>
      <View style={{ ...styles.wrap, backgroundColor: theme.bg }}>
        <BackHeader
          title='Edit your name and photo'
          navigate={() => navigation.goBack()}
        />
        {/* <ScrollView style={styles.scroller} contentContainerStyle={styles.container}> */}
        <Typography size={14}>My alias</Typography>
        <TextInput
          // returnKeyType='done'
          inputAccessoryViewID={nativeID}
          placeholder='My alias'
          value={alias}
          onChangeText={setAlias}
          style={{ height: 50, backgroundColor: theme.bg }}
          underlineColor={theme.border}
        />
        <InputAccessoryView nativeID={nativeID} done={updateAlias} />

        {/* <Form
            schema={schemas.tribe}
            loading={loading}
            buttonAccessibilityLabel='edit-tribe-form-button'
            buttonText='Save'
            onSubmit={finish}
            initialValues={{
              ...tribe,
              is_private: tribe.private
            }}
          /> */}
        {/* </ScrollView> */}
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1
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
