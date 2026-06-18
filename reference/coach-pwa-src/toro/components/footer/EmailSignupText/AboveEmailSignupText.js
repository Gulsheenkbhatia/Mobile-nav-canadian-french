import React from 'react'
import Text from 'toro/components/Text'
import HtmlContent from 'toro/components/HtmlContent'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import useViewportType from 'toro/hooks/useViewportType'

function AboveEmailSignupText({ html }) {
  const { isDesktop } = useViewportType()

  const styles = useMultiStyleConfig('EmailSignupText')

  if (!html) {
    return null
  }

  return (
    <Text
      as="div"
      size="md"
      variant="email-description"
      sx={styles.privacyPolicyTextStyles(isDesktop)}
      id="mw-above-email-signup-text"
    >
      <HtmlContent content={html} />
    </Text>
  )
}

export default withErrorBoundaryWrapper(AboveEmailSignupText)
