import React, { useMemo } from 'react'
import { View } from 'react-native'
import { WebView } from 'react-native-webview'
import url from 'url'
import { getQueryParamFromLink } from './utils'

interface YoutubeVideoProps {
  link: string
}

const YoutubeVideo: React.FC<YoutubeVideoProps> = ({ link }) => {
  const videoKey = useMemo(() => getQueryParamFromLink(link, 'v'), [link])

  return !!videoKey && (
    <View style={{ width: 640, height: 170 }} pointerEvents="box-only">
      <WebView
        source={{
          html: `
            <iframe
              width="400"
              height="240"
              src="https://www.youtube.com/embed/${videoKey}"
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture"
              allowfullscreen
            ></iframe>
          `
        }}
      />
    </View>
  )
}

export default YoutubeVideo
