import React from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'

import { useTheme } from '../../../store'
import Typography from '../Typography'
import Icon from '../Icon'

export default function AvatarEdit({
  display,
  children,
  onPress,
  uploading,
  uploadPercent
}) {
  const theme = useTheme()

  return (
    <TouchableOpacity onPress={onPress} style={styles.imgWrap} activeOpacity={0.9}>
      {children}
      {!display && (
        <>
          {uploading && (
            <Typography
              style={{ ...styles.uploadPercent }}
              color={theme.primary}
            >{`${uploadPercent}%`}</Typography>
          )}
          <View style={styles.imgIcon}>
            <Icon name='PlusCircle' fill={theme.primary} color={theme.white} />
          </View>
        </>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  imgWrap: {
    position: 'relative'
  },
  uploadPercent: {
    position: 'absolute',
    top: '45%',
    height: '100%',
    width: '100%',
    textAlign: 'center',
    fontWeight: '500'
  },
  imgIcon: {
    position: 'absolute',
    right: -5,
    top: '50%'
  }
})
