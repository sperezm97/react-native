import React, { useState } from 'react'
import { useObserver } from 'mobx-react-lite'
import { StyleSheet, View, ScrollView } from 'react-native'

import { useStores } from 'store'
import { constants } from '../../../constants'
import ConfirmDialog from '../../utils/confirmDialog'
import * as schemas from '../../form/schemas'
import Form from '../../form'
import ModalWrap from './ModalWrap'
import ModalHeader from './ModalHeader'

const conversation = constants.chat_types.conversation

export default function ContactSubscribe() {
  const [showConfirm, setShowConfirm] = useState(false)
  const [existingSub, setExistingSub] = useState(null)
  const [loading, setLoading] = useState(false)
  const { ui, contacts, chats } = useStores()

  const contact = ui.contactSubscribeParams

  function chatForContact() {
    const cfc = chats.chats.find((c) => {
      return c.type === conversation && c.contact_ids.includes(contact.id)
    })
    return cfc
  }

  function makeSubValues() {
    const initialSubValues: { [k: string]: any } = {}
    if (existingSub) {
      const amountIsCustom = existingSub.amount !== 500 && existingSub.amount !== 1000 && existingSub.amount !== 2000
      if (amountIsCustom) {
        initialSubValues.amount = {
          selected: 'custom',
          custom: existingSub.amount,
        }
      } else {
        initialSubValues.amount = { selected: existingSub.amount }
      }
      initialSubValues.interval = { selected: existingSub.interval }
      if (existingSub.end_number) {
        initialSubValues.endRule = {
          selected: 'number',
          custom: existingSub.end_number,
        }
      } else if (existingSub.end_date) {
        initialSubValues.endRule = {
          selected: 'date',
          custom: existingSub.end_date,
        }
      }
    }
    return initialSubValues
  }

  function parseSubValues(v) {
    const amountIsCustom = v.amount.selected === 'custom' && v.amount.custom
    const endRuleIsNumber = v.endRule.selected === 'number' && v.endRule.custom
    const endRuleIsDate = v.endRule.selected === 'date' && v.endRule.custom
    const body = {
      amount: amountIsCustom ? v.amount.custom : v.amount.selected,
      interval: v.interval.selected,
      ...(endRuleIsNumber && { end_number: v.endRule.custom }),
      ...(endRuleIsDate && { end_date: v.endDate.custom }),
    }
    return body
  }

  async function createOrEditSubscription(v) {
    const cfc = chatForContact()
    if (!cfc) return console.log('no chat')
    setLoading(true)
    if (existingSub) {
      const s = await contacts.editSubscription(existingSub.id, {
        ...v,
        chat_id: cfc.id,
        contact_id: contact.id,
      })
      setExistingSub(s)
    } else {
      const s = await contacts.createSubscription({
        ...v,
        chat_id: cfc.id,
        contact_id: contact.id,
      })
      setExistingSub(s)
    }
    setLoading(false)
  }

  function close() {
    ui.setContactSubscribeModal(false, null)
  }

  return useObserver(() => (
    <ModalWrap
      onClose={close}
      visible={ui.contactSubscribeModal}
      animationIn={'slideInRight'}
      animationOut={'slideOutRight'}
      swipeDirection='right'
      hasBackdrop={false}
    >
      <ModalHeader title='Recurring' onClose={close} leftArrow />
      <View style={{ flex: 1 }}>
        <ScrollView style={styles.scroller} contentContainerStyle={styles.container}>
          <Form
            schema={schemas.subscribe}
            loading={loading}
            nopad
            buttonText='Subscribe'
            initialValues={makeSubValues()}
            onSubmit={(v) => {
              const body = parseSubValues(v)
              createOrEditSubscription(body)
            }}
          />
        </ScrollView>

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
    </ModalWrap>
  ))
}

const styles = StyleSheet.create({
  modal: {
    margin: 0,
  },
  header: {
    height: 50,
    minHeight: 50,
    width: '100%',
    paddingLeft: 0,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  headerLefty: {
    width: 101,
    height: 50,
    borderRadius: 18,
    marginLeft: 5,
  },
  subWrap: {
    minWidth: 111,
    borderRadius: 18,
    marginRight: 12,
  },
  subscribe: {
    backgroundColor: '#6289FD',
    height: 27,
    width: 111,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  fader: {
    flex: 1,
  },
  former: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    paddingBottom: 20,
  },
  scroller: {
    width: '100%',
    flex: 1,
    display: 'flex',
  },
  container: {
    width: '100%',
    paddingBottom: 20,
  },
  pausedText: {
    fontSize: 12,
    color: 'grey',
    minWidth: 50,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
})
