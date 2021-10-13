import moment from 'moment'

import { useStores } from 'store'
import { useChats } from './chats'
import { INVITER_KEY } from 'config'
import { constants } from '../../constants'
import { calendarDate } from 'store/utils/date'
import { useMsgs } from './msg'
import { Msg } from '../msg-store'
import { display } from 'lib/logging'

export function useTribes() {
  const { chats, user } = useStores()
  const chatsToShow = useChats()

  const theTribes = allTribes(chats.tribes, chatsToShow, user)

  display({
    name: 'useTribes',
    important: true,
    value: { theTribes },
  })

  return theTribes
}

// tribes not joined yet.
export function useSearchTribes(tribes) {
  const { ui } = useStores()

  // tribes = tribes.filter(t => !t.owner).sort((a, b) => a.joined - b.joined)
  tribes = tribes.filter((t) => !t.joined).sort((a) => (!a.img ? 1 : -1))

  const theSearchTribes = searchTribes(tribes, ui.tribesSearchTerm)

  display({
    name: 'useTribes',
    important: true,
    value: { theSearchTribes },
  })

  return theSearchTribes
}

export function useJoinedTribes(tribes) {
  display({
    name: 'useJoinedTribes',
    important: true,
  })
  return tribes.filter((t) => t.joined)
}

export function useOwnedTribes(tribes) {
  // tribes = tribes.filter(t => t.owner)
  tribes = tribes.filter((t) => t.joined)
  display({
    name: 'useOwnedTribes',
    important: true,
  })
  return useSortTribesByLastMsg(tribes)

  // return tribes.sort((a, b) => {
  //   if (a.joined > b.owner && b.last_active > a.last_active) return -1
  //   return 0
  // })
}

function useSortTribesByLastMsg(tribesToShow) {
  const {
    msg: { messages, msgsForChatroom },
  } = useStores()

  display({
    name: 'useSortTribesByLastMsg',
    important: true,
  })

  return tribesToShow.sort((a, b) => {
    // const amsgs = messages[a.chat.id]
    const amsgs = msgsForChatroom(a.chat.id)
    const alastMsg = amsgs?.[0]
    const then = moment(new Date()).add(-30, 'days')
    const adate = alastMsg?.date ? moment(alastMsg.date) : then
    // const bmsgs = messages[b.chat.id]
    const bmsgs = msgsForChatroom(b.chat.id)
    const blastMsg = bmsgs?.[0]
    const bdate = blastMsg?.date ? moment(blastMsg.date) : then
    return adate.isBefore(bdate) ? 0 : -1
  })
}

export function searchTribes(tribes, searchTerm) {
  display({
    name: 'searchTribes',
    value: { searchTerm },
    important: true,
  })
  return tribes.filter((c) => {
    if (!searchTerm) return true

    return (
      c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })
}

export function allTribes(tribes, chats, user) {
  const chatsuids = chats.map((c) => c.uuid)
  const ownedChats = chats.filter(
    (c) => c.type === constants.chat_types.tribe && c.owner_pubkey === user.publicKey
  )

  const tribesArray: any[] = Array.from(tribes)

  display({
    name: 'allTribes',
    important: true,
    value: { tribesArray },
  })

  return tribesArray.map((tribe) => {
    return {
      ...tribe,
      chat: chatsuids && chats.find((c) => c.uuid === tribe.uuid),
      joined: chatsuids ? chatsuids.some((uuid) => uuid === tribe.uuid) : false,
      owner: ownedChats ? ownedChats.some((c) => c.uuid === tribe.uuid) : false,
    }
  })
}

export function sortTribes(tribes) {
  display({
    name: 'sortTribes',
    preview: 'DOES NOTHING',
    important: true,
  })
  return tribes
}

export function useTribeHistory(created, lastActive) {
  const createdDate = calendarDate(moment(created), 'MMM DD, YYYY')
  const lastActiveDate = calendarDate(moment.unix(lastActive), 'MMM DD, YYYY')

  display({
    name: 'useTribeHistory',
    important: true,
  })

  return { createdDate, lastActiveDate }
}

/**
 * This function will filter msgs based on some criteria
 *
 * Filter criteria
 * - `matchTypeMessage` = Should have same type as required on param
 * - `ownerCriteria` = The owner of the message should be the owner of tribe
 * - `messageWithValidStatus` = Prevent deleted messages to be displayed
 * @todo as seen this only has been used in one component, i think we should make it specific to
 * ony the covered cases
 */
export function useOwnerMediaType(msgs, tribe, type, myId): Array<Msg> {
  display({
    name: 'useOwnerMediaType',
    value: { msgs, tribe, type, myId },
    important: true,
  })

  return msgs.filter((m: Msg) => {
    const matchTypeMessage = m.type === type
    const messageWithValidStatus = m.status !== constants.statuses.deleted

    let ownerCriteria = false
    if (tribe.owner) {
      ownerCriteria = m.sender === myId
    } else {
      // if not owener id will not work.
      // depend on sender alias
      // ownerCriteria
      ownerCriteria = m.sender_alias === tribe.owner_alias
    }

    return matchTypeMessage && messageWithValidStatus && ownerCriteria
  })
}

// feed from joined tribes
export function useFeed(tribes, myid) {
  const tribesArray: any[] = Array.from(tribes.values())
  const filteredTribesArray = tribesArray.filter(
    (t) => t.joined && !t.owner && t.owner_pubkey !== INVITER_KEY
  )

  let allTribes = filteredTribesArray.map((t) => processFeed(t, 6, myid))

  let feed = []

  display({
    name: 'useFeed',
    value: { allTribes },
    important: true,
  })

  allTribes.map((t) => {
    t.media.map((m) => {
      feed.push({
        ...m,
        tribe: { ...t },
      })
    })
  })

  feed = feed.sort((a, b) => moment(b.date).unix() - moment(a.date).unix())

  return feed
}

// not used temporarily
export function useMediaType(msgs, type, myid) {
  display({
    name: 'useMediaType',
    important: true,
  })
  return msgs.filter(
    (m) => m.type === type && m.sender !== myid && m.media_token && m.media_type.startsWith('image')
  )
}

export function useTribeMediaType(msgs, type) {
  display({
    name: 'useTribeMediaType',
    important: true,
  })
  return msgs.filter(
    (m) =>
      m.type === type &&
      m.media_token &&
      m.media_type.startsWith('image') &&
      m.status !== constants.statuses.deleted
  )
}

export function processFeed(tribe, type, myid) {
  // TODO: Fix this eslint disable
  // eslint-disable-next-line react-hooks/rules-of-hooks
  let msgs = useMsgs(tribe.chat)

  display({
    name: 'processFeed',
    value: `LOOP THROUGH ${msgs.length} MSGS`,
    important: true,
  })

  msgs = msgs.filter(
    (m) =>
      m.type === type &&
      m.sender !== myid &&
      m.media_token &&
      m.media_type.startsWith('image') &&
      m.status !== constants.statuses.deleted
  )

  tribe.media = msgs

  return tribe
}
