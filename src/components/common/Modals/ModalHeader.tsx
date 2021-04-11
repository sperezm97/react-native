import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import { Appbar, IconButton } from 'react-native-paper'

import { useTheme } from '../../../store'
import Icon from '../Icon'

export default function Header(props) {
  const { title, onClose, leftArrow } = props
  const theme = useTheme()

  return (
    <Appbar.Header style={{ ...styles.appBar, backgroundColor: theme.bg, borderBottomColor: theme.border }}>
      <TouchableOpacity onPress={onClose} style={{ ...styles.left }}>
        {leftArrow && <Icon name='ChevronLeft' size={28} color={theme.icon} />}
      </TouchableOpacity>
      <View>
        <Text style={{ ...styles.title, color: theme.text }}>{title}</Text>
      </View>

      <TouchableOpacity onPress={onClose} style={{ ...styles.right }}>
        {!leftArrow && <Icon name='Close' size={23} color={theme.icon} />}
      </TouchableOpacity>
    </Appbar.Header>

    // <View style={{ ...styles.header, ...(props.background && { backgroundColor: props.background }) }}>
    //   <TouchableOpacity onPress={onClose} style={{ ...styles.left }}>
    //     <Icon name='ChevronLeft' size={28} color={theme.icon} />
    //   </TouchableOpacity>

    //   {/* <View style={styles.headerLefty}>{leftArrow && <IconButton icon='arrow-left' color={theme.icon} size={22} style={{ marginRight: 14, marginTop: 8 }} onPress={() => onClose()} />}</View> */}
    //   <Text style={{ ...styles.headerTitle, color: theme.text }}>{title}</Text>

    //   <TouchableOpacity onPress={onClose} style={{ ...styles.right }}>
    //     {/* <Icon name='Close' size={28} color={theme.icon} /> */}

    //     <IconButton icon={({ size, color }) => <Icon name='Close' size={size} color={color} />} color={theme.icon} size={22} />
    //   </TouchableOpacity>

    //   {/* <View style={styles.headerLefty}>{!leftArrow && <IconButton icon='close' color={theme.icon} size={22} style={{ marginRight: 14, marginTop: 8 }} onPress={() => onClose()} />}</View> */}
    // </View>
  )
}

const styles = StyleSheet.create({
  appBar: {
    elevation: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'relative'
  },
  left: {
    position: 'absolute',
    left: 10
  },
  right: {
    position: 'absolute',
    right: 12
  },
  title: {
    fontSize: 17,
    fontWeight: '500'
  }
})
