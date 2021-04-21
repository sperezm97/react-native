import moment from 'moment'

import { useStores } from '../index'
import { useChats } from './chats'
import { constants } from '../../constants'
import { calendarDate } from '../utils/date'

export function useTribes() {
  const { chats, user } = useStores()
  const chatsToShow = useChats()

  const theTribes = allTribes(chats.tribes, chatsToShow, user)
  return theTribes
}

export function useSearchTribes(tribes) {
  const { ui } = useStores()

  // tribes = tribes.filter(t => !t.joined)

  return searchTribes(tribes, ui.tribesSearchTerm)
}

export function useJoinedTribes(tribes) {
  return tribes.filter(t => t.joined)
}

export function useOwnedTribes(tribes) {
  return tribes.filter(t => t.owner)
}

export function searchTribes(tribes, searchTerm) {
  return tribes.filter(c => {
    if (!searchTerm) return true

    return c.description.toLowerCase().includes(searchTerm.toLowerCase()) || c.name.toLowerCase().includes(searchTerm.toLowerCase())
  })
}

export function allTribes(tribes, chats, user) {
  const chatsuids = chats.map(c => c.uuid)
  const ownedChats = chats.find(c => c.type === constants.chat_types.tribe && c.owner_pubkey === user.publicKey)

  return tribes.map(tribe => {
    return {
      ...tribe,
      chat: chatsuids ? chats.find(c => c.uuid === tribe.uuid) : false,
      joined: chatsuids ? (chatsuids.find(uuid => uuid === tribe.uuid) ? true : false) : false,
      owner: ownedChats ? ([ownedChats].find(c => c.uuid === tribe.uuid) ? true : false) : false
    }
  })
}

export function sortTribes(tribes) {
  return tribes
}

export function useTribeHistory(created, lastActive) {
  const createdDate = calendarDate(moment(created), 'MMM DD, YYYY')
  const lastActiveDate = calendarDate(moment.unix(lastActive))

  return { createdDate, lastActiveDate }
}
