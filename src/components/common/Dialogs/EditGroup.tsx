import React from 'react'

import ActionSheet from '../ActionSheet'

export default function EditGroup({ visible, onCancel, editGroup, shareGroup }) {
  const items = [
    // {
    //   id: 1,
    //   label: 'Edit Group',
    //   onPress: () => editGroup()
    // },
    {
      id: 1,
      label: 'Share Group',
      onPress: () => shareGroup()
    }
  ]

  return <ActionSheet visible={visible} items={items} onCancel={onCancel} />
}
