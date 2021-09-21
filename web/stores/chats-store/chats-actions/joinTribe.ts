import { ChatsStore } from '../chats-store'
import { relay } from 'api'

export const joinTribe = async (
  self: ChatsStore,
  {
    name,
    uuid,
    group_key,
    host,
    amount,
    img,
    owner_alias,
    owner_pubkey,
    is_private,
    my_alias,
    my_photo_url,
    owner_route_hint,
  }: JoinTribeParams
) => {
  const params = {
    name,
    uuid,
    group_key,
    amount,
    host,
    img,
    owner_alias,
    owner_pubkey,
    private: is_private,
    my_alias: my_alias || '',
    my_photo_url: my_photo_url || '',
  }

  console.tron.display({
    name: 'joinTribe',
    preview: 'Attempting to join tribe with params:',
    value: params,
  })

  try {
    const r = await relay.post('tribe', params)
    if (!r) return
    self.gotChat(r)
    if (amount) console.log('amount...', amount)
    // if (amount) detailsStore.addToBalance(amount * -1)
    return r
  } catch (e) {
    console.log(e)
  }
}

export type JoinTribeParams = {
  name: string
  uuid: string
  group_key: string
  host: string
  amount: number
  img: string
  owner_alias: string
  owner_pubkey: string
  is_private: boolean
  my_alias?: string
  my_photo_url?: string
  owner_route_hint?: string // CD - made this optional
}
