import React, { useState } from 'react'
import { View, StyleSheet, Text, Dimensions } from 'react-native'
import { Avatar, TextInput } from 'react-native-paper'

import NumKey from '../../../utils/numkey'
import { usePicSrc } from '../../../utils/picSrc'
import { useStores, useTheme } from '../../../../store'
import { useAvatarColor } from '../../../../store/hooks/msg'
import Button from '../../../common/Button'

export default function Main({ contact, loading, confirmOrContinue, contactless }) {
  const { ui, details } = useStores()
  const theme = useTheme()
  const [amt, setAmt] = useState('0')
  const [text, setText] = useState('')
  const [inputFocused, setInputFocused] = useState(false)

  const height = Math.round(Dimensions.get('window').height) - 80
  const uri = usePicSrc(contact)
  const hasImg = uri ? true : false

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

  const isLoopout = ui.payMode === 'loopout'
  const nameColor = contact && useAvatarColor(contact.alias)
  return (
    <View
      style={{
        ...styles.wrap,
        maxHeight: height,
        minHeight: height,
        justifyContent: contact ? 'space-around' : 'center'
      }}
    >
      {contact && (
        <View style={styles.contactWrap}>
          {/* <Avatar.Image source={hasImg ? { uri } : require('../../../../../android_assets/avatar.png')} size={42} /> */}
          <View style={styles.contactAliasWrap}>
            <Text style={styles.contactAliasLabel}>
              {ui.payMode === 'invoice' ? 'From' : 'To'}
            </Text>
            <Text style={{ color: nameColor }}>{contact.alias}</Text>
          </View>
        </View>
      )}

      <View style={styles.amtWrap}>
        <View style={styles.amtInnerWrap}>
          <Text style={{ ...styles.amt, color: theme.text }}>{amt}</Text>
          <Text style={{ ...styles.sat, color: theme.subtitle }}>sat</Text>
        </View>
      </View>

      <View style={styles.bottom}>
        {ui.payMode === 'invoice' && (
          <View style={styles.memoWrap}>
            <TextInput
              value={text}
              placeholder='Add Message'
              onChangeText={v => setText(v)}
              style={{ ...styles.input, backgroundColor: theme.bg }}
              underlineColor={theme.border}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
            />
          </View>
        )}
        <NumKey onKeyPress={v => go(v)} onBackspace={() => backspace()} squish />
        <View style={styles.confirmWrap}>
          {amt !== '0' && (
            <Button
              w={160}
              loading={loading}
              onPress={() => confirmOrContinue(parseInt(amt), text)}
            >
              {contactless || isLoopout ? 'CONTINUE' : 'CONFIRM'}
            </Button>
          )}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    width: '100%'
  },
  contactWrap: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5
  },
  contactAliasWrap: {
    marginLeft: 10,
    display: 'flex',
    flexDirection: 'column'
  },
  contactAliasLabel: {
    color: '#ccc',
    fontSize: 11
  },
  amtWrap: {
    width: '100%',
    display: 'flex',
    marginBottom: 11,
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
  confirmWrap: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    marginTop: 14
  },
  memoWrap: {
    width: '80%',
    marginLeft: '10%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
    marginBottom: 14
  },
  input: {
    height: 50,
    maxHeight: 50,
    flex: 1,
    textAlign: 'center',
    fontSize: 18
  },
  bottom: {
    width: '100%',
    flex: 1,
    maxHeight: 390
  }
})
