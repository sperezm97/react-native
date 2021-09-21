import { UserStore } from '../user-store'
import * as api from 'api'

export const finishInvite = async (self: UserStore) => {
  // if (!self.code || self.code === '') {
  //   console.tron.display({
  //     name: 'finishInvite',
  //     preview: 'No invite code',
  //     important: true,
  //   })
  //   return false
  // }
  try {
    await api.relay.post('invites/finish', {
      invite_string: self.code,
    })
    return true
  } catch (e) {
    console.log('could not finish invite', e)
    return false
  }
}
