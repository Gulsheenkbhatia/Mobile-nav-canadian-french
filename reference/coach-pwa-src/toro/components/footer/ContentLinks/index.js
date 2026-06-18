import { useMemo, useContext, useRef, useEffect, memo, useCallback } from 'react'
import Text from 'toro/components/Text'
import get from 'lodash/get'
import isArray from 'lodash/isArray'
import size from 'lodash/size'
import useTheme from 'toro/hooks/useTheme'
import GridItem from 'toro/components/GridItem'
import Accordion from 'toro/components/Accordion'
import AccordionItem from 'toro/components/AccordionItem'
import AccordionButton from 'toro/components/AccordionButton'
import AccordionPanel from 'toro/components/AccordionPanel'
import useAnalytics from 'toro/analytics/useAnalytics'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import PWAContext from 'components/common/PWAContext'
import { handleFeedbackButtonClick } from 'toro/helpers/feedbackFormHelpers'
import HtmlContent from 'toro/components/HtmlContent'
import getCurrentLocale from 'toro/helpers/getCurrentLocale'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import usePreference from 'toro/hooks/usePreference'
import { getSiteValueFromPref } from 'toro/helpers/preferences'
import useTulipLiveConnect from 'toro/hooks/useTulipLiveConnect'
import initTulipLiveChat from 'toro/helpers/initTulipLiveChat'
import ContentLink from 'toro/components/footer/ContentLink'
import modifyMedalliaLink from 'toro/helpers/modifyMedalliaLink'
import Cookies from 'js-cookie'
import { QUANTUM_METRIC_SESSION_ID } from 'toro/constants/cookies'

