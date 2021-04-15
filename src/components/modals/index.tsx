import React from 'react'
import { useObserver } from 'mobx-react-lite'

import ConfirmPayInvoice from './confirmPayInvoice'
import ShareInvite from './shareInvite'
import RawInvoiceModal from './rawInvoiceModal'
import { useStores } from '../../store'
import NewGroupModal from './newGroupModal'
import GroupModal from './newGroupModal/groupInfo'
import JoinTribe from './joinTribe'
import Oauth from './oauth'
import Subscribe from './subscribe'
import Redeem from './redeem'
import ImageViewer from './imgViewer'
import VideoViewer from './vidViewer'

export default function Modals() {
  const { ui } = useStores()

  return useObserver(() => {
    const showConfirmPayInvoice = ui.confirmInvoiceMsg && ui.confirmInvoiceMsg.payment_request ? true : false
    const showNewGroupModal = ui.newGroupModal || ui.editTribeParams ? true : false
    const showRawInvoiceModal = ui.rawInvoiceModal
    const showImageViewer = ui.imgViewerParams && (ui.imgViewerParams.data || ui.imgViewerParams.uri || ui.imgViewerParams.msg) ? true : false
    const showJoinTribe = ui.joinTribeParams ? true : false
    const showOauth = ui.oauthParams ? true : false
    const showSubModal = ui.subModalParams ? true : false
    const showRedeemModal = ui.redeemModalParams ? true : false
    const showVid = ui.vidViewerParams ? true : false

    return (
      <>
        <JoinTribe visible={showJoinTribe} />
        <ShareInvite visible={ui.shareInviteModal} />
        <ConfirmPayInvoice visible={showConfirmPayInvoice} />
        <RawInvoiceModal visible={showRawInvoiceModal} />
        <NewGroupModal visible={showNewGroupModal} />
        <Oauth visible={showOauth} />
        <Subscribe visible={showSubModal} />
        <GroupModal visible={ui.groupModal} />
        <Redeem visible={showRedeemModal} />
        <VideoViewer params={showVid} visible={ui.vidViewerParams} />
        <ImageViewer params={ui.imgViewerParams} visible={showImageViewer} />
      </>
    )
  })
}
