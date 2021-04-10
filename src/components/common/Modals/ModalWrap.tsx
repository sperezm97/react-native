import React from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'
import Modal from 'react-native-modal'

import { useTheme } from '../../../store'

export default function ModalWrap(props) {
  const theme = useTheme()
  const { visible, onClose, noSwipe, swipeDirection, animationOutTiming, coverScreen, fullscreen, animationIn, animationOut, children } = props

  // const h = Dimensions.get('screen').height - headerHeight

  return (
    <Modal
      isVisible={visible}
      style={{ ...styles.modal, justifyContent: fullscreen ? 'center' : 'flex-end' }}
      onSwipeComplete={() => onClose()}
      swipeDirection={noSwipe ? null : swipeDirection}
      onBackButtonPress={() => onClose()}
      animationIn={animationIn}
      animationOut={animationOut}
      animationOutTiming={animationOutTiming}
      propagateSwipe={props.propagateSwipe ? true : false}
      swipeThreshold={20}
      coverScreen={coverScreen}
      // deviceHeight={Dimensions.get('screen').height}
      // useNativeDriver={true}
      // statusBarTranslucent={true}
    >
      <View style={{ ...styles.main, backgroundColor: theme.bg, height: fullscreen ? '100%' : 200, paddingTop: fullscreen ? 45 : 0 }}>{children}</View>
    </Modal>
  )
}

ModalWrap.defaultProps = {
  animationOutTiming: 400,
  animationIn: 'slideInUp',
  animationOut: 'slideOutDown',
  swipeDirection: 'down',
  coverScreen: true,
  fullscreen: true
}

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    flex: 1
  },
  main: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: 'white'
  }
})
