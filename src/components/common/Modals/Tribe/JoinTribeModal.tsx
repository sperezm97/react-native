import React, { useEffect, useState } from 'react'
import { useObserver } from 'mobx-react-lite'

import { useStores } from 'store'
import JoinTribe from './JoinTribe'

export default function JoinTribeModal() {
  const { ui, chats } = useStores()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTribes()
    // ;(async () => {

    //   await contacts.getContacts()
    //   await msg.getMessages()
    //   await chats.getTribes()
    // })()
  }, [])

  function fetchTribes() {
    chats.getTribes().then(() => setLoading(false))
  }

  function close() {
    ui.setJoinTribeParams(null)
  }

  return useObserver(() => {
    const params = ui.joinTribeParams
    const showJoinTribe = !!ui.joinTribeParams

    if (!showJoinTribe || !params.get('uuid')) return <></>

    return (
      <>
        {showJoinTribe && params.get('uuid') && !loading && (
          <JoinTribe visible={showJoinTribe} tribe={params} close={close} />
        )}
      </>
    )
  })
}
