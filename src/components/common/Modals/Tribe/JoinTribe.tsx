import React, { useState } from 'react'
import { StyleSheet, View, Text, Image, Dimensions, Modal } from 'react-native'
import { useObserver } from 'mobx-react-lite'
import { TextInput } from 'react-native-paper'

import { DEFAULT_TRIBE_SERVER } from '../../../../config'
import { useStores, useTheme } from '../../../../store'
import Header from '../ModalHeader'
import Button from '../../Button'

export default function JoinTribe() {
  const { ui, chats } = useStores()
  const theme = useTheme()
  const [loading, setLoading] = useState(false)
  const [alias, setAlias] = useState('')
  const [key, setKey] = useState(false)

  const params = ui.joinTribeParams

  async function joinTribe() {
    setLoading(true)
    await chats.joinTribe({
      name: params.name,
      group_key: params.group_key,
      owner_alias: params.owner_alias,
      owner_pubkey: params.owner_pubkey,
      host: params.host || DEFAULT_TRIBE_SERVER,
      uuid: params.uuid,
      img: params.img,
      amount: params.price_to_join || 0,
      is_private: params.private,
      ...(alias && { my_alias: alias })
    })
    setLoading(false)
    close()
  }

  let prices = []
  if (params) {
    prices = [
      { label: 'Price to Join', value: params.price_to_join },
      { label: 'Price per Message', value: params.price_per_message },
      { label: 'Amount to Stake', value: params.escrow_amount }
    ]
  }

  function close() {
    ui.setJoinTribeParams(null)
  }

  const h = Dimensions.get('screen').height
  const hasImg = params && params.img ? true : false

  return useObserver(() => {
    const joinTribeVisible = ui.joinTribeParams ? true : false

    return (
      <Modal visible={joinTribeVisible} animationType='slide' presentationStyle='pageSheet' onDismiss={close}>
        <Header title='Join Community' onClose={() => close()} />
        {params && (
          <View style={styles.content}>
            <Image
              source={hasImg ? { uri: params.img } : require('../../../../../android_assets/tent.png')}
              style={{ width: 150, height: 150, borderRadius: 75, marginTop: 15 }}
              resizeMode={'cover'}
            />

            <Text style={{ marginTop: 15, fontWeight: 'bold', fontSize: 22, color: theme.title }}>{params.name}</Text>

            <Text style={{ marginTop: 10, marginBottom: 10, paddingLeft: 15, paddingRight: 15, color: theme.title }}>{params.description}</Text>

            {!key && (
              <View style={styles.table}>
                {prices &&
                  prices.map((p, i) => {
                    return (
                      <View key={i} style={{ ...styles.tableRow, borderBottomWidth: i === prices.length - 1 ? 0 : 1 }}>
                        <Text style={{ ...styles.tableRowLabel, color: theme.title }}>{`${p.label}:`}</Text>
                        <Text style={{ ...styles.tableRowValue, color: theme.title }}>{p.value || 0}</Text>
                      </View>
                    )
                  })}
              </View>
            )}

            <TextInput
              mode='outlined'
              placeholder='Your Name in this Tribe'
              onChangeText={e => setAlias(e)}
              value={alias}
              style={styles.input}
              onFocus={() => setKey(true)}
              onBlur={() => setKey(false)}
            />

            <Button onPress={joinTribe} loading={loading} size='large' w='80%' style={{ ...styles.button, top: h - 250 }}>
              Join
            </Button>
          </View>
        )}
      </Modal>
    )
  })
}

const styles = StyleSheet.create({
  modal: {
    margin: 0
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    paddingBottom: 20
  },
  button: {
    position: 'absolute'
  },
  table: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginTop: 15,
    width: 240
  },
  tableRow: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  tableRowLabel: {
    minWidth: 150
  },
  tableRowValue: {
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    minWidth: 62,
    textAlign: 'right'
  },
  input: {
    maxHeight: 65,
    marginTop: 15,
    minWidth: 240
  }
})
