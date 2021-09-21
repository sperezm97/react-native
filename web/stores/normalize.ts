import { Chat, ChatModel } from './chats-store'
import { Contact, ContactModel } from './contacts-store'

export const normalizeChat = (raw: any) => {
  const normalized: Chat = ChatModel.create({
    app_url: raw.app_url ?? '',
    created_at: raw.created_at,
    deleted: parseBool(raw.deleted),
    escrow_amount: raw.escrow_amount ?? 0,
    escrow_millis: raw.escrow_millis ?? 0,
    feed_url: raw.feed_url ?? '',
    group_key: raw.group_key ?? '',
    host: raw.host ?? '',
    id: raw.id,
    invite: raw.invite ?? null,
    is_muted: parseBool(raw.is_muted),
    my_alias: raw.my_alias ?? '',
    my_photo_url: raw.my_photo_url ?? '',
    name: raw.string ?? '',
    owner_pubkey: raw.owner_pubkey ?? '',
    photo_url: raw.photo_url ?? '',
    price_per_message: raw.price_per_message ?? 0,
    pricePerMinute: raw.pricePerMinute ?? 0,
    price_to_join: raw.price_to_join ?? 0,
    private: parseBool(raw.private),
    status: raw.status ?? '',
    type: raw.type,
    unlisted: parseBool(raw.unlisted),
    updated_at: raw.updated_at,
    uuid: raw.uuid,
  })
  return normalized
}

export const normalizeContact = (raw: any) => {
  const normalized: Contact = ContactModel.create({
    alias: raw.alias,
    auth_token: raw.auth_token,
    contact_key: raw.contact_key,
    created_at: raw.created_at,
    deleted: parseBool(raw.deleted),
    device_id: raw.device_id,
    from_group: parseBool(raw.from_group),
    id: raw.id,
    is_owner: parseBool(raw.is_owner),
    node_alias: raw.node_alias,
    photo_url: raw.photo_url,
    private_photo: parseBool(raw.private_photo),
    public_key: raw.public_key,
    remote_id: raw.remote_id,
    route_hint: raw.route_hint,
    status: raw.status,
    updated_at: raw.updated_at,
  })
  return normalized
}

const parseBool = (zeroorone: number) => {
  return Boolean(Number(zeroorone)) ?? false
}
