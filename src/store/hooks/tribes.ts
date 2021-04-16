import { useStores } from '../index'
import { useChats } from './chats'
import { constants } from '../../constants'

export function useTribes() {
  const { chats, user } = useStores()
  const chatsToShow = useChats()

  const theTribes = allTribes(chats.tribes, chatsToShow, user)
  //   sortTribes(theTribes)
  return theTribes
}

export function useSearchTribes() {
  const { ui } = useStores()
  const tribes = useTribes()

  return searchTribes(tribes, ui.tribesSearchTerm)
}

export function useJoinedTribes(tribes) {
  return tribes.filter(t => t.joined)
}

export function useOwnedTribes(tribes) {
  return tribes.filter(t => t.owner)
}

export function searchTribes(theTribes, searchTerm) {
  return theTribes.filter(c => {
    if (!searchTerm) return true

    return c.description.toLowerCase().includes(searchTerm.toLowerCase()) || c.name.toLowerCase().includes(searchTerm.toLowerCase())
  })
}

export function allTribes(tribes, chats, user) {
  tribes.map(tribe => {
    tribe.joined = false
    tribe.owner = false

    chats.map(c => {
      if (c.uuid === tribe.uuid) {
        tribe.joined = true
      }
      if (c.type === constants.chat_types.tribe && c.owner_pubkey === user.publicKey) {
        tribe.owner = true
      }
    })
  })

  return tribes
}

export function sortTribes(tribes) {
  return tribes
}
