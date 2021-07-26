import React, { useMemo } from 'react'
import { View } from 'react-native'
import { WebView } from 'react-native-webview'

interface RumbleVideoProps {
  link: string
}

const RumbleVideo: React.FC<RumbleVideoProps> = ({ link }) => {
  const videoKey = useMemo(() => {
    const pathname = link.trim().split("https://rumble.com/")?.[1]
    return pathname?.split('-')?.[0] ?? ""
  }, [link])

  return !!videoKey && (
    <View style={{ width: 640, height: 170 }}>
      <WebView
        source={{ html: `
          <iframe
            width="400"
            height="240"
            src="https://rumble.com/embed/vhbu2c/?pub=${videoKey}"
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
