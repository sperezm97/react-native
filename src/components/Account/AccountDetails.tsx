import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text, Switch } from 'react-native'
import { TextInput } from 'react-native-paper'

import { useStores, useTheme } from '../../store'
import BackHeader from '../common/BackHeader'
import InputAccessoryView from '../common/Accessories/InputAccessoryView'
import * as schemas from '../form/schemas'
import Form from '../form'

export default function AccountDetails() {
  const { user, contacts } = useStores()
  const [tipAmount, setTipAmount] = useState(user.tipAmount + '')
  const [loading, setLoading] = useState(false)
  const [isEnabled, setIsEnabled] = useState(false)
  const me = contacts.contacts.find(c => c.id === 1)
  const nativeID = 'tipAmount'

  useEffect(() => {
    setIsEnabled(me?.private_photo || false)
  }, [])

  const theme = useTheme()

  function tipAmountChange(ta) {
    const int = parseInt(ta)
    setTipAmount(int ? int + '' : '')
  }

  function toggleSwitch() {
    setIsEnabled(previousState => !previousState)
    shareContactKey()
  }

  function save() {
    setLoading(true)
    user.setTipAmount(parseInt(tipAmount))
    setLoading(false)
  }

  async function shareContactKey() {
    const contact_key = me.contact_key
    if (!contact_key) return
    await contacts.updateContact(1, { contact_key })
  }

  return (
    <View style={{ ...styles.wrap, backgroundColor: theme.bg }}>
      <BackHeader title='Details' />
      <View style={styles.content}>
        <View>
          <Form
            nopad
            displayOnly
            schema={schemas.pubKey}
            loading={loading}
            buttonText='Save'
            initialValues={
              user
                ? {
                    public_key: user.publicKey
                  }
                : {}
            }
            readOnlyFields={'public_key'}
          />
        </View>

        <View style={styles.shareWrap}>
          <Text style={{ color: theme.text }}>Share my profile photo with contacts</Text>
          <Switch
            trackColor={{ false: theme.grey, true: theme.primary }}
            thumbColor={theme.white}
            ios_backgroundColor={theme.grey}
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>

        <Text style={{ color: theme.text }}>Tip Amount</Text>
        <TextInput
          // returnKeyType='done'
          inputAccessoryViewID={nativeID}
          keyboardType='number-pad'
          placeholder='Default Tip Amount'
          value={tipAmount + ''}
          onChangeText={tipAmountChange}
          style={{ height: 50, backgroundColor: theme.bg }}
          underlineColor={theme.border}
        />
        <InputAccessoryView nativeID={nativeID} done={save} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1
  },
  content: {
    marginTop: 40,
    paddingRight: 18,
    paddingLeft: 18
  },
  shareWrap: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 36
  }
})
