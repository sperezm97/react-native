import React from 'react'

import ActionSheet from '../ActionSheet'

export default function ExitGroup({ visible, onCancel, exitGroup }) {
  const items = [
    {
      id: 1,
      label: 'Exit Group',
      onPress: () => exitGroup()
    }
  ]

  return <ActionSheet visible={visible} items={items} onCancel={onCancel} />
}
