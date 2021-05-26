import React from 'react'
import { View, StyleSheet } from 'react-native'

import { useTheme } from '../../store'
import CustomIcon from '../utils/customIcons'
import Typography from '../common/Typography'
import AvatarsRow from '../chat/msg/avatarsRow'

export default function BoostRow(props) {
  const theme = useTheme()
  const isMe = props.sender === 1

  const theBoosts = []
  if (props.boosts) {
    props.boosts.forEach(b => {
      if (
        !theBoosts.find(
          bb => (bb.sender_alias || bb.sender) === (b.sender_alias || b.sender)
        )
      ) {
        theBoosts.push(b)
      }
    })
  }

  const hasBoosts = theBoosts ? true : false

  return (
    <View style={{ ...styles.wrap }}>
      <View style={{ ...styles.left, paddingRight: 8 }}>
        <View style={{ ...styles.rocketWrap, backgroundColor: theme.primary }}>
          <CustomIcon color='white' size={15} name='fireworks' />
        </View>
        <Typography color={theme.text} style={{ ...styles.amt }}>
          {props.boosts_total_sats}
        </Typography>
        <Typography color={theme.subtitle} style={{ ...styles.sats }}>
          sats
        </Typography>
      </View>
      <View style={{ ...styles.right, paddingRight: 5 }}>
        {hasBoosts && (
          <AvatarsRow
            aliases={theBoosts.map(b => {
              if (b.sender === 1) return props.myAlias || 'Me'
              return b.sender_alias
            })}
            borderColor={theme.border}
          />
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  left: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  right: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  rocketWrap: {
    height: 17,
    width: 17,
    borderRadius: 3,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  amt: {
    marginLeft: 6,
    fontSize: 10
  },
  sats: {
    marginLeft: 4,
    fontSize: 10
  }
})