import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Appbar, IconButton } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import { useObserver } from 'mobx-react-lite'
import FeatherIcon from 'react-native-vector-icons/Feather'

import { useStores, useTheme } from '../../store'
import Pushable from '../common/Pushable'
import Typography from '../common/Typography'

export default function Header({}) {
  const navigation = useNavigation()
  const { ui } = useStores()
  const theme = useTheme()

  return useObserver(() => {
    return (
      <Appbar.Header style={{ ...styles.appBar, backgroundColor: theme.bg }}>
        <View style={{ ...styles.flex, ...styles.content }}>
          <View style={{ ...styles.flex, ...styles.left }}>
            <Typography size={24} fw='500'>
              My Communities
            </Typography>
          </View>
          <View style={{ ...styles.flex, ...styles.right }}>
            <IconButton
              icon={() => <FeatherIcon name='search' color={theme.primary} size={18} />}
              size={24}
              style={{ backgroundColor: theme.lightGrey, marginRight: 12 }}
              onPress={() => navigation.navigate('DiscoverTribes' as never)}
            />
            <Pushable onPress={() => ui.setNewTribeModal(true)}>
              <IconButton icon='plus' color={theme.primary} size={24} style={{ backgroundColor: theme.lightGrey }} />
            </Pushable>
          </View>
        </View>
      </Appbar.Header>
    )
  })
}

const styles = StyleSheet.create({
  appBar: {
    elevation: 0,
  },
  flex: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
  },
  content: {
    justifyContent: 'space-between',
    width: '100%',
  },
  left: {
    marginLeft: 10,
  },
  right: {
    marginRight: 2,
  },
})
