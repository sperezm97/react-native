import React from 'react'
import { StyleSheet } from 'react-native'
// import { avg } from 'react-native-redash'
import { avg } from 'react-native-redash/lib/module/v1'

import Animated from 'react-native-reanimated'

import { Vec3 } from './Constants'

interface FaceProps {
  points: [Vec3, Vec3, Vec3, Vec3]
  backgroundColor: string
}

const Face = ({ points: [p1, p2, p3, p4] }: FaceProps) => {
  return (
    <Animated.View
      pointerEvents='none'
      style={{
        zIndex: avg(p1.z, p2.z, p3.z, p4.z),
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Animated.View
      // style={{
      //   height: SIZE,
      //   width: SIZE,
      //   backgroundColor,
      //   transform
      // }}
      />
    </Animated.View>
  )
}

export default Face
