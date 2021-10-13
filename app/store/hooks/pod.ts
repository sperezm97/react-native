import { useMemo } from 'react'
import { useStores } from '../index'
import { display } from 'lib/logging'

export function useIncomingPayments(podID, myid) {
  display({
    name: 'useIncomingPayments',
    important: true,
  })
  const { msg } = useStores()
  let earned = 0
  let spent = 0
  let incomingPayments = []
  if (podID) {
    incomingPayments = msg.filterMessagesByContent(0, `"feedID":${podID}`)
    if (incomingPayments) {
      incomingPayments.forEach((m) => {
        if (m.sender !== myid && m.amount) {
          earned += Number(m.amount)
        }
        if (m.sender === myid && m.amount) {
          spent += Number(m.amount)
        }
      })
    }
    // console.log(earned)
  }
  return { earned, spent, incomingPayments }
}

export function useMemoizedIncomingPaymentsFromPodcast(podID: string, myid: string | number) {
  display({
    name: 'useMemoizedIncomingPaymentsFromPodcast',
    important: true,
  })
  const { msg } = useStores()
  return useMemo(() => {
    let earned = 0
    let spent = 0
    let incomingPayments = []
    if (podID) {
      incomingPayments = msg.filterMessagesByContent(0, `"feedID":${podID}`)
      if (incomingPayments) {
        incomingPayments.forEach((m) => {
          if (m.sender !== myid && m.amount) {
            earned += Number(m.amount)
          }
          if (m.sender === myid && m.amount) {
            spent += Number(m.amount)
          }
        })
      }
      // console.log(earned)
    }
    return { earned, spent, incomingPayments }
  }, [podID, myid])
}
