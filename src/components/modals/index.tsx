import React from 'react'
import { useObserver } from 'mobx-react-lite'

import ConfirmPayInvoice from './confirmPayInvoice'
import ShareInvite from './shareInvite'
import RawInvoiceModal from './rawInvoiceModal'
import { useStores } from '../../store'
import Subscribe from './subscribe'
import Redeem from './redeem'
import VideoViewer from './vidViewer'

export default function Modals() {
  const { ui } = useStores()

  return useObserver(() => {
    const showConfirmPayInvoice = !!ui.confirmInvoiceMsg?.payment_request
    const showRawInvoiceModal = ui.rawInvoiceModal
    const showSubModal = !!ui.subModalParams
    const showRedeemModal = !!ui.redeemModalParams
    const showVid = !!ui.vidViewerParams

    return (
      <>
        <ShareInvite visible={ui.shareInviteModal} />
        <ConfirmPayInvoice visible={showConfirmPayInvoice} />
        <RawInvoiceModal visible={showRawInvoiceModal} />
        <Subscribe visible={showSubModal} />
        <Redeem visible={showRedeemModal} />
        <VideoViewer params={showVid} visible={ui.vidViewerParams} />
      </>
    )
  })
}
