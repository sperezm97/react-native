import React, { useState } from 'react'
import { View, StyleSheet, Dimensions, Text, KeyboardAvoidingView } from 'react-native'
import { TextInput, Button } from 'react-native-paper'

import Scanner from '../../utils/scanner'
import { useTheme } from '../../../store'

export default function Scan({ pay, loading, isLoopout, error }) {
  const theme = useTheme()
  const [addy, setAddy] = useState('')
  const [focused, setFocused] = useState(false)
  function scanned({ type, data }) {
    if (isLoopout) {
      if (data.startsWith('bitcoin:')) {
        const arr = data.split(':')
        if (arr.length > 1) setAddy(arr[1])
      } else {
        setAddy(data)
      }
    }
    if (data.length === 66) setAddy(data)
  }
  const w = Dimensions.get('screen').width
  const h = Dimensions.get('screen').height
  const headerHeight = 50

  const boxHeight = h
  const hasAddy = addy ? true : false

  return (
    <View style={{ ...styles.wrap, height: h - 126 }}>
      <View style={styles.content}>
        <View style={{ ...styles.scannerWrap, width: w, height: boxHeight, maxWidth: w, maxHeight: boxHeight }}>
          <Scanner height={w} scanned={hasAddy} handleBarCodeScanned={scanned} />
        </View>
        {(error ? true : false) && (
          <View style={styles.errorWrap}>
            <Text style={{ color: theme.error, ...styles.error }}>{error}</Text>
          </View>
        )}
        {/* <KeyboardAvoidingView style={{ flex: 1 }} behavior='padding' keyboardVerticalOffset={headerHeight}> */}
        <View style={styles.inputWrap}>
          <TextInput
            label={isLoopout ? 'Scan or Enter Bitcoin Address' : 'Scan or Enter Public Key'}
            style={{ ...styles.input, backgroundColor: theme.bg }}
            onChangeText={e => setAddy(e)}
            value={addy}
            onBlur={() => setFocused(false)}
            onFocus={() => setFocused(true)}
          />
        </View>
        {/* </KeyboardAvoidingView> */}
        {!focused && hasAddy && (
          <View style={styles.confirmWrap}>
            <Button style={styles.confirm} loading={loading} onPress={() => pay(addy)} mode='contained' dark={true}>
              CONFIRM
            </Button>
          </View>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    width: '100%',
    position: 'relative'
  },
  content: {
    flex: 1,
    width: '100%',
    position: 'relative'
  },
  scannerWrap: {
    flex: 1,
    width: '100%',
    overflow: 'hidden'
  },
  labelWrap: {
    width: '100%',
    height: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  inputWrap: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    height: 150
  },
  input: {
    height: 60,
    maxHeight: 60,
    flex: 1
  },
  confirmWrap: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  confirm: {
    backgroundColor: '#6289FD',
    height: 35,
    width: 150,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20
  },
  errorWrap: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    marginBottom: 20
  },
  error: {}
})
