import React, { memo } from 'react'

type WrapIfProps = {
  condition: boolean
  Component: React.ElementType
  children: React.ReactNode
  [key: string]: unknown
}

const WrapIf = ({ condition, Component, children, ...rest }: WrapIfProps) =>
  condition ? <Component {...rest}>{children}</Component> : <>{children}</>

export default memo(WrapIf)
