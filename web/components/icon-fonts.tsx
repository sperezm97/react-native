import React from 'react'
import { Platform } from 'react-native'

// paper icon shaz is from: https://callstack.github.io/react-native-paper/using-on-the-web.html
export const IconFonts = () => {
  return (
    <>
      {Platform.OS === 'web' ? (
        <style type='text/css'>
          {`@font-face {
                font-family: 'MaterialCommunityIcons';
                src: url(${require('react-native-vector-icons/Fonts/MaterialCommunityIcons.ttf')}) format('truetype');
              }`}
        </style>
      ) : null}
    </>
  )
}
