import React, { useState } from 'react'
import {
  StyleSheet,
  View,
  Modal,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView
} from 'react-native'
import { useObserver } from 'mobx-react-lite'
import { TextInput } from 'react-native-paper'

import { DEFAULT_TRIBE_SERVER } from '../../../../config'
import { useStores, useTheme } from '../../../../store'
import Header from '../ModalHeader'
import Button from '../../Button'
import Avatar from '../../Avatar'
import Typography from '../../Typography'

export default function JoinTribe() {
  const { ui, chats } = useStores()
  const theme = useTheme()
  const [loading, setLoading] = useState(false)
  const [alias, setAlias] = useState('')

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

  const hasImg = params && params.img ? true : false

  return useObserver(() => {
    const joinTribeVisible = ui.joinTribeParams ? true : false

    return (
      <Modal
        visible={joinTribeVisible}
        animationType='slide'
        presentationStyle='fullScreen'
        onDismiss={close}
      >
        <SafeAreaView style={{ ...styles.wrap, backgroundColor: theme.bg }}>
          <KeyboardAvoidingView
            behavior='padding'
            style={{ flex: 1 }}
            keyboardVerticalOffset={1}
          >
            <Header title='Join Community' onClose={() => close()} />
            <ScrollView>
              {params && (
                <View style={{ ...styles.content }}>
                  <Avatar photo={hasImg && params.img} size={160} round={90} />
                  <Typography
                    size={20}
                    fw='500'
                    style={{
                      marginTop: 10
                    }}
                  >
                    {params.name}
                  </Typography>

                  <Typography
                    color={theme.subtitle}
                    style={{
                      marginTop: 10,
                      marginBottom: 10
                    }}
                  >
                    {params.description}
                  </Typography>
                  <View style={{ ...styles.table, borderColor: theme.border }}>
                    {prices &&
                      prices.map((p, i) => {
                        return (
                          <View
                            key={i}
                            style={{
                              ...styles.tableRow,
                              borderBottomColor: theme.border,
                              borderBottomWidth: i === prices.length - 1 ? 0 : 1
                            }}
                          >
                            <Typography
                              style={{ ...styles.tableRowLabel }}
                              color={theme.title}
                            >
                              {`${p.label}:`}
                            </Typography>

                            <Typography
                              style={{ ...styles.tableRowValue }}
                              color={theme.subtitle}
                            >
                              {p.value || 0}
                            </Typography>
                          </View>
                        )
                      })}
                  </View>
                  <TextInput
                    placeholder='Your Name in this Tribe'
                    onChangeText={e => setAlias(e)}
                    value={alias}
                    style={{
                      ...styles.input,
                      backgroundColor: theme.bg,
                      color: theme.placeholder
                    }}
                    underlineColor={theme.border}
                  />
                  <Button onPress={joinTribe} loading={loading} size='large' w={240}>
                    Join
                  </Button>
                </View>
              )}
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    )
  })
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    height: '100%',
    width: '100%'
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%'
  },
  table: {
    borderWidth: 1,
    borderRadius: 5,
    width: 240,
    marginTop: 25,
    marginBottom: 25
  },
  tableRow: {
    borderBottomWidth: 1,
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
    height: 50,
    maxHeight: 50,
    minWidth: 240,
    marginBottom: 40
  }
})
