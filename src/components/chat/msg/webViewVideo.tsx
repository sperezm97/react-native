import React from 'react'
import { View } from 'react-native'
import { WebView } from 'react-native-webview'

type WebViewVideoProps = {
  embedLink: string
  onLongPress: () => void
}

const WebViewVideo: React.FC<WebViewVideoProps> = ({ embedLink, onLongPress }) => (
  !!embedLink && (
    <View style={{ width: 640, height: 170 }}>
      <WebView
        // TODO: Inform why we needed to add this code
        injectedJavaScript={`
          (() => {
            let setTimeoutID
            document.addEventListener("touchstart", function(event) {
              setTimeoutID = setTimeout(() => {
                setTimeoutID = null
                window.ReactNativeWebView.postMessage("longPress")
                event.preventDefault()
              }, 700)
            })
            document.addEventListener("touchend", function(event) {
              if (setTimeoutID) {
                clearTimeout(setTimeoutID)
                return
              }
              event.preventDefault()
            });
          })()
          (() => {
            const style = document.createElement('style')
            style.type = 'text/css'
            style.appendChild(document.createTextNode("body {-webkit-touch-callout: none;-webkit-user-select: none;-khtml-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;}"))
            document.head.appendChild(style)
          })()
        `}
        onMessage={(event) => {
          if (event.nativeEvent.data === 'longPress') onLongPress()
        }}
        javaScriptEnabled={true}
        source={{ uri: embedLink }}
        style={{ width: 280, height: 150 }}
      />
  </View>
))

export default WebViewVideo
