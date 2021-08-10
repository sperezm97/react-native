import React, { useMemo } from 'react'
import RumbleVideo from './rumbleVideo'
import YoutubeVideo from './youtubeVideo'

const videoOptions = {
  'rumble': RumbleVideo,
  'youtube': YoutubeVideo
}

type EmbedVideoTypes = {
  link: string
  type: 'rumble' | 'youtube'
}

const EmbedVideo: React.FC<EmbedVideoTypes> = ({ type, link }) => {
  const Video = useMemo(() => videoOptions[type], [type])
  return <Video link={link} />
}

export default EmbedVideo
