import React from 'react'

import ActionSheet from '../ActionSheet'

export default function EditGroup({ visible, onCancel, shareGroup }) {
  const items = [
    {
      id: 1,
      label: 'Share Group',
      onPress: () => shareGroup()
    }
  ]

  return <ActionSheet visible={visible} items={items} onCancel={onCancel} />
}
