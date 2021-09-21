// import Toast from 'react-native-simple-toast'
// import { contactStore } from './contacts'
import * as e2e from '../../crypto/e2e'
// import { chatStore } from './chats'
// import { userStore } from './user'
import { constants } from '../../constants'
import { Msg, MAX_MSGS_PER_CHAT } from './msg-models'
// import { Msg, MAX_MSGS_PER_CHAT } from './msg'

// export async function encryptText({ contact_id, text }) {
//   if (!text) return ''
//   const contact = contactStore.contacts.find((c) => c.id === contact_id)
//   if (!contact || !contact?.contact_key) return ''
//   const encText = await e2e.encryptPublic(text, contact.contact_key) // contact.contact_key === null
//   return encText
// }

const invalidContactKeyMessage = 'Invalid contact_key value'
const throwInvalidContactKey = () => {
  throw new Error(invalidContactKeyMessage)
}
const isInvalidContactKeyError = (error: Error) => error.name === 'Error' && error.message === invalidContactKeyMessage
// export const showToastIfContactKeyError = (error: Error) => {
//   if (isInvalidContactKeyError(error)) {
//     Toast.showWithGravity(
//       'Contact key missing! Wait until you receive this information from the contact',
//       5,
//       Toast.CENTER
//     )
//   }
// }

// export async function makeRemoteTextMap({ contact_id, text, chat_id }, includeSelf?) {
//   const idToKeyMap = {}
//   const remoteTextMap = {}
//   const chat = chat_id && chatStore.chats.find((c) => c.id === chat_id)
//   const myid = userStore.myid
//   if (chat) {
//     // TRIBE
//     if (chat.type === constants.chat_types.tribe && chat.group_key) {
//       idToKeyMap['chat'] = chat.group_key // "chat" is the key for tribes
//       if (includeSelf) {
//         const me = contactStore.contacts.find((c) => c.id === myid) // add in my own self (for media_key_map)
//         if (me) idToKeyMap[myid] = me?.contact_key ?? ''
//       }
//     } else {
//       // NON TRIBE
//       const contactsInChat = contactStore.contacts.filter((c) => {
//         if (includeSelf) {
//           return chat.contact_ids.includes(c.id)
//         } else {
//           return chat.contact_ids.includes(c.id) && c.id !== myid
//         }
//       })
//       contactsInChat.forEach((c) => (idToKeyMap[c.id] = c?.contact_key ?? ''))
//     }
//   } else {
//     const contact = contactStore.contacts.find((c) => c.id === contact_id)
//     if (contact) idToKeyMap[contact_id] = contact?.contact_key ?? ''
//   }
//   for (let [id, key] of Object.entries(idToKeyMap)) {
//     if (!key) throwInvalidContactKey()
//     const encText = await e2e.encryptPublic(text, String(key))
//     remoteTextMap[id] = encText
//   }
//   return remoteTextMap
// }

export async function decodeSingle(m: Msg) {
  if (m.type === constants.message_types.keysend) {
    return m // "keysend" type is not e2e
  }
  const msg = m
  if (m.message_content) {
    const dcontent = await e2e.decryptPrivate(m.message_content)

    msg.message_content = dcontent as string
  }
  if (m.media_key) {
    const dmediakey = await e2e.decryptPrivate(m.media_key)
    msg.media_key = dmediakey as string
  }
  return msg
}

const typesToDecrypt = [
  constants.message_types.message,
  constants.message_types.invoice,
  constants.message_types.attachment,
  constants.message_types.purchase,
  constants.message_types.purchase_accept,
  constants.message_types.purchase_deny,
  constants.message_types.bot_res,
  constants.message_types.boost,
]
export async function decodeMessages(messages: Msg[]) {
  const msgs = []
  for (const m of messages) {
    if (typesToDecrypt.includes(m.type)) {
      const msg = await decodeSingle(m)
      msgs.push(msg)
    } else {
      msgs.push(m)
    }
  }
  return msgs
}

export function orgMsgs(messages: Msg[]) {
  const orged: { [k: number]: Msg[] } = {}
  messages.forEach((msg) => {
    if (msg.chat_id) {
      putIn(orged, msg, msg.chat_id)
    }
  })
  return orged
}

export function orgMsgsFromExisting(allMsgs: { [k: number]: Msg[] }, messages: Msg[]) {
  const allms: { [k: number]: Msg[] } = JSON.parse(JSON.stringify(allMsgs))

  messages.forEach((msg) => {
    if (msg.chat_id || msg.chat_id === 0) {
      putIn(allms, msg, msg.chat_id) // THIS IS TOO HEAVY in a for each
    }
  })
  // limit to 50 each?
  return allms
}

export function orgMsgsFromRealm(messages: Msg[]) {
  const orged: { [k: number]: Msg[] } = {}
  const uniqueChatId = Array.from(new Set(messages.map((m) => m.chat_id)))

  uniqueChatId.forEach((key: any) => {
    orged[key] = messages.filter((message: any) => message.chat_id === key)
  })
  return orged
}

export function putInReverse(allms, decoded) {
  decoded.forEach((msg) => {
    if (msg.chat_id || msg.chat_id === 0) {
      const chatID = msg.chat_id
      if (allms[chatID]) {
        if (!Array.isArray(allms[chatID])) return
        const idx = allms[chatID].findIndex((m) => m.id === msg.id)
        if (idx === -1 && allms[chatID].length < MAX_MSGS_PER_CHAT) {
          allms[chatID].push(skinny(msg))
        } else {
          allms[chatID][idx] = skinny(msg)
        }
      } else {
        allms[chatID] = [skinny(msg)]
      }
    }
  })
  return allms
}

// Let's add comments to see what the fuck is going on here.
export function putIn(orged, msg, chatID) {
  // Return if no chatID, allowing 0
  if (!(chatID || chatID === 0)) return
  // If the map of chatrooms already has this chatID...
  if (orged[chatID]) {
    // Return if this message isn't an array
    if (!Array.isArray(orged[chatID])) return
    /**
     * "The findIndex() method returns the index of the first element in the array that satisfies the
     * provided testing function. Otherwise, it returns -1, indicating that no element passed the test.""
     * Also - "The findIndex() method executes the callbackFn function once for every index in the array
     * until it finds the one where callbackFn returns a truthy value."
     * So we're using unnecessary iteration to kinda replicate on a map-like object what a map should already do(?)
     * IF THE MESSAGE ISN'T FOUND, IT MEANS IT DID {NUM_MESSAGES} LOOPS - FOR EACH MESSAGE!
     */
    const idx = orged[chatID].findIndex((m) => m.id === msg.id)
    // ID not found, so message is not in this blob of messages
    if (idx === -1) {
      // Add to the beginning of the chat array a skinnier version of this message (no chat obj or remote_message_content)
      orged[chatID].unshift(skinny(msg))
      // If this chatroom now exceeds the number of max_msgs, remove one
      if (orged[chatID].length > MAX_MSGS_PER_CHAT) {
        orged[chatID].pop() // remove the oldest msg if too many
      }
    } else {
      orged[chatID][idx] = skinny(msg)
    }
  } else {
    orged[chatID] = [skinny(msg)]
  }
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}
function chunkArray(arr, len) {
  var chunks = [],
    i = 0,
    n = arr.length
  while (i < n) {
    chunks.push(arr.slice(i, (i += len)))
  }
  return chunks
}

export function skinny(m: Msg): Msg {
  return { ...m, chat: null, remote_message_content: null }
}
