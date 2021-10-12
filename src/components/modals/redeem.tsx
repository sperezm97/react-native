import React, { useState } from 'react'
import { useObserver } from 'mobx-react-lite'
import { View, Text, StyleSheet } from 'react-native'
import { Button, Portal } from 'react-native-paper'

import { useStores } from 'store'
import ModalWrap from './modalWrap'
import Header from './modalHeader'

export default function RedeemWrap({ visible }) {
  const { ui } = useStores()

  function close() {
    ui.setRedeemModalParams(false)
  }

  return (
    <ModalWrap onClose={close} visible={visible}>
      {visible ? <Redeem close={close} /> : null}
    </ModalWrap>
  )
}

function Redeem({ close }) {
  const { ui, user } = useStores()
  const [loading, setLoading] = useState(true)

  // TODO: properly type this so no type errors are thrown when removing any
  const params: any = ui.redeemModalParams
  const amt = (params.amount && parseInt(params.amount)) || 0

  async function redeem() {
    setLoading(true)
    try {
      const r = await fetch(params.host, {
        method: 'POST',
        body: JSON.stringify({
          token: params.token,
          pubkey: user.publicKey,
        }),
      })
      const j = await r.json()
      console.log(j)
      close()
    } catch (e) {
      close()
    }
    setLoading(false)
  }

  return useObserver(() => (
    <Portal.Host>
      <Header title='Redeem Sats' onClose={close} />
      <View style={styles.modal}>
        <Text style={styles.amt}>{`Redeem ${amt} sats from:`}</Text>
        <Text style={styles.host}>{params.name || ''}</Text>
        <Button
          onPress={redeem}
          mode='contained'
          dark={true}
          style={styles.button}
          loading={loading}
        >
          Confirm
        </Button>
      </View>
    </Portal.Host>
  ))
}

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    paddingTop: 20,
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  amt: {
    margin: 25,
  },
  host: {
    margin: 25,
    fontSize: 20,
  },
  button: {
    borderRadius: 30,
    width: '80%',
    height: 60,
    display: 'flex',
    justifyContent: 'center',
  },
})
