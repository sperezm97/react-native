import React, { useState } from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import { IconButton, TextInput } from 'react-native-paper'
import Clipboard from '@react-native-community/clipboard'
import Toast from 'react-native-simple-toast'

import { useTheme } from '../../../store'
import { TOAST_DURATION } from '../../../constants'
import QR from '../../common/Accessories/QR'
import PublicKey from '../../common/Modals/PublicKey'

export default function QrInput({ name, label, required, handleChange, handleBlur, setValue, value, displayOnly, accessibilityLabel }) {
  const theme = useTheme()

  const [scanning, setScanning] = useState(false)
  function scan(data) {
    setValue(data)
    setScanning(false)
  }

  let lab = `${label.en}${required ? ' *' : ''}`
  if (displayOnly) lab = label.en

  function copyAddress(value) {
    Clipboard.setString(value)
    Toast.showWithGravity('Address copid to clipboard', TOAST_DURATION, Toast.CENTER)
  }

  return (
    <View>
      <Text style={{ marginBottom: 16, color: theme.text }}>{lab}</Text>
      <View style={{ ...styles.inputWrap }}>
        {displayOnly ? (
          <View
            style={{
              ...styles.inputStyles,
              backgroundColor: theme.main,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <TouchableOpacity onPress={() => copyAddress(value)}>
              <Text numberOfLines={1} ellipsizeMode='tail' style={{ color: theme.placeholder }}>
                {value}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TextInput
            accessibilityLabel={accessibilityLabel}
            disabled={displayOnly}
            onChangeText={handleChange(name)}
            onBlur={handleBlur(name)}
            value={value}
            style={{ ...styles.inputStyles, backgroundColor: theme.main }}
            placeholderTextColor={theme.subtitle}
            underlineColor={theme.border}
          />
        )}

        <IconButton icon={displayOnly ? 'qrcode' : 'qrcode-scan'} color={theme.primary} size={26} style={{ width: '10%' }} onPress={() => setScanning(true)} />
      </View>

      <QR visible={scanning && !displayOnly} onCancel={() => setScanning(false)} onScan={data => scan(data)} showPaster={false} />

      <PublicKey visible={scanning && displayOnly} pubkey={value} close={() => setScanning(false)} />
    </View>
  )
}

const styles = StyleSheet.create({
  inputWrap: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 26
  },
  inputStyles: {
    display: 'flex',
    flex: 1,
    height: 50,
    width: '100%',
    paddingLeft: 6,
    paddingRight: 6
  }
})
