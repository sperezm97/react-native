import React from 'react'
import { useObserver } from 'mobx-react-lite'
import { View, StyleSheet } from 'react-native'
import { WebView } from 'react-native-webview'

function makeScript(v, s) {
  console.log(v, s)
  return `
<style>h1{color:white;}</style>
<h1>YO</h1>
<script>
console.log('hi')
</script>
`
}

export default function ION(props) {
  function onMessage(data) {
    console.log(data)
  }
  return useObserver(() => (
    <View style={styles.wrap}>
      <WebView
        automaticallyAdjustContentInsets={false}
        injectedJavaScript={js()}
        scalesPageToFit={true}
        contentInset={{ top: 0, right: 0, bottom: 0, left: 0 }}
        source={{ html: makeScript(props.value, props.size) }}
        style={{ flex: 1 }}
        javaScriptEnabled={true}
        scrollEnabled={false}
        originWhitelist={['*']}
        onMessage={onMessage}
      />
    </View>
  ))
}

function js() {
  return `const meta = document.createElement('meta'); meta.setAttribute('content', 'width=width, initial-scale=1, maximum-scale=1, user-scalable=no'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta);
  console.log('meta')
`
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
})
