import React, { useEffect } from 'react'
import Text from 'toro/components/Text'
import HtmlContent from 'toro/components/HtmlContent'
import useAnalytics from 'toro/analytics/useAnalytics'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'

function FooterEmailConsentText({ html }) {
  const analytics = useAnalytics()
  const isHtmlPresent = !!html

  useEffect(() => {
    if (isHtmlPresent) {
      const triggerAnalyticsEvent = (e) => {
        analytics.send('navClick', {
          eventLocation: 'footer',
          text: e.target.getAttribute('data-text'),
        })
      }
      const links = document.querySelectorAll('#footer-email-consent a[data-text]')
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

  const styles = useMultiStyleConfig('FooterEmailConsentTheme')

  if (!isHtmlPresent) {
    return null
  }

  return (
    <Text
      as="div"
      size="md"
      variant="footer-email-consent"
      sx={styles.footerEmailTextStyles}
      id="footer-email-consent"
    >
      <HtmlContent content={html} />
    </Text>
  )
}

export default withErrorBoundaryWrapper(FooterEmailConsentText)
