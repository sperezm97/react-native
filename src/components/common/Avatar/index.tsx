import React, { useEffect, useState } from 'react'
import { StyleSheet, Image } from 'react-native'
import { Avatar as PaperAvatar } from 'react-native-paper'

import { useStores, useTheme } from '../../../store'

export default function Avatar({ uri, size, borderless }) {
  const theme = useTheme()
  const [avatar, setAvatar] = useState({
    newImage: require('../../../assets/avatars/balvin.png'),
    randomImages: [
      {
        image: require('../../../assets/avatars/balvin.png')
      },
      {
        image: require('../../../assets/avatars/bieber.png')
      },
      {
        image: require('../../../assets/avatars/blu.png')
      },
      {
        image: require('../../../assets/avatars/cardi.png')
      },
      {
        image: require('../../../assets/avatars/cardi2.png')
      },
      {
        image: require('../../../assets/avatars/guy.png')
      },
      {
        image: require('../../../assets/avatars/kittle.png')
      }
    ]
  })

  useEffect(() => {
    setAvatar({ ...avatar, newImage: avatar.randomImages[Math.floor(Math.random() * 3)].image })
  }, [])

  const borderStyles = !borderless && {
    ...styles.image,
    borderColor: theme.border
  }

  if (uri) {
    return <Image resizeMode='cover' source={uri ? { uri } : avatar.newImage} style={{ ...borderStyles }} />
  } else {
    return <PaperAvatar.Image size={size} source={avatar.newImage} style={{ ...borderStyles, backgroundColor: 'transparent' }} />
  }
}

Avatar.defaultProps = {
  uri: '',
  borderless: true
}

const styles = StyleSheet.create({
  image: {
    borderWidth: 1
  }
})
