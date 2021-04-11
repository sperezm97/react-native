import React from 'react'
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native'
import Modal from 'react-native-modal'

import { useTheme } from '../../../store'
import Icon from '../Icon'

export default function Menu(props) {
  const { visible, items, hasBackdrop, swipeDirection, onCancel } = props
  const theme = useTheme()

  let actionItems = []

  if (typeof onCancel === 'function') {
    actionItems = [
      ...items,
      {
        title: 'Cancel',
        thumbIcon: 'Close',
        thumbBgColor: theme.grey,
        action: () => onCancel()
      }
    ]
  } else {
    actionItems = [...items]
  }

  return (
    <Modal
      isVisible={visible}
      style={{
        margin: 0,
        justifyContent: 'flex-end'
      }}
      hasBackdrop={hasBackdrop}
      onSwipeComplete={onCancel}
      swipeDirection={swipeDirection}
    >
      <View style={{ ...styles.wrap, backgroundColor: theme.bg }}>
        {actionItems.map((item, i) => {
          const iconProp = React.isValidElement(item.thumbIcon)

          return (
            <TouchableOpacity
              key={`${item.title}${i}`}
              style={{
                ...styles.row,
                height: item.description ? 60 : 55,
                maxHeight: item.description ? 60 : 55
              }}
              onPress={item.action}
              disabled={item.disabled}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {item.thumbIcon && (
                  <View style={{ ...styles.thumbWrapper, backgroundColor: item.thumbBgColor }}>
                    {iconProp ? <>{item.thumbIcon}</> : <Icon name={item.thumbIcon} size={18} color={item.thumbColor} />}
                  </View>
                )}
                {item.thumbImage && <Image source={typeof item.thumbImage === 'string' ? { uri: item.thumbImage } : item.thumbImage} style={{ ...styles.thumbImage }} />}
                <View>
                  <Text style={{ fontSize: 16, color: theme.text }}>{item.title}</Text>
                  {item.description && <Text style={{ fontSize: 14, color: theme.subtitle }}>{item.description}</Text>}
                </View>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {item.preview && <Text style={{ ...styles.previewText, color: theme.text }}>{item.preview}</Text>}
                {item.icon && <Icon name={item.icon} color={theme.icon} size={25} />}
              </View>
            </TouchableOpacity>
          )
        })}
      </View>
    </Modal>
  )
}

Menu.defaultProps = {
  items: [],
  hasBackdrop: true,
  swipeDirection: 'down'
}

const styles = StyleSheet.create({
  wrap: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingRight: 14,
    paddingLeft: 14,
    paddingTop: 12,
    paddingBottom: 12
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 12
  },
  previewText: {
    fontSize: 16,
    marginRight: 5
  },
  thumbWrapper: {
    width: 30,
    height: 30,
    marginRight: 10,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center'
  },
  thumbImage: {
    borderRadius: 10,
    height: 70,
    width: 70,
    marginRight: 20
  }
})
