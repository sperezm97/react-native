import React from 'react'

import * as Svg from '../../../assets/Icons'

const Icon = ({ name, size = 22, color = 'white' }) => {
  const SvgIcon = Svg[name]

  return <SvgIcon width={size} height={size} color={color} />
}

export default Icon
