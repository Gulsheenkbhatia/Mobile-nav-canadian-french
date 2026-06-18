import { FunctionComponent, PropsWithChildren, ElementType } from 'react'

type ConditionalWrapperProps = PropsWithChildren<{
  Wrapper: ElementType
  condition: boolean
  [key: string]: any
}>

/*
    This component conditionally wraps the child nodes with the passed in "Wrapper"
    component if the passed in "condition" boolean is true.
*/
const ConditionalWrapper: FunctionComponent<ConditionalWrapperProps> = ({
  Wrapper,
  condition,
  children,
  ...otherProps
}) => {
  return condition ? <Wrapper {...otherProps}>{children}</Wrapper> : <>{children}</>
}

export default ConditionalWrapper
