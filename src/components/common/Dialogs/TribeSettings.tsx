import React from 'react'
import { useObserver } from 'mobx-react-lite'
import { IconButton } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import AntDesignIcon from 'react-native-vector-icons/AntDesign'
import FeatherIcon from 'react-native-vector-icons/Feather'

import { useStores, useTheme } from '../../../store'
import Menu from '../ActionSheet/Menu'

export default function TribeSettings({ visible, onCancel, onEditPress, onMembersPress }) {
  const { ui } = useStores()
  const theme = useTheme()
  const navigation = useNavigation()

  const items = [
    {
      title: 'Edit Community',
      thumbIcon: <IconButton icon={({ size, color }) => <AntDesignIcon name='edit' color={color} size={size} />} color={theme.white} size={18} />,
      thumbBgColor: theme.primary,
      action: () => {
        onCancel()
        onEditPress()
        // setTimeout(() => {
        //   ui.setInviteFriendModal(true)
        // }, 400)
      }
    },
    {
      title: 'Memebers',
      thumbIcon: <IconButton icon={({ size, color }) => <FeatherIcon name='users' color={color} size={size} />} color={theme.white} size={18} />,
      thumbBgColor: theme.primary,
      action: () => {
        onCancel()
        onMembersPress()
        // setTimeout(() => {
        //   ui.setAddContactModal(true)
        // }, 400)
      }
    }
  ]

  return useObserver(() => <Menu visible={visible} items={items} onCancel={onCancel} />)
}
