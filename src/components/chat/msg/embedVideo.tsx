import React, { useMemo } from 'react'

import WebViewVideo from './webViewVideo'
import { getYoutubeVideoID } from './utils'

type EmbedVideoTypes = {
  link: string
  type: 'rumble' | 'youtube'
  onLongPress: () => void
}

const EmbedVideo: React.FC<EmbedVideoTypes> = ({ type, link, onLongPress }) => {
  const embedLink = useMemo(() => {
    if (!link || !type) return ''
    if (type === 'rumble') return `${link.split('?')[0]}?rel=0`
    const youtubeVideoID = getYoutubeVideoID(link)
    if (!youtubeVideoID) return ''
    return `https://www.youtube.com/embed/${youtubeVideoID}`
  }, [link, type])

  return !!embedLink && <WebViewVideo embedLink={embedLink} onLongPress={onLongPress} />
}

export default EmbedVideo
