import { useCallback, useEffect, useRef, useState } from 'react'
import Box from 'toro/components/Box'
import HtmlContent from 'toro/components/HtmlContent'
import Text from 'toro/components/Text'
import Flex from 'toro/components/Flex'
import Center from 'toro/components/Center'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import useViewportType from 'toro/hooks/useViewportType'
import { useIntl } from 'react-intl'
import { NavChevronUpIcon, NavChevronDownIcon } from 'toro/icons'

function SEOMarkup({ content, accordion, items, containerClassName, toggle, variant }) {
  const styles = useMultiStyleConfig('SEOMarkup', { variant })
  const [isOpen, setIsOpen] = useState(false)
  const { formatMessage } = useIntl()

  const accordionRef = useRef(null)

  const focusFirstAccordionElement = useCallback(() => {
    const accordionElement = accordionRef.current
    if (!accordionElement) return
    const firstFocusableElement = accordionElement.querySelector(
      'a[href], button, [tabindex]:not([tabindex="-1"])'
    )
    if (firstFocusableElement) {
      firstFocusableElement?.focus()
    }
  }, [])

  const onToggleClick = useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  useEffect(() => {
    if (!isOpen) return
    focusFirstAccordionElement()
  }, [isOpen, focusFirstAccordionElement])

  const { isMobile } = useViewportType()
  if (!content) return null
  return (
    <Box sx={styles.seoContent} className={containerClassName} w="100%" id="plp-seo-content-slot">
      <Box m="auto" sx={styles.seoContentContainer(isMobile)} className="seo-contentslot-container">
        <Center flexDirection="column" w="100%">
          <HtmlContent content={content} />
          <Box
            ref={accordionRef}
            sx={styles.seoAccordionWrapper}
            maxHeight={isOpen ? '100%' : 0}
            h="auto"
            overflow="hidden"
            transition="all 0.8s ease-in-out"
            {...(!isOpen && { inert: '' })}
            id="more-content"
          >
            <HtmlContent content={accordion} />
          </Box>
        </Center>
        {!!toggle && (
          <Box
            onClick={onToggleClick}
            mt="14px"
            aria-expanded={isOpen}
            aria-controls="more-content"
            as="button"
            type="button"
          >
            <Flex sx={styles.showMoreWrapper} alignItems="center" justifyContent="center">
              <Text
                sx={styles.showMoreLessButton}
                variant={`${variant || 'seo'}-accordion-toggle`}
                as="div"
                data-qa="show_moreOnplp"
              >
                {!isOpen
                  ? formatMessage({ id: 'pdp.product.showMoreText', defaultMessage: 'Show More' })
                  : formatMessage({ id: 'pdp.product.showLessText', defaultMessage: 'Show Less' })}
              </Text>
              {isOpen ? (
                <NavChevronUpIcon width="24" height="24" />
              ) : (
                <NavChevronDownIcon width="24" height="24" />
              )}
            </Flex>
          </Box>
        )}
      </Box>
      {items.map((item, idx) => (
        <HtmlContent key={`seo-${idx}`} content={item} />
      ))}
    </Box>
  )
}
export default SEOMarkup
