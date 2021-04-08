import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/AntDesign'
import Toast from 'react-native-simple-toast'

import { useStores, useTheme } from '../../store'
import BackHeader from './BackHeader'
import Button from '../common/Button'

export default function Security() {
  const theme = useTheme()
  const navigation = useNavigation()
  const { ui } = useStores()

  return (
    <View style={{ ...styles.wrap, backgroundColor: theme.bg }}>
      <BackHeader title='Security' />
      <View style={styles.box}>
        <View></View>
        <View style={{ ...styles.exportWrap }}>
          <Text style={{ ...styles.exportText, color: theme.text }}>Want to switch devices?</Text>
          <Button accessibilityLabel='onboard-welcome-button' onPress={() => ui.setPinCodeModal(true)} style={{ ...styles.exportBtn, backgroundColor: theme.primary }} size='large'>
            <Text>Export keys</Text>
            <View style={{ width: 12, height: 1 }}></View>
            <Icon name='key' color={theme.white} size={18} />
          </Button>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    flex: 1
  },
  box: {
    flex: 1,
    marginTop: 40,
    paddingRight: 20,
    paddingLeft: 20,
    justifyContent: 'flex-end'
  },
  exportWrap: {
    minHeight: 190,
    display: 'flex',
    justifyContent: 'center',
    paddingTop: 20,
    paddingBottom: 20
  },
  exportText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 14
  },
  exportBtn: {}
})
