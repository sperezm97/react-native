import moment from 'moment'
import url from 'url'
import * as linkify from 'linkifyjs'
import { constants } from '../../../constants'

export function calcExpiry(props) {
  const isInvoice = props.type === constants.message_types.invoice
  let expiry
  let isExpired = false
  if (isInvoice) {
    const exp = moment(props.expiration_date)
    const dif = exp.diff(moment())
    expiry = Math.round(moment.duration(dif).asMinutes())
    if (expiry < 0) isExpired = true
  }
  return { expiry, isExpired }
}

type Link = {
  href: string;
}

const getLink = (linkFilter: (text: Link) => boolean) => (text: string): string => {
  const messageLinks = linkify.find(text, 'url')
  const filteredLink = messageLinks.find(linkFilter)
  return filteredLink?.href ?? ''
}
const isLinkWithStart = (textToStart: string) => (link: Link) => link.href.startsWith(textToStart)

export const getRumbleLink = getLink(isLinkWithStart('https://rumble.com/embed/'))
export const getYoutubeLink = getLink(isLinkWithStart('https://www.youtube.com/watch?v'))
export const getQueryParamFromLink = (link: string, queryParam: string) => {
  const urlParams = url.parse(link, true)
  return urlParams.query?.[queryParam] ?? ''
}
