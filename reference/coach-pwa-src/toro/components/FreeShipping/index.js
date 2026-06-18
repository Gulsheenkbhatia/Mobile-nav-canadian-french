import React from 'react'
import HtmlContent from 'toro/components/HtmlContent'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'

function FreeShipping({ body }) {
  const styles = useMultiStyleConfig('FreeShipping')

  return <HtmlContent content={body} sx={styles.freeShippingContent} />
}

export default withErrorBoundaryWrapper(FreeShipping)
