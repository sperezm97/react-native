import React from 'react'

import ActionSheet from '../ActionSheet'

export default function GroupSettings({
  visible,
  owner,
  onCancel,
  shareGroup,
  exitGroup
}) {
  const ownerItems = [
    {
      id: 1,
      label: 'Delete Community',
      onPress: () => exitGroup()
    }
  ]

  const userItems = [
    {
      id: 1,
      label: 'Exit Community',
      onPress: () => exitGroup()
    }
  ]

  const commonItems = [
    {
      id: 1,
      label: 'Share Community',
      onPress: () => shareGroup()
    }
  ]

  const items = owner ? [...commonItems, ...ownerItems] : [...commonItems, ...userItems]

  return <ActionSheet visible={visible} items={items} onCancel={onCancel} />
}
