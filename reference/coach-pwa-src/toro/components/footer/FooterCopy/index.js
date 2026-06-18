import React from 'react'
import Text from 'toro/components/Text'
import Flex from 'toro/components/Flex'
import HtmlContent from 'toro/components/HtmlContent'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'

function FooterCopy({ html }) {
  const styles = useMultiStyleConfig('FooterCopyText')

  if (!html) {
    return null
  }

  return (
    <Flex justifyContent="center" w="100%" sx={styles.footerCopyContainer}>
      <Text size="sm" variant="footer-copy" width="auto" as="div" sx={styles.footerCopyText}>
        <HtmlContent content={html} />
      </Text>
    </Flex>
  )
}

export default withErrorBoundaryWrapper(FooterCopy)
