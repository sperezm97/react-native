import React from 'react'
import { StyleSheet, View, Keyboard, InputAccessoryView as ReactInputAccessoryView } from 'react-native'

import { useTheme } from '../../../store'
import Button from '../Button'

export default function InputAccessoryView(props) {
  const { nativeID, cancelText, doneText, cancel, done } = props
  const theme = useTheme()

  function _cancel() {
    Keyboard.dismiss()
    if (cancel === 'function') {
      return cancel()
    }
  }

  function _done() {
    Keyboard.dismiss()
    if (done === 'function') {
      return done()
    }
  }

  return (
    <ReactInputAccessoryView nativeID={nativeID} backgroundColor={theme.bg}>
      <View style={styles.btnWrap}>
        <Button onPress={_cancel} size='small' style={{ ...styles.button, width: '70%' }} color={theme.bg}>
          {cancelText}
        </Button>
        <Button onPress={_done} size='small' style={{ ...styles.button, width: '30%' }}>
          {doneText}
        </Button>
      </View>
    </ReactInputAccessoryView>
  )
}

InputAccessoryView.defaultProps = {
  doneText: 'Done',
  cancelText: 'Cancel'
}

const styles = StyleSheet.create({
  btnWrap: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  button: {}
})
