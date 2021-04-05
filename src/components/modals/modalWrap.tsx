import React, { useEffect, useState, useLayoutEffect } from 'react'
import { View, StyleSheet, Dimensions, Button, Text } from 'react-native'
import Modal from 'react-native-modal'

import { useTheme } from '../../store'

export default function ModalWrap(props) {
  const theme = useTheme()
  const { visible, onClose, children, noSwipe, animationOutTiming } = props

  const headerHeight = 40

  return (
    <Modal
      isVisible={visible}
      style={{ ...styles.modal, marginTop: headerHeight }}
      onSwipeComplete={() => onClose()}
      swipeDirection={noSwipe ? null : 'down'}
      onBackButtonPress={() => onClose()}
      coverScreen={true}
      animationIn={'slideInUp'}
      animationOut={'slideOutDown'}
      animationOutTiming={animationOutTiming}
      propagateSwipe={props.propagateSwipe ? true : false}
      swipeThreshold={20}
      // useNativeDriver={true}
      // statusBarTranslucent={true}
      // deviceHeight={Dimensions.get('screen').height-142}
    >
      <View style={{ ...styles.main, backgroundColor: theme.bg }}>{children}</View>
    </Modal>
  )
}

ModalWrap.defaultProps = {
  animationOutTiming: 400
}

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    flex: 1
  },
  main: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 5,
    flex: 1,
    width: '100%',
    height: '100%'
  }
})
