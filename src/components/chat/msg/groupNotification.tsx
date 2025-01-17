import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

import { useStores, useTheme } from '../../../store'
import { constants } from '../../../constants'
import Typography from '../../common/Typography'

export default function GroupNotification(props) {
  const { contacts } = useStores()
  const theme = useTheme()

  let senderAlias = 'Unknown'
  if (props.isTribe) {
    senderAlias = props.sender_alias
  } else {
    const sender = contacts.contacts.find((c) => c.id === props.sender)
    senderAlias = sender && sender.alias
  }

  const isJoin = props.type === constants.message_types.group_join

  return (
    <View style={styles.wrap}>
      <View
        style={{
          ...styles.content,
          backgroundColor: theme.main,
        }}
      >
        <Typography size={12} color={theme.subtitle}>
          {`${senderAlias} has ${isJoin ? 'joined' : 'left'} the group`}
        </Typography>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'relative',
    height: 22,
    width: '100%',
    marginTop: 30,
  },
  content: {
    paddingLeft: 16,
    paddingRight: 16,
    borderRadius: 15,
  },
})
