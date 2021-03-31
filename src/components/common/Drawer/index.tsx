import React from 'react'
import { StyleSheet, View, Text, Dimensions, ScrollView } from 'react-native'
import { DrawerContentScrollView } from '@react-navigation/drawer'
import { Title, List, Avatar } from 'react-native-paper'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { useObserver } from 'mobx-react-lite'
import { TouchableOpacity } from 'react-native-gesture-handler'

import { useStores, useTheme } from '../../../store'
import { usePicSrc } from '../../utils/picSrc'
import Balance from '../Balance'

export default function Drawer(props) {
  const { ui, details, user, contacts } = useStores()
  const theme = useTheme()
  const me = contacts.contacts.find(c => c.id === 1)
  const uri = usePicSrc(me)
  const height = Math.round(Dimensions.get('window').height)
  const hasImg = uri ? true : false
  const {
    navigation: { navigate }
  } = props
  const goToDashboardHandler = () => navigate('Dashboard')
  const goToContactsHandler = () => navigate('Contacts')
  const goToProfileHandler = () => navigate('Profile')
  const openSupportModalHandler = () => ui.setSupportModal(true)

  return useObserver(() => (
    <DrawerContentScrollView style={{ ...props.style, backgroundColor: theme.secondary }} {...props}>
      <View style={{ ...styles.container, height: height - 52 }}>
        {/* drawer header */}
        <View style={{ ...styles.drawerHeader, backgroundColor: theme.primary }}>
          <View style={{ ...styles.drawerHeaderContent }}>
            <Avatar.Image source={hasImg ? { uri } : require('../../../../android_assets/avatar.png')} size={45} />
            <View style={styles.userInfo}>
              <Title style={{ ...styles.title, color: theme.white }}>{user.alias}</Title>
              <View style={styles.userBalance}>
                <Balance color={theme.white} style={{ marginRight: 12 }} balance={details.balance} />

                <AntDesign name='wallet' color={theme.grey} size={20} />
              </View>
              <TouchableOpacity style={{ backgroundColor: theme.primary }} onPress={() => ui.setAddSatsModal(true)}>
                <Text style={{ color: 'white', fontSize: 12 }}>ADD SATS</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* drawer list items */}

        <View style={{ ...styles.drawerSection }}>
          <ScrollView>
            <List.Section>
              <List.Item
                title='Dashboard'
                titleStyle={{ color: theme.white }}
                rippleColor={theme.primary}
                left={props => <List.Icon {...props} icon={() => <AntDesign name='message1' color={theme.white} size={25} />} />}
                onPress={goToDashboardHandler}
              />
              <View style={{ ...styles.borderBottom, borderBottomColor: theme.border }} />

              <List.Item
                title='Contacts'
                titleStyle={{ color: theme.white }}
                rippleColor={theme.primary}
                left={props => <List.Icon {...props} icon={() => <MaterialCommunityIcons name='account-multiple' color={theme.white} size={25} />} />}
                onPress={goToContactsHandler}
              />
              <View style={{ ...styles.borderBottom, borderBottomColor: theme.border }} />
              <List.Item
                title='Profile'
                titleStyle={{ color: theme.white }}
                rippleColor={theme.primary}
                left={props => <List.Icon {...props} icon={() => <MaterialCommunityIcons name='account' color={theme.white} size={25} />} />}
                onPress={goToProfileHandler}
              />
            </List.Section>
          </ScrollView>
        </View>

        {/* drawer bottom */}
        <View style={styles.drawerBottom}>
          <View style={{ ...styles.borderTop, borderTopColor: theme.border }} />

          <List.Item
            title='Support'
            titleStyle={{ color: theme.white }}
            rippleColor={theme.primary}
            left={props => <List.Icon {...props} icon={() => <MaterialCommunityIcons name='email' color={theme.white} size={25} />} />}
            onPress={openSupportModalHandler}
          />

          <List.Item
            title='Logout'
            titleStyle={{ color: theme.white }}
            rippleColor={theme.primary}
            left={props => <List.Icon {...props} icon={() => <MaterialCommunityIcons name='logout' color={theme.white} size={25} />} />}
            onPress={openSupportModalHandler}
          />
        </View>
      </View>
    </DrawerContentScrollView>
  ))
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    position: 'relative'
  },
  drawerHeader: {
    paddingLeft: 10,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    position: 'absolute',
    top: -50,
    left: 0,
    right: 0,
    width: '100%'
  },
  drawerHeaderContent: {
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center',
    paddingTop: 80,
    paddingBottom: 40
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: 20
  },
  title: {
    fontWeight: 'bold'
  },
  userBalance: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20
  },
  drawerSection: {
    marginTop: 170,
    maxHeight: '65%',
    flex: 1
  },
  borderBottom: {
    borderBottomWidth: 1,
    opacity: 0.1
  },
  borderTop: {
    borderTopWidth: 1,
    opacity: 0.1
  },
  drawerBottom: {
    display: 'flex'
  }
})
