import React from 'react'
import { StyleSheet, View } from 'react-native'
import { useObserver } from 'mobx-react-lite'
import { useNavigation } from '@react-navigation/native'
import AntDesignIcon from 'react-native-vector-icons/AntDesign'

import { useTheme, hooks } from '../../store'
import { useOwnedTribes } from '../../store/hooks/tribes'
import Typography from '../common/Typography'
import Button from '../common/Button'
import List from './List'

const { useTribes } = hooks

export default function OwnedTribes() {
  const theme = useTheme()

  return useObserver(() => {
    const tribes = useTribes()
    const tribesToShow = useOwnedTribes(tribes)

    return (
      <View style={{ ...styles.wrap, backgroundColor: theme.bg }}>
        <View style={styles.content}>
          <List data={tribesToShow} listHeader={<ListHeader />} />
        </View>
      </View>
    )
  })
}

function ListHeader() {
  const theme = useTheme()
  const navigation = useNavigation()

  const discoverTribesPress = () => navigation.navigate('DiscoverTribes')

  return (
    <>
      <View style={{ ...styles.buttonWrap }}>
        <Button icon={() => <AntDesignIcon name='find' color={theme.icon} size={18} />} color={theme.special} w={140} size='small' fs={12} onPress={discoverTribesPress}>
          Discover
        </Button>
      </View>
      {/* <View style={{ ...styles.headerWrap }}>
        <Typography size={18}>My Communities</Typography>
      </View> */}
    </>
  )
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1
  },
  content: {
    flex: 1
  },
  buttonWrap: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 14,
    paddingTop: 6,
    paddingBottom: 8
  },
  headerWrap: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 14,
    paddingLeft: 14
  }
})
