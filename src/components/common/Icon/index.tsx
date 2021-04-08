import React from 'react'

import * as Svg from '../../../assets/Icons'

const Icon = ({ name, size = 22, color = 'white', fill }) => {
  const SvgIcon = Svg[name]

  return <SvgIcon width={size} height={size} color={color} fill={fill} />
}

export default Icon
