import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text, Image as FastImage } from 'react-native'
import { Avatar as PaperAvatar } from 'react-native-paper'
// import FastImage from 'react-native-fast-image'

import { useStores, useTheme } from 'store'
import { useAvatarColor } from 'store/hooks/msg'

export default function Avatar(props) {
  let { style, photo, alias, size, avatarSize, borderless } = props

  const theme = useTheme()
  const [avatar, setAvatar] = useState({
    newImage: require('../../../assets/avatars/balvin.png'),
    randomImages: [
      {
        image: require('../../../assets/avatars/balvin.png'),
      },
      {
        image: require('../../../assets/avatars/bieber.png'),
      },
      {
        image: require('../../../assets/avatars/blu.png'),
      },
      {
        image: require('../../../assets/avatars/cardi.png'),
      },
      {
        image: require('../../../assets/avatars/cardi2.png'),
      },
      {
        image: require('../../../assets/avatars/guy.png'),
      },
      {
        image: require('../../../assets/avatars/kittle.png'),
      },
    ],
  })

  useEffect(() => {
    setAvatar({
      ...avatar,
      newImage: avatar.randomImages[Math.floor(Math.random() * 3)].image,
    })
  }, [])

  const borderStyles = !borderless && {
    ...styles.image,
    borderColor: theme.border,
  }

  const borderRadius = props.round ? props.round : 25

  if (photo) {
    if (!photo.startsWith('https')) {
      photo = photo.replace('http', 'https')
    }

    return (
      <View
        style={{
          ...style,
          ...styles.avatar,
          height: size,
          width: size,
          borderRadius,
          opacity: props.hide ? 0 : 1,
        }}
      >
        <FastImage
          source={{ uri: photo }}
          style={{ width: size, height: size, borderRadius }}
          // resizeMode={FastImage.resizeMode.cover}
          resizeMode='cover'
        />
      </View>
    )
  } else if (alias) {
    let initial = ''
    const arr = alias.split(' ')
    arr.forEach((str, i) => {
      if (i < 2) initial += str.substring(0, 1).toUpperCase()
    })

    return (
      <View
        style={{
          ...style,
          ...styles.aliasWrap,
          height: size,
          width: size,
          borderRadius,
          opacity: props.hide ? 0 : 1,
          backgroundColor: useAvatarColor(alias),
        }}
      >
        <Text
          style={{
            ...styles.initial,
            letterSpacing: props.big ? 2 : 0,
            fontSize: props.aliasSize,
          }}
        >
          {initial}
        </Text>
      </View>
    )
  } else {
    return (
      <View
        style={{
          ...style,
          ...styles.avatar,
          height: size,
          width: size,
          borderRadius,
          opacity: props.hide ? 0 : 1,
        }}
      >
        <PaperAvatar.Image
          size={avatarSize ? avatarSize : size}
          source={avatar.newImage}
          style={{ ...borderStyles, backgroundColor: 'transparent' }}
        />
      </View>
    )
  }
}

Avatar.defaultProps = {
  photo: '',
  borderless: true,
  aliasSize: 15,
}

const styles = StyleSheet.create({
  image: {
    borderWidth: 1,
  },
  aliasWrap: {
    // marginLeft: 8,
    backgroundColor: 'black',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  initial: {
    color: 'white',
    marginLeft: 1,
    // marginBottom: 1
    // marginRight: 1
  },
  avatar: {
    // marginLeft: 28,
    // backgroundColor: 'transparent',
    // display: 'flex',
    // alignItems: 'center',
    // justifyContent: 'center',
    // position: 'relative',
    // overflow: 'hidden'
  },
})
