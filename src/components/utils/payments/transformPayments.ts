import { constants } from '../../../constants'
import { ChatsStore } from 'store/chats-store'
import { Msg } from 'store/msg-store'

type transformPaymentsParams = {
  userId: number /** user.myid */
  payments: Msg[]
  chats: ChatsStore
}
/**
 * @returns the sum of amounts in a object with the shape of `Msg[]`
 */
export const transformPayments = ({ payments, userId, chats }: transformPaymentsParams): Msg[] => {
  return payments
    .filter((payment) => {
      const chat = chats.chats.get(payment.chat_id.toString())
      const msgShouldBeSendByTheUser = payment.sender === userId
      const chatShouldBeATribe = chat?.type === constants.chat_types.tribe
      return msgShouldBeSendByTheUser && chatShouldBeATribe
    })
    .reduce((acc, payment) => {
      const index = acc.findIndex((item) => item.chat_id === payment.chat_id)
      return index === -1
        ? [...acc, payment]
        : acc.map((item) => {
            if (item.chat_id === payment.chat_id)
              return {
                ...item,
                amount: item.amount + payment.amount,
              }
            return item
          })
    }, [])
}
