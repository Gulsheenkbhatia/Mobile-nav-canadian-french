import React, { useEffect } from 'react'
import Text from 'toro/components/Text'
import HtmlContent from 'toro/components/HtmlContent'
import useAnalytics from 'toro/analytics/useAnalytics'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import useViewportType from 'toro/hooks/useViewportType'

function EmailSignupText({ html }) {
  const analytics = useAnalytics()
  const { isDesktop } = useViewportType()
  const isHtmlPresent = !!html

  useEffect(() => {
    if (isHtmlPresent) {
      const triggerAnalyticsEvent = (e) => {
        analytics.send('navClick', {
          eventLocation: 'footer',
          text: e.target.getAttribute('data-text'),
        })
      }
      const links = document.querySelectorAll('#mw-email-signup-text a[data-text]')
      links?.forEach((link) => {
        link.addEventListener('click', triggerAnalyticsEvent)
      })
      return () => {
        links?.forEach((link) => {
          link.removeEventListener('click', triggerAnalyticsEvent)
        })
      }
    }
  }, [isHtmlPresent])

  const styles = useMultiStyleConfig('EmailSignupText')

  if (!isHtmlPresent) {
    return null
  }

  return (
    <Text
      as="div"
      size="md"
      variant="email-description"
      sx={styles.privacyPolicyTextStyles(isDesktop)}
      id="mw-email-signup-text"
    >
      <HtmlContent content={html} />
    </Text>
  )
}

export default withErrorBoundaryWrapper(EmailSignupText)
