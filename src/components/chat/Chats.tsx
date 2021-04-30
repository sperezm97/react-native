import React from 'react'
import { View, StyleSheet } from 'react-native'
import { useObserver } from 'mobx-react-lite'
import { useNavigation } from '@react-navigation/native'
import { IconButton } from 'react-native-paper'
import AntDesign from 'react-native-vector-icons/AntDesign'

import { useStores, useTheme } from '../../store'
import ChatList from './chatList'
import Search from '../common/Search'
import Header from '../common/Header'
import TabBar from '../common/TabBar'

export default function Chats() {
  const { ui } = useStores()
  const theme = useTheme()

  const onAddFriendPress = () => ui.setAddFriendDialog(true)

  return useObserver(() => (
    <View
      style={{ ...styles.main, backgroundColor: theme.bg }}
      accessibilityLabel='dashboard'
    >
      <Header />
      <View style={{ ...styles.searchWrap }}>
        <Search
          placeholder='Search'
          value={ui.searchTerm}
          onChangeText={txt => {
            ui.setSearchTerm(txt)
          }}
          style={{ width: '88%' }}
        />
        <View style={{ width: '12%' }}>
          <IconButton
            icon={({ size, color }) => (
              <AntDesign name='adduser' color={color} size={size} />
            )}
            color={theme.primary}
            size={22}
            onPress={onAddFriendPress}
          />
        </View>
      </View>
      <ChatList

      // listHeader={<ListHeader />}
      />
      <TabBar />
    </View>
  ))
}

// function ListHeader() {
//   const { ui } = useStores()
//   const theme = useTheme()

//   return (
//     <View style={{ ...styles.searchWrap }}>
//       <Search
//         placeholder='Search'
//         value={ui.searchTerm}
//         onChangeText={txt => {
//           ui.setSearchTerm(txt)
//         }}
//         style={{ width: '88%' }}
//       />
//       <View style={{ width: '12%' }}>
//         <IconButton
//           icon={({ size, color }) => (
//             <AntDesign name='adduser' color={color} size={size} />
//           )}
//           color={theme.primary}
//           size={22}
//           onPress={onAddFriendPress}
//         />
//       </View>
//     </View>
//   )
// }

const styles = StyleSheet.create({
  main: {
    width: '100%',
    flex: 1
  },
  searchWrap: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    // paddingRight: 14,
    paddingLeft: 14,
    paddingBottom: 10
  }
})
