import { constants } from '../../../constants'
import { ChatStore } from '../../../store/chats'
import { Msg } from '../../../store/msg'

type transformPaymentsParams = {
  userId: number /** user.myid */
  payments: Msg[]
  chats: ChatStore
}
/**
 * @returns the sum of amounts in a object with the shape of `Msg[]`
 */
export const transformPayments = ({ payments, userId, chats }: transformPaymentsParams): Msg[] => {
  return payments
    .filter((payment) => {
      const chat = chats.chats.find((c) => c.id === payment.chat_id)
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
