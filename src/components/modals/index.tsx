import React from 'react'
import { useObserver } from 'mobx-react-lite'

import Payment from './payment'
import ConfirmPayInvoice from './confirmPayInvoice'
import ShareInvite from './shareInvite'
import RawInvoiceModal from './rawInvoiceModal'
import { useStores } from '../../store'
import NewGroupModal from './newGroupModal'
import GroupModal from './newGroupModal/groupInfo'
import JoinTribe from './joinTribe'
import Oauth from './oauth'
import Subscribe from './subscribe'
import ShareTribe from './shareTribe'
import Redeem from './redeem'
import AddSats from './addSats'
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
    const showShareTribeUUID = ui.shareTribeUUID ? true : false
    const showRedeemModal = ui.redeemModalParams ? true : false
    const showVid = ui.vidViewerParams ? true : false
    const showAddSats = ui.addSatsModal ? true : false

    return (
      <>
        <Payment visible={ui.showPayModal} />
        <JoinTribe visible={showJoinTribe} />
        <ShareTribe visible={showShareTribeUUID} />
        <ShareInvite visible={ui.shareInviteModal} />
        <ConfirmPayInvoice visible={showConfirmPayInvoice} />
        <RawInvoiceModal visible={showRawInvoiceModal} />
        <NewGroupModal visible={showNewGroupModal} />
        <AddSats visible={showAddSats} />
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
