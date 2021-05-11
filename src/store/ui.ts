import { observable, action } from 'mobx'
import { Chat } from './chats'
import { Msg } from './msg'
import { Contact } from './contacts'

type PayMode = '' | 'invoice' | 'payment' | 'loopout'

export class UiStore {
  @observable ready: boolean = false
  @action setReady(ready) {
    this.ready = ready
  }

  @observable selectedChat: Chat
  @action setSelectedChat(c) {
    this.selectedChat = c
  }

  @observable loadingChat: boolean
  @action setLoadingChat(b: boolean) {
    this.loadingChat = b
  }

  @observable applicationURL: string
  @action setApplicationURL(s) {
    this.applicationURL = s
  }

  @observable feedURL: string
  @action setFeedURL(s) {
    this.feedURL = s
  }

  @observable searchTerm: string = ''
  @action setSearchTerm(term) {
    this.searchTerm = term
  }

  @observable contactsSearchTerm: string = ''
  @action setContactsSearchTerm(term) {
    this.contactsSearchTerm = term
  }

  @observable tribesSearchTerm: string = ''
  @action setTribesSearchTerm(term) {
    this.tribesSearchTerm = term
  }

  @observable qrModal: boolean = false
  @action setQrModal(b) {
    this.qrModal = b
  }

  @observable addFriendDialog: boolean = false
  @action setAddFriendDialog(b) {
    this.addFriendDialog = b
  }

  @observable inviteFriendModal: boolean = false
  @action setInviteFriendModal(b) {
    this.inviteFriendModal = b
  }

  @observable addContactModal: boolean = false
  @action setAddContactModal(b) {
    this.addContactModal = b
  }

  @observable subModalParams: { [k: string]: any } = null
  @action setSubModalParams(o) {
    this.subModalParams = o
  }

  @observable redeemModalParams: { [k: string]: any } = null
  @action setRedeemModalParams(o) {
    this.redeemModalParams = o
  }

  @observable contactSubscribeModal: boolean = false
  @observable contactSubscribeParams: Contact
  @action setContactSubscribeModal(b: boolean, p: Contact) {
    this.contactSubscribeModal = b
    this.contactSubscribeParams = p
  }

  @action closeEditContactModal() {
    this.contactSubscribeModal = false
    setTimeout(() => {
      this.contactSubscribeParams = null
    }, 500)
  }

  @observable newTribeModal: boolean = false
  @action setNewTribeModal(b) {
    this.newTribeModal = b
  }

  @observable newGroupModal: boolean = false
  @action setNewGroupModal(b) {
    this.newGroupModal = b
  }

  @observable editTribeParams: { [k: string]: any } = null
  @action setEditTribeParams(o) {
    this.editTribeParams = o
      ? {
          ...o,
          escrow_time: o.escrow_millis
            ? Math.floor(o.escrow_millis / (60 * 60 * 1000))
            : 0
        }
      : null
  }

  @observable shareTribeUUID: string = null
  @action setShareTribeUUID(s) {
    this.shareTribeUUID = s
  }

  @observable groupModal: boolean = false
  @observable groupModalParams: Chat
  @action setGroupModal(g: Chat) {
    this.groupModal = true
    this.groupModalParams = g
  }
  @action closeGroupModal() {
    this.groupModal = false
    setTimeout(() => {
      this.groupModalParams = null
    }, 500)
  }

  @observable pubkeyModal: boolean = false
  @action setPubkeyModal(b) {
    this.pubkeyModal = b
  }

  @observable shareInviteModal: boolean = false
  @observable shareInviteString: string = ''
  @action setShareInviteModal(s: string) {
    this.shareInviteModal = true
    this.shareInviteString = s
  }

  @action clearShareInviteModal() {
    this.shareInviteModal = false
    setTimeout(() => {
      this.shareInviteString = ''
    }, 500)
  }

  @observable showPayModal: boolean = false
  @observable payMode: PayMode = ''
  @observable chatForPayModal: Chat | null
  @action setPayMode(m: PayMode, c) {
    this.payMode = m
    this.chatForPayModal = c
    this.showPayModal = true
  }

  @action clearPayModal() {
    this.showPayModal = false
    setTimeout(() => {
      this.payMode = ''
      this.chatForPayModal = null
    }, 500) // delay
  }

