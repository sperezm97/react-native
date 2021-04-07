import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { RadioButton } from 'react-native-paper'

import { useStores, useTheme } from '../../store'
import TabBar from '../common/TabBar'
import Header from '../common/Header'

export default function Network() {
  const [value, setValue] = React.useState('first')

  const theme = useTheme()

  return (
    <View style={{ ...styles.wrap, backgroundColor: theme.main }}>
      {/* <Header /> */}
      <View style={{ flex: 1 }}>
        <View style={{ ...styles.box, backgroundColor: theme.bg }}>
          <RadioButton.Group onValueChange={value => setValue(value)} value={value}>
            <RadioButton.Item label='Dark' value='dark' />
            <RadioButton.Item label='Light' value='light' />
            <RadioButton.Item label='System' value='system' />
          </RadioButton.Group>
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
    marginTop: 20
  }
})
