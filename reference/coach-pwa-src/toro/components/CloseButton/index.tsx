import React, { forwardRef } from 'react'
import Button from 'toro/components/Button'
import { useStyleConfig, SystemStyleObject } from '@chakra-ui/react'
import { CloseIcon } from 'toro/icons'

interface CloseButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  size?: string
  sx?: SystemStyleObject
}

const CloseButton = forwardRef<HTMLButtonElement, CloseButtonProps>(({ size, ...props }, ref) => {
  const { button, icon } = useStyleConfig('CloseButton', { size }) as Record<
    string,
    SystemStyleObject
  >

  return (
    <Button variant="icon-only" size="content" sx={button} {...props} ref={ref}>
      <CloseIcon {...icon} viewBox="0 0 24 24" />
    </Button>
  )
})

export default CloseButton