  @observable confirmInvoiceMsg: Msg
  @action setConfirmInvoiceMsg(s) {
    this.confirmInvoiceMsg = s
  }

  @observable sendRequestModal: Chat
  @action setSendRequestModal(c: Chat) {
    this.sendRequestModal = c
  }

  @observable viewContact: Contact
  @action setViewContact(c: Contact) {
    this.viewContact = c
  }

  @observable rawInvoiceModal: boolean = false
  @observable rawInvoiceModalParams: { [k: string]: string } = null
  @action setRawInvoiceModal(params) {
    this.rawInvoiceModal = true
    this.rawInvoiceModalParams = params
    this.lastPaidInvoice = ''
  }

  @action clearRawInvoiceModal() {
    this.rawInvoiceModal = false
    setTimeout(() => {
      this.rawInvoiceModalParams = null
      this.lastPaidInvoice = ''
    }, 500) // delay
  }

  @observable lastPaidInvoice: string = ''
  @action setLastPaidInvoice(s: string) {
    this.lastPaidInvoice = s
  }

  @observable joinTribeDone: boolean = false
  @observable joinTribeModal: boolean = false
  @observable joinTribeParams: { [k: string]: any } = null
  @action setJoinTribeModal(b, obj: { [k: string]: any }) {
    this.joinTribeParams = obj
    this.joinTribeModal = b
  }

  @observable imgViewerParams: { [k: string]: any } = null
  @action setImgViewerParams(obj: { [k: string]: any }) {
    this.imgViewerParams = obj
  }

  @observable vidViewerParams: { [k: string]: any } = null
  @action setVidViewerParams(obj: { [k: string]: any }) {
    this.vidViewerParams = obj
  }

  @observable rtcParams: { [k: string]: any } = null
  @action setRtcParams(obj: { [k: string]: any }) {
    this.rtcParams = obj
  }

  @observable jitsiMeet: boolean = false
  @action setJitsiMeet(b: boolean) {
    this.jitsiMeet = b
  }

  @observable is24HourFormat: boolean
  @action setIs24HourFormat(b: boolean) {
    this.is24HourFormat = b
  }

  @observable extraTextContent: { [k: string]: any }
  @action async setExtraTextContent(o) {
    this.extraTextContent = o
  }

  @observable replyUUID: string
  @action async setReplyUUID(s) {
    this.replyUUID = s
  }

  @observable oauthParams: { [k: string]: any } = null
  @action setOauthParams(obj: { [k: string]: any }) {
    this.oauthParams = obj
  }

  @observable connected: boolean = false
  @action setConnected(b: boolean) {
    this.connected = b
  }

  @observable loadingHistory: boolean = false
  @action setLoadingHistory(b: boolean) {
    this.loadingHistory = b
  }

  @observable showBots: boolean = false
  @action toggleBots(b) {
    this.showBots = b
  }

  @observable startJitsiParams: { [k: string]: any } = null
  @action setStartJitsiParams(b) {
    this.startJitsiParams = b
  }

  @observable showProfile: boolean = false
  @action setShowProfile(b) {
    this.showProfile = b
  }

  @observable onchain: boolean = false
  @action setOnchain(b) {
    this.onchain = b
  }

  @observable newContact: { [k: string]: string } = null
  @action setNewContact(obj: { [k: string]: any }) {
    this.newContact = obj
  }

  @observable viewTribe: { [k: string]: any } = null
  @action setViewTribe(obj: { [k: string]: any }) {
    this.viewTribe = obj
  }

  @observable tribeText: { [k: number]: string } = {}
  @action setTribeText(chatID: number, text: string) {
    this.tribeText[chatID] = text
  }

  @observable addSatsModal: boolean = false
  @action setAddSatsModal(b: boolean) {
    this.addSatsModal = b
  }

  @observable showVersionDialog: boolean = false
  @action setShowVersionDialog(b: boolean) {
    this.showVersionDialog = b
  }

  @observable paymentRequest: boolean
  @action setPaymentRequest(b: boolean) {
    this.paymentRequest = b
  }

  @observable pinCodeModal: boolean = false
  @action setPinCodeModal(b) {
    this.pinCodeModal = b
  }
}

export const uiStore = new UiStore()
