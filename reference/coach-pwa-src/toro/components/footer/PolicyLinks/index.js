import { useMemo } from 'react'
import Text from 'toro/components/Text'
import Flex from 'toro/components/Flex'
import Link from 'toro/components/Link'
import Button from 'toro/components/Button'
import useViewportType from 'toro/hooks/useViewportType'
import useAnalytics from 'toro/analytics/useAnalytics'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import initializeOneTrust from 'toro/lib/onetrust'
import Cookies from 'js-cookie'
import { QUANTUM_METRIC_SESSION_ID } from 'toro/constants/cookies'
import modifyMedalliaLink from 'toro/helpers/modifyMedalliaLink'

function PolicyLinks({ links, dataQa }) {
  const { isDesktop, isMobile, isTablet } = useViewportType()
  const analytics = useAnalytics()

  const styles = useMultiStyleConfig('FooterPolicyLinks')

  const handleMedalliaClick =
    ({ text, href, target }) =>
    (event) => {
      event.stopPropagation()
      event.preventDefault()
      try {
        const quantumMetricSessionId = Cookies.get(QUANTUM_METRIC_SESSION_ID)
        const medalliaUrl = new URL(href)
        if (quantumMetricSessionId) {
          medalliaUrl.searchParams.set('QMID', quantumMetricSessionId)
        }
        window.open(medalliaUrl.href, target)
      } catch (e) {
        console.error('Cant edit medallia url', e?.message)
      } finally {
        handleLinkClick({ text })
      }
    }

  const mappedLinks = useMemo(
    () => modifyMedalliaLink(handleMedalliaClick, links),
    [links, handleMedalliaClick]
  )

  const handleLinkClick =
    ({ text }) =>
    () => {
      analytics.send('navClick', {
        eventLocation: 'footer',
        text,
      })
    }

  const PolicyLink = ({ children, className, ...rest }) => {
    return /ot-sdk-show-settings/.test(className) ? (
      <Button
        variant="link"
        cursor="pointer"
        sx={{ ...styles.linkPolicyLinks, ...styles.textPolicyLinks }}
        {...rest}
        onClick={(e) => {
          initializeOneTrust(e).catch(console.error)
        }}
      >
        {children}
      </Button>
    ) : (
      <Link className={className} sx={styles.linkPolicyLinks} {...rest}>
        <Text
          maxWidth={isDesktop ? 'auto' : isTablet ? '200px' : '175px'}
          minWidth={isDesktop ? 'auto' : isTablet ? '200px' : '163px'}
          size="sm"
          variant="body-primary"
          sx={styles.textPolicyLinks}
        >
          {children}
        </Text>
      </Link>
    )
  }

  return (
    <Flex
      sx={
        !isDesktop
          ? {
              display: 'flex',
              gridTemplateColumns: 'auto auto',
              justifyContent: isMobile ? 'space-between' : 'space-around',
              ...styles.policyLinksWrap,
            }
          : {
              ...styles.policyLinksWrap,
            }
      }
      justifyContent={{
        md: 'space-around',
        lg: 'center',
      }}
      w="100%"
      flexWrap="wrap"
      data-qa={dataQa}
    >
      {mappedLinks?.length > 0 &&
        mappedLinks.map(({ href, text, dataQa, target, className, onClick = handleLinkClick }) => (
          <PolicyLink
            className={className}
            href={href}
            key={text}
            display="block"
            width={{
              md: 'auto',
              base: '50%',
            }}
            data-qa={dataQa}
            onClick={onClick({ text, href, target })}
            target={target}
          >
            {text}
          </PolicyLink>
        ))}
    </Flex>
  )
}

export default withErrorBoundaryWrapper(PolicyLinks)
