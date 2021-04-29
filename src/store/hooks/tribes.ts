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

  tribes = tribes.filter(t => !t.owner)

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

    return (
      c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })
}

export function allTribes(tribes, chats, user) {
  const chatsuids = chats.map(c => c.uuid)
  const ownedChats = chats.filter(
    c => c.type === constants.chat_types.tribe && c.owner_pubkey === user.publicKey
  )

  return tribes.map(tribe => {
    return {
      ...tribe,
      chat: chatsuids && chats.find(c => c.uuid === tribe.uuid),
      joined: chatsuids
        ? chatsuids.find(uuid => uuid === tribe.uuid)
          ? true
          : false
        : false,
      owner: ownedChats
        ? ownedChats.find(c => c.uuid === tribe.uuid)
          ? true
          : false
        : false
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

export function useOwnerMediaType(msgs, type) {
  return msgs.filter(m => m.type === type && m.sender === 1)
}

// feed from joined tribes
// feed is sorted based on last active
export function useFeed(tribes) {
  tribes.filter(t => t.joined)

  return tribes.sort((a, b) => {
    if (a.last_active > b.last_active) return -1
    return 0
  })
}

export function useMediaType(msgs, type) {
  // TODO // m.media_type.startsWith('image') is temporarily
  return msgs.filter(
    m => m.type === type && m.media_token && m.media_type.startsWith('image')
  )
}

// b.last_active - a.last_active)

// last_active
