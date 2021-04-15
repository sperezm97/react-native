import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useObserver } from 'mobx-react-lite'

import { useStores, useTheme } from '../../../store'
import ModalWrap from './ModalWrap'
import ModalHeader from './ModalHeader'
import * as schemas from '../../form/schemas'
import Form from '../../form'

export default function InviteNewUser() {
  const [price, setPrice] = useState(null)
  const [loading, setLoading] = useState(false)
  const { ui, contacts } = useStores()
  const theme = useTheme()

  async function invite(values) {
    setLoading(true)
    await contacts.createInvite(values.nickname, values.welcome_message)
    setLoading(false)
    close()
  }

  useEffect(() => {
    fetchPrice()
  }, [])

  async function fetchPrice() {
    const price = await contacts.getLowestPriceForInvite()
    if (price || price === 0) setPrice(price)
  }

  function close() {
    ui.setInviteFriendModal(false)
  }

  const hasPrice = price || price === 0

  const RowContent = (
    <>
      {hasPrice && (
        <View style={styles.estimatedCost}>
          <Text style={{ ...styles.estimatedCostText, color: theme.title }}>ESTIMATED COST</Text>
          <View style={styles.estimatedCostBottom}>
            <Text style={{ ...styles.estimatedCostNum, color: theme.title }}>{price}</Text>
            <Text style={styles.estimatedCostSat}>sat</Text>
          </View>
        </View>
      )}
    </>
  )

  return useObserver(() => (
    <ModalWrap onClose={close} visible={ui.inviteFriendModal} noSwipe>
      <ModalHeader title='Add Friend' onClose={close} />
      <View style={styles.content}>
        <Form
          schema={schemas.inviteFriend}
          loading={loading}
          buttonText='Create Invitation'
          buttonStyles={{ ...styles.button, backgroundColor: theme.secondary }}
          actionType='Row'
          rowContent={RowContent}
          onSubmit={values => invite(values)}
        />
      </View>
    </ModalWrap>
  ))
}

const styles = StyleSheet.create({
  content: {
    flex: 1
  },
  estimatedCost: {
    flexDirection: 'column'
  },
  estimatedCostText: {
    fontSize: 10,
    color: '#aaa'
  },
  estimatedCostBottom: {
    flexDirection: 'row'
  },
  estimatedCostNum: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    marginRight: 5
  },
  estimatedCostSat: {
    fontSize: 20,
    color: '#888'
  },
  button: {
    width: 200,
    borderRadius: 30
  }
})
