import React from 'react'
import { Text, StyleSheet, View, PermissionsAndroid } from 'react-native'
import { IconButton } from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import RNFetchBlob from 'rn-fetch-blob'
import Toast from 'react-native-simple-toast'

import shared from './sharedStyles'

let dirs = RNFetchBlob.fs.dirs

export default function FileMsg(props) {
  const { filename, uri } = props
  async function download() {
    console.log(uri, dirs.DownloadDir + '/' + filename)
    try {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE)
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        await RNFetchBlob.fs.cp(uri, dirs.DownloadDir + '/' + filename)

        Toast.showWithGravity('File Downloaded', Toast.SHORT, Toast.TOP)
      } else {
        Toast.showWithGravity('Permission Denied', Toast.SHORT, Toast.TOP)
      }
    } catch (err) {
      console.warn(err)
    }
  }
  return (
    <View style={{ ...shared.innerPad, ...styles.wrap }}>
      <Icon name='file' color='grey' size={27} />
      <Text style={styles.filename}>{filename || 'file'}</Text>
      <IconButton icon='download' color='grey' size={27} onPress={download} />
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  text: {
    color: '#333',
    fontSize: 16
  },
  filename: {
    color: 'grey',
    marginLeft: 12,
    marginRight: 12,
    maxWidth: 75
  }
})
