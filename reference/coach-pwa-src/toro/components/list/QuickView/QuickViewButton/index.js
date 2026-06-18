import React, { memo } from 'react'
import Button from 'toro/components/Button'
import { useIntl } from 'react-intl'

const QuickViewButton = ({ buttonRef, ...props }) => {
  const { formatMessage } = useIntl()

  return (
    <Button ref={buttonRef} variant="quickView" width="100%" {...props}>
      {formatMessage({ id: 'plp.quickview.button' })}
    </Button>
  )
}

export default memo(QuickViewButton)
