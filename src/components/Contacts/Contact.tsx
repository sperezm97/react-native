import React, { useState, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { useObserver } from 'mobx-react-lite'
import { IconButton, Switch } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'

import { useStores, useTheme } from 'store'
import { constants } from '../../constants'
import ConfirmDialog from '../utils/confirmDialog'
import * as schemas from '../form/schemas'
import Form from '../form'
import BackHeader from '../common/BackHeader'
import Typography from '../common/Typography'

const conversation = constants.chat_types.conversation

export default function EditContact({ route }) {
  const { contacts, chats } = useStores()
  const theme = useTheme()
  const [loading, setLoading] = useState(false)
  const [sub] = useState(false)
  const [existingSub, setExistingSub] = useState(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const navigation = useNavigation()

  const contact = route.params.contact

  useEffect(() => {
    fetchSubscription()
  }, [])

  async function fetchSubscription() {
    const chat = chatForContact()
    const isConversation = chat && chat.type === constants.chat_types.conversation
    if (isConversation) {
      const s = await contacts.getSubscriptionForContact(contact.id)
      if (s?.[0]) setExistingSub(s[0])
    }
  }

  async function updateContact(values) {
    setLoading(true)
    if (contact.alias !== values.alias) {
      await contacts.updateContact(contact.id, {
        alias: values.alias,
      })
    }
    setLoading(false)
  }

  function chatForContact() {
    const cfc = chats.chatsArray.find((c) => {
      return c.type === conversation && c.contact_ids.includes(contact.id)
    })
    return cfc
  }

  async function toggleSubscription(sid, paused: boolean) {
    const ok = await contacts.toggleSubscription(sid, paused)
    if (ok)
      setExistingSub((current) => {
        return { ...current, paused }
      })
  }

  const subPaused = !!existingSub?.paused

  const Subscribe = (
    <>
      {/* {!sub && (
        <TouchableOpacity onPress={() => ui.setContactSubscribeModal(true, contact)}>
          <Button mode='text' size='small'>
            <Typography size={14} color={theme.primary}>
              {existingSub ? 'Subscribed' : 'Subscribe'}
            </Typography>
          </Button>
        </TouchableOpacity>
      )} */}
      {sub && existingSub && existingSub.id && (
        <View style={styles.row}>
          <IconButton
            icon='trash-can-outline'
            color={theme.icon}
            size={22}
            style={{ marginRight: 12 }}
            onPress={() => setShowConfirm(true)}
          />
          <View style={styles.row}>
            <Typography style={{ ...styles.pausedText, color: theme.subtitle }}>
              {subPaused ? 'PAUSED' : 'ACTIVE'}
            </Typography>
            <Switch
              value={!subPaused}
              onValueChange={() => toggleSubscription(existingSub.id, !subPaused)}
            />
          </View>
        </View>
      )}
    </>
  )

  return useObserver(() => (
    <View style={{ ...styles.wrap, backgroundColor: theme.bg }}>
      <BackHeader title='Edit Contact' navigate={() => navigation.goBack()} action={Subscribe} />

      <View style={styles.content}>
        <Form
          schema={schemas.contactEdit}
          loading={loading}
          buttonText='Save'
          initialValues={
            contact
              ? {
                  alias: contact.alias,
                  public_key: contact.public_key,
                }
              : {}
          }
          readOnlyFields={'public_key'}
          onSubmit={(values) => updateContact(values)}
        />
      </View>

      <ConfirmDialog
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={() => {
          setShowConfirm(false)
          contacts.deleteSubscription(existingSub.id)
          // setSub(false)
          setExistingSub(null)
        }}
      />
    </View>
  ))
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  pausedText: {
    fontSize: 12,
    minWidth: 50,
  },
})
