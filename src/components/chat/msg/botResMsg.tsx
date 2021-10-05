import React from 'react'
import { TouchableOpacity } from 'react-native'
import HTML from 'react-native-render-html'

import shared from './sharedStyles'
import { useTheme } from 'store'

function makeHTML(html, theme) {
  const color = theme.title
  return `<div style="color:${color};">${html}</div>`
}

export default function TextMsg(props) {
  const theme = useTheme()
  const { message_content } = props
  const onLongPressHandler = () => props.onLongPress(props)

  return (
    <TouchableOpacity style={shared.innerPad} onLongPress={onLongPressHandler}>
      <HTML
        html={makeHTML(message_content, theme)}
        // imagesMaxWidth={Dimensions.get("window").width}
      />
    </TouchableOpacity>
  )
}