function ContentLinks({ links, isMobileMenu }) {
  const { appData } = useContext(PWAContext)
  const theme = useTheme()
  const analytics = useAnalytics()
  const { space, letterSpacings, lineHeights } = theme
  const feedbackFormData = get(appData, 'contentAssetForFeedbackForm', {})
  const locale = get(appData, 'locale', '')
  const currentLocale = useMemo(() => {
    const currentLocaleData = getCurrentLocale(locale)
    return currentLocaleData.locale
  }, [locale])
  const feedbackFormHTML =
    get(feedbackFormData, `c_body.${currentLocale}.markup`) ||
    get(feedbackFormData, `c_body.default.markup`)
  const styles = useMultiStyleConfig('ContentLinks')
  const { AccordionIcon, AccordionIconExpanded } = useMultiStyleConfig('Icons')
  const changeNavDrawerContentLinkPositionPref = usePreference({
    groupId: 'ToggleSiteFeatures',
    preferenceId: 'changeNavDrawerContentLinkPosition',
  })
  const changeNavDrawerContentLinkPositionPrefValue = getSiteValueFromPref(
    changeNavDrawerContentLinkPositionPref,
    appData?.siteId,
    false
  )

  const handleLinkClick =
    ({ text }) =>
    () => {
      analytics.send('navClick', {
        eventLocation: 'footer',
        text,
      })
    }
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
        handleLinkClick({ text })()
      }
    }

  const mappedLinks = useMemo(() => {
    return links?.map(({ items, ...rest }) => ({
      items: modifyMedalliaLink(handleMedalliaClick, items),
      ...rest,
    }))
  }, [links, handleMedalliaClick])

  const cleanup = useRef()

  const { tulipConfigData } = useTulipLiveConnect()

  const handleStylingChat = useCallback(() => {
    analytics.send('productInteraction', {
      eventLocation: 'attributes',
      eventAction: 'need stylists advice',
    })

    if (window.tuliplivechat) {
      initTulipLiveChat(tulipConfigData)
    }
  }, [tulipConfigData])

  const handleFeedbackButton = (item) => {
    if (item?.toUpperCase() === 'FEEDBACK') {
      const curr = cleanup.current
      const next = handleFeedbackButtonClick()
      cleanup.current = () => {
        curr && curr()
        next()
      }
    }
  }

  useEffect(() => {
    return () => {
      cleanup.current && cleanup.current()
    }
  }, [])

  if ((!isArray(mappedLinks) || !mappedLinks.length) && !feedbackFormHTML) {
    return null
  }

  if (isMobileMenu) {
    return (
      <>
        <HtmlContent className="content-asset_feedbackForm" content={feedbackFormHTML} />
        <Accordion w="100%" mb={changeNavDrawerContentLinkPositionPrefValue ? 0 : 100} allowToggle>
          {mappedLinks.map(({ title, items }, idx) => (
            <AccordionItem w="100%" border="none" key={`${idx}-${get(title, 'text', '')}`}>
              {({ isExpanded }) => (
                <>
                  <AccordionButton
                    sx={styles.contentLinkAccordionButton}
                    justifyContent="space-between"
                    data-qa={get(title, 'dataQa', '').replace(/^d/g, 'm')}
                  >
                    {title && (
                      <Text size="sm" variant="body-primary" sx={styles.gridItemTextMobile}>
                        {title.text?.toLowerCase()}
                      </Text>
                    )}
                    {isExpanded ? (
                      <AccordionIconExpanded style={styles.accordionIcon} />
                    ) : (
                      <AccordionIcon style={styles.accordionIcon} />
                    )}
                  </AccordionButton>
                  <AccordionPanel pb={4} px={0}>
                    {items?.map((item) => (
                      <ContentLink
                        key={get(item, 'text', '')}
                        text={get(item, 'text', '')}
                        href={get(item, 'href', '')}
                        target={get(item, 'target', '')}
                        data-qa={get(item, 'dataQa', '')}
                        rel={get(item, 'rel', '')}
                        handleFeedbackButton={handleFeedbackButton}
                        handleStylingChat={handleStylingChat}
                        handleLinkClick={get(item, 'onClick', handleLinkClick)}
                      >
                        <Text
                          size="md"
                          variant="body-text-secondary"
                          sx={styles.gridItemTextSecondaryMobile}
                        >
                          {get(item, 'text', '')}
                        </Text>
                      </ContentLink>
                    ))}
                  </AccordionPanel>
                </>
              )}
            </AccordionItem>
          ))}
        </Accordion>
      </>
    )
  }

  return (
    <>
      <HtmlContent className="content-asset_feedbackForm" content={feedbackFormHTML} />
      <GridItem sx={styles.gridItem} colStart={1} colEnd={4}>
        {size(mappedLinks) ? (
          mappedLinks.map(({ title, items }, idx) => (
            <GridItem key={`${idx}-${get(title, 'text', '')}`} colSpan={{ md: 2, base: 1 }}>
              {title?.text && (
                <Text
                  size="sm"
                  variant="body-primary"
                  mb={space.l}
                  letterSpacing={letterSpacings.xl}
                  lineHeight={lineHeights.xs}
                  data-qa={title?.dataQa}
                  fontWeight="bold"
                  sx={styles.gridItemText}
                >
                  {title?.text}
                </Text>
              )}
              {items?.map((item) => (
                <ContentLink
                  key={get(item, 'text', '')}
                  text={get(item, 'text', '')}
                  href={get(item, 'href', '')}
                  target={get(item, 'target', '')}
                  data-qa={get(item, 'dataQa', '')}
                  rel={get(item, 'rel', '')}
                  handleFeedbackButton={handleFeedbackButton}
                  handleStylingChat={handleStylingChat}
                  handleLinkClick={get(item, 'onClick', handleLinkClick)}
                >
                  <Text size="sm" variant="body-text-secondary" sx={styles.gridItemTextSecondary}>
                    {get(item, 'text', '')}
                  </Text>
                </ContentLink>
              ))}
            </GridItem>
          ))
        ) : (
          <>
            <GridItem colSpan={1} />
            <GridItem colSpan={1} />
          </>
        )}
      </GridItem>
    </>
  )
}

export default memo(withErrorBoundaryWrapper(ContentLinks))
