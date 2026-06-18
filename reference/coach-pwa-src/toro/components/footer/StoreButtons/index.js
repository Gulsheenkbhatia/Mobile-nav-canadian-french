import React from 'react'
import { Box, useMultiStyleConfig } from '@chakra-ui/react'
import HtmlContent from 'toro/components/HtmlContent'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import useViewportType from 'toro/hooks/useViewportType'

function StoreButtons({ html }) {
  const styles = useMultiStyleConfig('StoreButtons')
  const { isDesktop } = useViewportType()

  if (!html) {
    return null
  }
  return (
    <Box
      className="store-buttons-links"
      as="div"
      sx={styles.storeButtonContainer(isDesktop)}
      w="70%"
    >
      <HtmlContent content={html} />
    </Box>
  )
}

export default withErrorBoundaryWrapper(StoreButtons)
