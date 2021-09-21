import { Instance, SnapshotOut, types } from 'mobx-state-tree'
import { withEnvironment } from '../extensions/with-environment'
import * as actions from './contacts-actions'
import { Contact, ContactModel } from './contacts-models'

export const ContactsStoreModel = types
  .model('ContactsStore')
  .props({
    contacts: types.optional(types.map(ContactModel), {}),
  })
  .extend(withEnvironment)
  .actions((self) => ({
    addContact: async (v: any): Promise<boolean> => await actions.addContact(self as ContactsStore, v),
    getContacts: async (): Promise<boolean> => await actions.getContacts(self as ContactsStore),
    updateContact: async (id: number, v: any): Promise<boolean> =>
      await actions.updateContact(self as ContactsStore, id, v),
    setContact(contact: Contact) {
      self.contacts.put(contact)
    },
    setContacts(contacts: any) {
      self.contacts = contacts
    },
  }))

type ContactsStoreType = Instance<typeof ContactsStoreModel>
export interface ContactsStore extends ContactsStoreType {}
type ContactsStoreSnapshotType = SnapshotOut<typeof ContactsStoreModel>
export interface ContactsStoreSnapshot extends ContactsStoreSnapshotType {}
export const createContactsStoreDefaultModel = () => types.optional(ContactsStoreModel, {})
