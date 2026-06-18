import { useState, useEffect, ReactNode } from 'react'

interface IConditionalDelayWrapper {
  children: ReactNode
  condition: boolean
  delay?: number
}

const ConditionalDelayWrapper = ({
  children,
  condition,
  delay = 200,
}: IConditionalDelayWrapper) => {
  const [isShown, setIsShown] = useState<boolean>(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsShown(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay])

  if (!condition) {
    return children
  }

  return isShown ? children : null
}

export default ConditionalDelayWrapper
