import React, { useState, useEffect } from 'react'
import { StyleSheet, View, BackHandler, Modal } from 'react-native'
import { TextInput } from 'react-native-paper'

import { useTheme } from '../../../store'
import ModalHeader from '../Modals/ModalHeader'
import QRScanner from './QRScanner'
import Button from '../Button'

export default function QR({ visible, onCancel, onScan, showPaster, inputPlaceholder, isLoopout = false, confirm }) {
  const theme = useTheme()
  const [hasPermission, setHasPermission] = useState(null)
  const [scanned, setScanned] = useState(false)
  const [text, setText] = useState('')

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', function () {
      onCancel()
      return true
    })
  }, [])

  // useEffect(() => {
  //   (async () => {
  //     if(!hasPermission){
  //       const { status } = await BarCodeScanner.requestPermissionsAsync()
  //       if(status==='granted'){
  //         setHasPermission(true)
  //       } else {
  //         onCancel()
  //       }
  //     }
  //   })()
  // }, [])

  function handleBarCodeScanned(data) {
    setScanned(true)

    if (showPaster) {
      setScannedInput(data)
    } else {
      onScan(data)
    }
  }

  function setScannedInput(data) {
    if (isLoopout) {
      if (data.startsWith('bitcoin:')) {
        const arr = data.split(':')
        if (arr.length > 1) setText(arr[1])
      } else {
        setText(data)
      }
    }
    if (data.length === 66) setText(data)
  }

  return (
    <Modal visible={visible} animationType='slide' presentationStyle='pageSheet'>
      <ModalHeader title='Scan QR Code' onClose={onCancel} />
      <View style={{ ...styles.content }}>
        <QRScanner scanned={scanned ? true : false} handleBarCodeScanned={handleBarCodeScanned} />
        {showPaster && (
          <View style={{ ...styles.bottom, backgroundColor: theme.main }}>
            <View style={styles.textInputWrap}>
              <TextInput placeholder={inputPlaceholder} value={text} onChangeText={e => setText(e)} style={{ backgroundColor: theme.main }} underlineColor={theme.border} />
            </View>
            <View style={styles.confirmWrap}>
              {(text ? true : false) && (
                <Button style={styles.confirm} onPress={() => confirm(text)}>
                  CONFIRM
                </Button>
              )}
            </View>
          </View>
        )}
      </View>
    </Modal>
  )
}

QR.defaultProps = {
  inputPlaceholder: 'Enter Address',
  onScan: () => {},
  confirm: () => {}
}

const styles = StyleSheet.create({
  content: {
    flex: 1
  },
  bottom: {
    width: '100%',
    height: 153
  },
  textInputWrap: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
    marginBottom: 15
  },
  confirmWrap: {
    width: '100%',
    display: 'flex',
    alignItems: 'center'
  },
  confirm: {
    width: 160,
    borderRadius: 20
  }
})
