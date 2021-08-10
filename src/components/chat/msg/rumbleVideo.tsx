import React, { useMemo } from 'react'
import { View } from 'react-native'
import { WebView } from 'react-native-webview'

interface RumbleVideoProps {
  link: string
}

const RumbleVideo: React.FC<RumbleVideoProps> = ({ link }) => {
  const formattedLink = useMemo(() => `${link.split('?')[0]}?rel=0`, [link])

  return !!formattedLink && (
    <View style={{ width: 640, height: 170 }}>
      <WebView
        source={{
          html: `
            <iframe
              width="400"
              height="240"
              src="${formattedLink}"
              frameborder="0"
              allowfullscreen
            ></iframe>
          `
        }}
      />
    </View>
  )
}

export default RumbleVideo
