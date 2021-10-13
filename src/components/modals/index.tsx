import React from 'react'
import { useObserver } from 'mobx-react-lite'

import ConfirmPayInvoice from './confirmPayInvoice'
import ShareInvite from './shareInvite'
import RawInvoiceModal from './rawInvoiceModal'
import { useStores } from '../../store'
import Oauth from './oauth'
import Subscribe from './subscribe'
import Redeem from './redeem'
import VideoViewer from './vidViewer'
import { RestoringMessages } from './restoringMessages'

export default function Modals() {
  const { ui } = useStores()

  return useObserver(() => {
    const showConfirmPayInvoice = ui.confirmInvoiceMsg && ui.confirmInvoiceMsg.payment_request ? true : false
    const showRawInvoiceModal = ui.rawInvoiceModal
    const showOauth = ui.oauthParams ? true : false
    const showSubModal = ui.subModalParams ? true : false
    const showRedeemModal = ui.redeemModalParams ? true : false
    const showVid = ui.vidViewerParams ? true : false
    const restoringModalVisible = ui.restoringModal

    return (
      <>
        <ShareInvite visible={ui.shareInviteModal} />
        <ConfirmPayInvoice visible={showConfirmPayInvoice} />
        <RawInvoiceModal visible={showRawInvoiceModal} />
        <Oauth visible={showOauth} />
        <Subscribe visible={showSubModal} />
        <Redeem visible={showRedeemModal} />
        <VideoViewer params={showVid} visible={ui.vidViewerParams} />
        <RestoringMessages visible={restoringModalVisible} />
      </>
    )
  })
}
