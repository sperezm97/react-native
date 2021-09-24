import React, { useState } from 'react'
import { View, Text, TouchableWithoutFeedback, Image } from 'react-native'
import Icon from 'react-native-vector-icons/AntDesign'

import ImageDialog from '../../common/Dialogs/ImageDialog'

export default function PhotoInput({ label, required, setValue, value }) {
  const [dialogOpen, setDialogOpen] = useState(false)

  function tookPic(uri) {
    setValue(uri)
  }

  const imgURI = value
  const hasImgURI = !!imgURI

  return (
    <View style={{ ...styles.wrap }}>
      <TouchableWithoutFeedback onPress={() => setDialogOpen(true)}>
        <View style={styles.box}>
          <Text style={styles.label}>{`${label.en}${required ? ' *' : ''}`}</Text>
        </View>
      </TouchableWithoutFeedback>

      {hasImgURI ? (
        <Image
          source={{ uri: imgURI }}
          style={{
            width: 52,
            height: 52,
            position: 'absolute',
            right: 0,
            top: 1,
            borderRadius: 3,
          }}
        />
      ) : (
        <Icon
          name='picture'
          color='#888'
          size={25}
          style={{ position: 'absolute', right: 13, top: 17 }}
          onPress={() => setDialogOpen(true)}
        />
      )}

      <ImageDialog
        visible={dialogOpen}
        onCancel={() => setDialogOpen(false)}
        onPick={tookPic}
        onSnap={tookPic}
        setImageDialog={setDialogOpen}
      />
    </View>
  )
}

const styles = {
  wrap: {
    flex: 1,
  },
  box: {
    borderBottomColor: '#bbb',
    borderBottomWidth: 1,
    marginBottom: 25,
    height: 55,
  },
  label: {
    fontSize: 15,
    color: '#666',
    top: 20,
    left: 12,
  },
}
