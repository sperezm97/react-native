import React from 'react'
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { observer } from 'mobx-react-lite'
import { styles } from 'components/chat/inviteRow'
import Avatar from 'components/common/Avatar'
import Typography from 'components/common/Typography'
import { useChatPicSrc } from 'components/utils/picSrc'
import { useChatRow, useStores, useTheme } from 'store'

export const ChatRow = observer((props: any) => {
  const { name } = props
  const navigation = useNavigation()
  const { msg } = useStores()
  const theme = useTheme()

  const onSeeChatHandler = () => {
    msg.seeChat(props.id)
    msg.getMessages()
    navigation.navigate('Chat' as never, { ...props } as never)
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  let uri = useChatPicSrc(props)

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { lastMsgText, lastMsgDate, hasLastMsg, unseenCount, hasUnseen } = useChatRow(props.id)

  const w = Math.round(Dimensions.get('window').width)
  return (
    <TouchableOpacity
      style={{
        ...styles.chatRow,
        backgroundColor: theme.main,
      }}
      activeOpacity={0.5}
      onPress={onSeeChatHandler}
    >
      <View style={styles.avatarWrap}>
        <Avatar alias={name} photo={uri && uri} size={50} aliasSize={18} big />
      </View>
      <View style={{ ...styles.chatContent }}>
        <View style={styles.top}>
          <Typography size={16} fw='500'>
            {name}
          </Typography>
          <Typography size={13} style={{ ...styles.chatDate }} color={theme.subtitle}>
            {lastMsgDate}
          </Typography>
        </View>
        <View style={styles.bottom}>
          {hasLastMsg && (
            <Typography
              numberOfLines={1}
              color={theme.subtitle}
              fw={hasUnseen ? '500' : '400'}
              size={13}
              style={{
                maxWidth: w - 150,
              }}
            >
              {lastMsgText}
            </Typography>
          )}
          {hasUnseen ? (
            <View style={{ ...moreStyles.badge, backgroundColor: theme.green }}>
              <Typography color={theme.white} size={12}>
                {unseenCount}
              </Typography>
            </View>
          ) : null}
        </View>
        <View style={{ ...styles.borderBottom, borderBottomColor: theme.border }} />
      </View>
    </TouchableOpacity>
  )
})

const moreStyles = StyleSheet.create({
  buttonsWrap: {
    marginTop: 40,
    marginBottom: 25,
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
  },
  badgeWrap: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  badge: {
    width: 22,
    height: 22,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    marginRight: 14,
  },
})
