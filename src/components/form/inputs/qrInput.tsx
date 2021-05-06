import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { IconButton, TextInput } from 'react-native-paper'
import Clipboard from '@react-native-community/clipboard'
import Toast from 'react-native-simple-toast'
import { TouchableOpacity } from 'react-native-gesture-handler'

import { useTheme } from '../../../store'
import { TOAST_DURATION } from '../../../constants'
import QR from '../../common/Accessories/QR'
import PublicKey from '../../common/Modals/PublicKey'
import Typography from '../../common/Typography'

export default function QrInput({
  name,
  label,
  required,
  handleChange,
  handleBlur,
  setValue,
  value,
  displayOnly,
  accessibilityLabel
}) {
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
    <>
      <Typography style={{ marginBottom: 16 }} size={14}>
        {lab}
      </Typography>
      <View style={{ ...styles.inputWrap }}>
        {displayOnly ? (
          <TouchableOpacity activeOpacity={0.6} onPress={() => copyAddress(value)}>
            <TextInput
              editable={false}
              disabled={true}
              accessibilityLabel={accessibilityLabel}
              onChangeText={handleChange(name)}
              onBlur={handleBlur(name)}
              value={value}
              style={{ ...styles.input, backgroundColor: theme.bg }}
              underlineColor={theme.border}
            />
          </TouchableOpacity>
        ) : (
          <TextInput
            accessibilityLabel={accessibilityLabel}
            onChangeText={handleChange(name)}
            onBlur={handleBlur(name)}
            value={value}
            style={{ ...styles.input, backgroundColor: theme.bg }}
            underlineColor={theme.border}
          />
        )}

        <IconButton
          icon={displayOnly ? 'qrcode' : 'qrcode-scan'}
          color={theme.primary}
          size={displayOnly ? 26 : 22}
          style={{ ...styles.icon }}
          onPress={() => setScanning(true)}
        />
      </View>

      <QR
        visible={scanning && !displayOnly}
        onCancel={() => setScanning(false)}
        onScan={data => scan(data)}
        showPaster={false}
      />

      <PublicKey
        visible={scanning && displayOnly}
        pubkey={value}
        close={() => setScanning(false)}
      />
    </>
  )
}

const styles = StyleSheet.create({
  inputWrap: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 26,
    width: '100%'
  },
  input: {
    display: 'flex',
    position: 'relative',
    width: '100%',
    height: 50,
    paddingRight: 40,
    textAlign: 'auto'
  },
  icon: {
    position: 'absolute',
    top: 0,
    right: 0
  }
})
