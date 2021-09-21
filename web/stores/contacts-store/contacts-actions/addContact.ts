import { ContactsStore } from '../contacts-store'
import { relay } from 'api'
import { normalizeContact } from '../../normalize'

export const addContact = async (self: ContactsStore, v: any) => {
  if (!v.public_key) {
    console.log('no pub key')
    return false
  }
  try {
    const r = await relay.post('contacts', { ...v, status: 1 })
    const contact = normalizeContact(r)
    self.setContact(contact)
    console.tron.display({
      name: 'addContact',
      preview: 'Added contact:',
      value: contact,
    })
    return true
  } catch (e) {
    console.log(e)
    return false
  }
}
