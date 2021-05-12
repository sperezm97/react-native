import moment from 'moment'

import { useStores } from '../index'
import { useChats } from './chats'
import config from '../../config'
import { constants } from '../../constants'
import { calendarDate } from '../utils/date'
import { useMsgs } from './msg'

export function useTribes() {
  const { chats, user } = useStores()
  const chatsToShow = useChats()

  const theTribes = allTribes(chats.tribes, chatsToShow, user)

  return theTribes
}

// tribes not joined yet.
export function useSearchTribes(tribes) {
  const { ui } = useStores()

  // tribes = tribes.filter(t => !t.owner).sort((a, b) => a.joined - b.joined)

  tribes = tribes.filter(t => !t.joined)

  return searchTribes(tribes, ui.tribesSearchTerm)
}

export function useJoinedTribes(tribes) {
  return tribes.filter(t => t.joined)
}

export function useOwnedTribes(tribes) {
  // tribes = tribes.filter(t => t.owner)
  tribes = tribes.filter(t => t.joined)

  return tribes.sort((a, b) => {
    if (a.owner > b.owner) return -1
    return 0
  })

  // return tribes.sort((a, b) => {
  //   if (a.joined > b.owner && b.last_active > a.last_active) return -1
  //   return 0
  // })
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
  const lastActiveDate = calendarDate(moment.unix(lastActive), 'MMM DD, YYYY')

  return { createdDate, lastActiveDate }
}

export function useOwnerMediaType(msgs, type, owner = true) {
  return msgs.filter(m => {
    const ownerCriteria = owner ? m.sender === 1 : m.sender !== 1

    return m.type === type && m.status !== constants.statuses.deleted && ownerCriteria
  })
}

// feed from joined tribes
export function useFeed(tribes) {
  tribes = tribes.filter(
    t => t.joined && !t.owner && t.owner_pubkey !== config.inviter.key
  )

  let allTribes = tribes.map(t => processFeed(t, 6))

  let feed = []

  allTribes.map(t => {
    t.media.map(m => {
      feed.push({
        ...m,
        tribe: { ...t }
      })
    })
  })

  feed = feed.sort((a, b) => moment(b.date).unix() - moment(a.date).unix())

  return feed
}

// not used temporarily
export function useMediaType(msgs, type) {
  return msgs.filter(
    m =>
      m.type === type &&
      m.sender !== 1 &&
      m.media_token &&
      m.media_type.startsWith('image')
  )
}

export function useTribeMediaType(msgs, type) {
  return msgs.filter(
    m =>
      m.type === type &&
      m.media_token &&
      m.media_type.startsWith('image') &&
      m.status !== constants.statuses.deleted
  )
}

export function processFeed(tribe, type) {
  let msgs = useMsgs(tribe.chat)

  msgs = msgs.filter(
    m =>
      m.type === type &&
      m.sender !== 1 &&
      m.media_token &&
      m.media_type.startsWith('image')
  )

  tribe.media = msgs

  return tribe
}
