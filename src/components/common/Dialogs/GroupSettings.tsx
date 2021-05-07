import React from 'react'

import ActionSheet from '../ActionSheet'

export default function GroupSettings({
  visible,
  owner,
  onCancel,
  shareGroup,
  exitGroup
}) {
  const ownerItems = []

  const userItems = [
    {
      id: 1,
      label: 'Exit Group',
      onPress: () => exitGroup()
    }
  ]

  const commonItems = [
    {
      id: 1,
      label: 'Share Group',
      onPress: () => shareGroup()
    }
  ]

  const items = owner ? [...commonItems, ...ownerItems] : [...commonItems, ...userItems]

  return <ActionSheet visible={visible} items={items} onCancel={onCancel} />
}
