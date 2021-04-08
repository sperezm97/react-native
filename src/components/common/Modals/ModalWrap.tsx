import React from 'react'
import { View, StyleSheet } from 'react-native'
import Modal from 'react-native-modal'

import { useTheme } from '../../../store'

export default function ModalWrap(props) {
  const theme = useTheme()
  const { visible, onClose, children, noSwipe, animationOutTiming, nopad, fullscreen } = props

  return (
    <Modal
      isVisible={visible}
      style={{ ...styles.modal, marginTop: fullscreen ? 0 : 90 }}
      onSwipeComplete={() => onClose()}
      swipeDirection={noSwipe ? null : 'down'}
      onBackButtonPress={() => onClose()}
      animationIn={'slideInUp'}
      animationOut={'slideOutDown'}
      animationOutTiming={animationOutTiming}
      propagateSwipe={props.propagateSwipe ? true : false}
      swipeThreshold={20}
      coverScreen={false}
      // statusBarTranslucent={true}
      // deviceHeight={Dimensions.get('screen').height - 142}
      // useNativeDriver={true}
    >
      <View style={{ ...styles.main, backgroundColor: theme.bg, paddingTop: nopad ? 0 : 15 }}>{children}</View>
    </Modal>
  )
}

ModalWrap.defaultProps = {
  animationOutTiming: 400,
  fullscreen: false
}

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    flex: 1
  },
  main: {
    flex: 1,
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  }
})
