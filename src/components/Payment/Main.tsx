import React, { useState } from 'react'
import { View, StyleSheet, Text, Dimensions } from 'react-native'
import { Avatar, TextInput } from 'react-native-paper'

import NumKey from '../utils/numkey'
import { useStores, useTheme } from '../../store'
import Button from '../common/Button'
import FadeView from '../utils/fadeView'

const height = Math.round(Dimensions.get('window').height) - 80 - 60

export default function Main({ loading = false, confirmOrContinue, request = false }) {
  const { ui, details } = useStores()
  const theme = useTheme()
  const [amt, setAmt] = useState('0')
  const [text, setText] = useState('')

  function go(n) {
    if (amt === '0') setAmt(`${n}`)
    else
      setAmt(prevAmt => {
        const newAmount = `${amt}${n}`
        if (ui.payMode === 'payment' && details.balance < parseInt(newAmount)) {
          return prevAmt
        }
        return newAmount
      })
  }

  function backspace() {
    if (amt.length === 1) {
      setAmt('0')
    } else {
      const newAmt = amt.substr(0, amt.length - 1)
      setAmt(newAmt)
    }
  }

  return (
    <View style={{ ...styles.wrap, maxHeight: height, minHeight: height }}>
      <View style={styles.amtWrap}>
        <View style={styles.amtInnerWrap}>
          <Text style={{ ...styles.amt, color: theme.title }}>{amt}</Text>
          <Text style={{ ...styles.sat, color: theme.title }}>sat</Text>
        </View>
      </View>
      <View style={{ ...styles.bottom }}>
        <View style={styles.memoWrap}>
          {request && <TextInput value={text} placeholder='Add Message' onChangeText={v => setText(v)} style={{ ...styles.input, backgroundColor: theme.bg }} underlineColor={theme.border} />}
        </View>
        <NumKey onKeyPress={v => go(v)} onBackspace={backspace} squish />
        <View style={styles.confirmWrap}>
          <FadeView opacity={amt !== '0' ? 1 : 0} duration={600}>
            <Button style={{ ...styles.confirm }} loading={loading} onPress={() => confirmOrContinue(parseInt(amt))} btnHeight={45}>
              {request ? 'CONFIRM' : 'CONTINUE'}
            </Button>
          </FadeView>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    justifyContent: 'center'
  },
  amtWrap: {
    width: '100%',
    display: 'flex',
    marginBottom: 20,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  amtInnerWrap: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  amt: {
    fontSize: 45
  },
  sat: {
    position: 'absolute',
    right: 25,
    fontSize: 23
  },
  bottom: {
    width: '100%',
    flex: 1,
    maxHeight: 390
  },
  confirmWrap: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    height: 80,
    marginTop: 18
  },
  confirm: {
    width: 150,
    justifyContent: 'center',
    borderRadius: 20
  },
  memoWrap: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '85%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 10,
    height: 50
  },
  input: {
    height: 42,
    maxHeight: 42,
    flex: 1,
    textAlign: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    paddingBottom: 10,
    fontSize: 18
  }
})
