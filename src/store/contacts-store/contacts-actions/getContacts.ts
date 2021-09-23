// @ts-nocheck
// TODO - fix all this after other stores pulled in
import { relay } from 'api'
import { getRoot } from 'mobx-state-tree'
import { RootStore } from 'store'
import { ContactsStore } from '../contacts-store'

export const getContacts = async (self: ContactsStore) => {
  const root = getRoot(self) as RootStore
  const chatStore = root.chats
  const subStore = root.subs
  const userStore = root.user
  try {
    const r = await relay.get('contacts')

    if (!r) return
    if (r.contacts) {
      self.setContacts(r.contacts)
      const me = r.contacts.find((c) => c.is_owner)
      if (me) {
        userStore.setMyID(me.id)
        userStore.setAlias(me.alias)
        userStore.setDeviceId(me.device_id)
        userStore.setPublicKey(me.public_key)
        if (me.tip_amount || me.tip_amount === 0) {
          userStore.setTipAmount(me.tip_amount)
        }
      }
    }

    if (r.chats) chatStore.setChats(r.chats)

    if (r.subscriptions) subStore.setSubs(r.subscriptions)

    return r
  } catch (e) {}
}
