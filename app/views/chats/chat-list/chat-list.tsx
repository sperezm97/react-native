import React from 'react'
import { FlatList, Text, View } from 'react-native'
import { observer } from 'mobx-react-lite'
import { rando } from 'lib/utils'
import { useStores } from 'store'
import { ChatRow } from '../chat-row'

export const ChatList = observer(() => {
  const { chats, user } = useStores()
  const chatsToShow = chats.chatsArray
  const myid = user.myid
  // console.tron.log(chats)

  const renderItem: any = ({ item, index }) => {
    const chatID = (item.id || rando()) + ''
    // let showInvite = false
    // if (item.invite && item.invite.status !== 4) showInvite = true
    // if (showInvite) return <InviteRow key={`invite_${index}`} {...item} />
    return <ChatRow key={chatID} {...item} />
  }

  return (
    <View style={{ width: '100%', flex: 1 }} accessibilityLabel='chatlist'>
      <FlatList<any>
        data={chatsToShow}
        renderItem={renderItem}
        keyExtractor={(item) => {
          if (!item.id) {
            const contact_id = item.contact_ids.find((id) => id !== myid)
            return 'contact_' + String(contact_id)
          }
          return String(item.id)
        }}
        // refreshControl={<RefreshLoading refreshing={refreshing} onRefresh={onRefresh} />}
        // ListHeaderComponent={props.listHeader}
      />
    </View>
  )
})
