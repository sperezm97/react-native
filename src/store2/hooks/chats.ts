import { useState } from 'react'
import moment, { months } from 'moment'

import { useStores } from '../index'
import { DEFAULT_DOMAIN, INVITER_KEY } from 'config'
import { Chat } from '../chats-store'
import { Contact } from '../contacts-store'
import { constants } from '../../constants'

export function useChats() {
  const { chats, msg, contacts, user } = useStores()
  // https://github.com/mobxjs/mobx-state-tree/issues/783#issuecomment-384209309
  const theseChats: Chat[] = Array.from(chats.chats.values())
  const theseContacts: Contact[] = Array.from(contacts.contacts.values())
  const theChats = allChats(theseChats, theseContacts, user.myid)
  const chatsToShow = theChats
  sortChats(chatsToShow, msg.messages)

  return chatsToShow
}

export function useSearchChats(chats) {
  const { ui } = useStores()
  const conversation = constants.chat_types.conversation

  chats = chats.filter((c) => {
    return c.type === conversation && c.name !== 'Zion Root'
  })

  const chatsToShow = searchChats(chats, ui.searchTerm)
  return chatsToShow
}

export function useChatRow(id) {
  const { user, msg } = useStores()
  const myid = user.myid

  const msgs = msg.messages[id || '_']
  const lastMsg = msgs && msgs[0]
  const lastMsgText = lastMessageText(lastMsg, myid)
  const hasLastMsg = lastMsgText ? true : false

  const now = new Date().getTime()
  const lastSeen = msg.lastSeen[id || '_'] || now
  const unseenCount = countUnseen(msgs, lastSeen, myid)
  const hasUnseen = unseenCount > 0 ? true : false

  const lastMsgDate = lastMessageDate(lastMsg)

  return { lastMsgText, lastMsgDate, hasLastMsg, unseenCount, hasUnseen }
}

function lastMessageDate(msg) {
  if (!msg || !msg.date) return ''

  return moment(msg.date).calendar(null, {
    lastDay: '[Yesterday]',
    sameDay: 'hh:mm A',
    nextDay: '[Tomorrow]',
    lastWeek: 'dddd',
    nextWeek: 'dddd',
    sameElse: 'L',
  })
}

function lastMessageText(msg, myid) {
  if (!msg) return ''
  if (msg.type === constants.message_types.bot_res) {
    return msg.sender_alias ? `${msg.sender_alias} says...` : 'Bot Response'
  }
  if (msg.type === constants.message_types.boost) {
    return `Boost: ${msg.amount} sats`
  }
  if (msg.message_content) {
    const verb = msg.sender === myid ? 'shared' : 'received'
    if (msg.message_content.startsWith('giphy::')) return 'GIF ' + verb
    if (msg.message_content.startsWith('clip::')) return 'Clip ' + verb
    if (msg.message_content.startsWith('boost::')) return 'Boost ' + verb
    if (msg.message_content.startsWith(`${DEFAULT_DOMAIN}://?action=tribe`)) return 'Tribe Link ' + verb
    if (msg.message_content.startsWith('https://jitsi.sphinx.chat/')) return 'Join Call'
    return msg.message_content
  }
  if (msg.amount) {
    const kind = msg.type === constants.message_types.invoice ? 'Invoice' : 'Payment'
    if (msg.sender === myid) return `${kind} Sent: ${msg.amount} sat`
    return `${kind} Received: ${msg.amount} sat`
  }
  if (msg.media_token && msg.media_type) {
    const mediaType = msg.media_type
    let fileType = 'File'
    if (mediaType.startsWith('video')) fileType = 'Video'
    if (mediaType.startsWith('image')) fileType = 'Picture'
    if (mediaType.startsWith('audio')) fileType = 'Audio'
    if (msg.sender === myid) return fileType + ' Sent'
    return fileType + ' Received'
  }
  return ''
}

function countUnseen(msgs, lastSeen: number, myid: number): number {
  if (!msgs) return 0
  let unseenCount = 0
  msgs.forEach((m) => {
    if (m.sender !== myid) {
      const unseen = moment(new Date(lastSeen)).isBefore(moment(m.date))
      if (unseen) unseenCount += 1
    }
  })
  return Math.min(unseenCount, 99)
}

const conversation = constants.chat_types.conversation
const group = constants.chat_types.conversation
const expiredInvite = constants.invite_statuses.expired

export function allChats(chats: Chat[], contacts: Contact[], myid: number): Chat[] {
  const groupChats = chats.filter((c) => c.type !== conversation).map((c) => ({ ...c }))
  const conversations = []

  contacts.forEach((contact) => {
    if (contact.id !== myid && !contact.from_group) {
      const chatForContact = chats.find((c) => {
        return c.type === conversation && c.contact_ids.includes(contact.id)
      })
      if (chatForContact) {
        // add in name = contact.name
        conversations.push({ ...chatForContact, name: contact.alias })
      } else {
        conversations.push({
          // "fake" chat (first)
          name: contact.alias,
          photo_url: contact.photo_url,
          updated_at: new Date().toJSON(),
          contact_ids: [myid, contact.id],
          invite: contact.invite,
          type: conversation,
        })
      }
    }
  })
  const convs = conversations.filter((c) => !(c.invite && c.invite.status === expiredInvite))
  const all = groupChats.concat(convs)
  return all
}

export function contactForConversation(chat: Chat, contacts: Contact[], myid: number) {
  if (chat && chat.type === conversation) {
    const cid = chat.contact_ids.find((id) => id !== myid)
    return contacts.find((c) => c.id === cid)
  }
  return null
}

export function sortChats(chatsToShow, messages) {
  console.tron.display({
    name: 'sortChats',
    preview: `Starting to sort ${chatsToShow.length} chats and ${messages.length} messages`,
    value: { chatsToShow, messages },
  })
  chatsToShow.sort((a, b) => {
    const amsgs = messages[a.id]
    const alastMsg = amsgs && amsgs[0]
    const then = moment(new Date()).add(-30, 'days')
    const adate = alastMsg && alastMsg.date ? moment(alastMsg.date) : then
    const bmsgs = messages[b.id]
    const blastMsg = bmsgs && bmsgs[0]
    const bdate = blastMsg && blastMsg.date ? moment(blastMsg.date) : then
    return adate.isBefore(bdate) ? 0 : -1
  })
  chatsToShow.sort((a) => {
    if (a.invite && a.invite.status !== 4) return -1
    return 0
  })
}

export function searchChats(theChats, searchTerm) {
  return theChats.filter((c) => {
    if (!searchTerm) return true
    return (c.invite ? true : false) || c.name.toLowerCase().includes(searchTerm.toLowerCase())
  })
}
