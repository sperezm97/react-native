import { useStores } from '../index'
import { useChats } from './chats'
import { constants } from '../../constants'

export function useTribes() {
  const { chats, user } = useStores()
  const chatsToShow = useChats()

  const theTribes = allTribes(chats.tribes, chatsToShow, user)
  return theTribes
}

export function useSearchTribes(tribes) {
  const { ui } = useStores()

  return searchTribes(tribes, ui.tribesSearchTerm)
}

export function useJoinedTribes(tribes) {
  return tribes.filter(t => t.joined)
}

export function useOwnedTribes(tribes) {
  // tribes.map(t => console.log('s', t.owner))

  return tribes.filter(t => t.owner)
}

export function searchTribes(tribes, searchTerm) {
  return tribes.filter(c => {
    if (!searchTerm) return true

    return c.description.toLowerCase().includes(searchTerm.toLowerCase()) || c.name.toLowerCase().includes(searchTerm.toLowerCase())
  })
}

// tribes.map(tribe => {
//   tribe.joined = false
//   tribe.owner = false

// chats.map(c => {
//   if (c.uuid === tribe.uuid) {
//     tribe.joined = true
//   }
//   if (c.type === constants.chat_types.tribe && c.owner_pubkey === user.publicKey) {
//     // console.log('c.owner_pubkey', c.owner_pubkey, 'user.publicKey', user.publicKey)

//     tribe.owner = true
//   }
// })

export function allTribes(tribes, chats, user) {
  const merged = tribes.map((tribe, index) => {
    // let joined = chats.find(c => c.uuid === tribe.uuid)
    // let owner = chats.find(c => c.type === constants.chat_types.tribe && c.owner_pubkey === user.publicKey)

    // console.log('joined', joined)
    // console.log('owner', owner)

    let joined = false
    let owner = false
    chats.map(c => {
      if (c.uuid === tribe.uuid) {
        joined = true
      }
      if (c.type === constants.chat_types.tribe && c.owner_pubkey === user.publicKey) {
        owner = true
      }
    })

    return {
      ...tribe,
      joined,
      owner
    }
  })

  return merged
}

export function sortTribes(tribes) {
  return tribes
}
