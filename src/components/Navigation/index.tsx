import React from 'react'

export const navigationRef = React.createRef<any>()

export function navigate(name, params) {
  navigationRef.current?.navigate(name, params)
}
