import Box from 'toro/components/Box'
import InfoIcon from 'toro/icons/Info.svg'
import { useIntl } from 'react-intl'
import { memo, useCallback, useEffect, useRef } from 'react'
import Flex from 'toro/components/Flex'
import Button from 'toro/components/Button'
import Text from 'toro/components/Text'
import useDisclosure from 'toro/hooks/useDisclosure'
import PopoverTrigger from 'toro/components/PopoverTrigger'
import PopoverContent from 'toro/components/PopoverContent'
import PopoverArrow from 'toro/components/PopoverArrow'
import PopoverBody from 'toro/components/PopoverBody'
import Popover from 'toro/components/Popover'
import usePreference from 'toro/hooks/usePreference_new'
import useViewportType from 'toro/hooks/useViewportType'
import useAnalytics from 'toro/analytics/useAnalytics'
import useSelectedVariantData from 'toro/hooks/useSelectedVariantData'

const ReviewIncentivizedDetail = ({ styles }) => {
  const { formatMessage } = useIntl()
  const { isOpen, onClose, onOpen, onToggle } = useDisclosure()
  const triggerRef = useRef(null)
  const { isMobile } = useViewportType()
  const analytics = useAnalytics()
  const variantId = useSelectedVariantData('id')
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const {
    toggleSiteFeatures: { enableIncentivizedBadge = false },
  } = usePreference({
    ToggleSiteFeatures: ['enableIncentivizedBadge'],
  })

  const sendIncentivizedBadgeEvent = useCallback(() => {
    analytics.send('reviewInteraction', {
      eventLocation: 'product',
      eventAction: 'incentivized badge click',
      eventLabel: variantId,
    })
  }, [analytics, variantId])

  const handleClick = () => {
    if (!isMobile) return
    sendIncentivizedBadgeEvent()
    onToggle()
  }

  const clearHoverTimeout = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
      hoverTimeoutRef.current = null
    }
  }

  const handleMouseEnter = () => {
    if (isMobile) return
    onOpen()

    clearHoverTimeout()

    // Delay analytics event by 1 second to qualify as intentional engagement
    hoverTimeoutRef.current = setTimeout(() => {
      if (!isOpen) {
        sendIncentivizedBadgeEvent()
      }
      hoverTimeoutRef.current = null
    }, 1000)
  }

  const handleMouseLeave = () => {
    clearHoverTimeout()
  }

  useEffect(() => {
    if (!isOpen) {
      return
    }

    window.addEventListener('scroll', onClose, true)
    window.addEventListener('wheel', onClose, { passive: true })
    window.addEventListener('touchmove', onClose, { passive: true })

    return () => {
      window.removeEventListener('scroll', onClose, true)
      window.removeEventListener('wheel', onClose, false)
      window.removeEventListener('touchmove', onClose, false)
      clearHoverTimeout()
    }
  }, [isOpen, onClose])

  if (!enableIncentivizedBadge) {
    return null
  }

  return (
    <Flex className="incentivized-review" sx={styles} data-qa="incentivized-review">
      <Box className="incentivized-review-title">
        {formatMessage({
          id: 'pdp.product.reviewRatingIncentivized',
          defaultMessage: 'Incentivized',
        })}
      </Box>
      <Popover
        isOpen={isOpen}
        onClose={onClose}
        placement="bottom"
        closeOnBlur={true}
        closeOnEsc={true}
        isLazy
        offset={[60, 10]}
      >
        <PopoverTrigger>
          <Box
            ref={triggerRef}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            cursor="pointer"
            display="inline-flex"
            className="incentivized-review-icon"
            data-qa="incentivized-review-icon"
            tabIndex={0}
            aria-label={formatMessage({
              id: 'pdp.product.reviewRatingIncentivizedInfo',
              defaultMessage: 'More information about incentivized review',
            })}
            role="button"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                handleClick()
              }
            }}
          >
            <InfoIcon width="15" height="15" />
          </Box>
        </PopoverTrigger>
        <PopoverContent
          className="incentivized-review-content"
          data-qa="incentivized-review-content"
        >
          <PopoverArrow bg="var(--color-neutral-dark, #333)" />
          <PopoverBody p="0">
            <Flex className="incentivized-review-body">
              <Text
                className="incentivized-review-body-text"
                data-qa="incentivized-review-body-text"
              >
                {formatMessage({
                  id: 'pdp.product.reviewRatingIncentivizedDetail',
                  defaultMessage:
                    'This reviewer received promo considerations or sweepstakes entry for writing a review.',
                })}
              </Text>
              <Button
                variant="primary"
                onClick={onClose}
                size="sm"
                className="incentivized-review-body-button"
                data-qa="incentivized-review-body-button"
              >
                {formatMessage({
                  id: 'pdp.product.reviewRatingIncentivizedDetailButton',
                  defaultMessage: 'Got it!',
                })}
              </Button>
            </Flex>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Flex>
  )
}

export default memo(ReviewIncentivizedDetail)
