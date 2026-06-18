import { useCallback, useEffect } from 'react'
import {
  productDataAtom,
  isTabbedAdaptivePDPEligibleAtom,
  setActiveTabIndexAtom,
} from 'store/pdp.atom'
import Box from 'toro/components/Box'
import Flex from 'toro/components/Flex'
import Text from 'toro/components/Text'
import Button from 'toro/components/Button'
import { useIntl } from 'react-intl'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import { useScrollToWithDomModifications } from 'toro/hooks/useScrollToWithDomModifications'
import useAEDrawer from 'toro/hooks/useAEDrawer'
import useAnalytics from 'toro/analytics/useAnalytics'
import { useUpdateAtom, useAtomValue } from 'jotai/utils'
import useExperiment from 'toro/hooks/useExperiment'
import { EXPERIMENTS } from 'toro/constants/experiments'
import Arrow from 'toro/icons/arrow.svg' // TODO: change to design token after sub task DIGIT-31095 will be done
import useTemplate from 'toro/hooks/useTemplate'
import { TemplateName } from 'toro/constants/templates'
import useHeaderHeight from 'toro/hooks/useHeaderHeight'
import useIsKS from 'toro/helpers/isKS'
import ImpressionSensor from 'toro/analytics/ImpressionSensor'

const TABBED_SIMILAR_TAB = 2

const SimilarOptionJumplink = ({ selectedVariantId, variant }) => {
  const { formatMessage } = useIntl()
  const analytics = useAnalytics()
  const styles = useMultiStyleConfig('SimilarOptionJumpLinkStyles', { variant })
  const isTabbedAdaptivePDP = useAtomValue(isTabbedAdaptivePDPEligibleAtom)
  const setActiveTabIndex = useUpdateAtom(setActiveTabIndexAtom)
  const isPdpV41Enabled = useExperiment(EXPERIMENTS.PDP_V4_1)
  const isPDPv5_1Enabled = useTemplate([TemplateName.pdpv5_1])
  const isPDPv6Enabled = useTemplate([TemplateName.pdpv6])
  const headerHeight = useHeaderHeight()
  const isKateSpade = useIsKS()
  const marginTop = isKateSpade && isPDPv6Enabled ? headerHeight : 0
  const showArrowIcon = isPDPv6Enabled || isPDPv5_1Enabled

  const productData = useAtomValue(productDataAtom)

  const seeSimilarProductsButtonText = formatMessage({
    id: 'pdp.seeSimilarProductsButton',
    defaultMessage: 'SEE SIMILAR PRODUCTS',
  })
  const seeSimilarProductsButtonAdaptivePDPText = formatMessage({
    id: 'pdp.viewMoreLikeThisButton',
    defaultMessage: 'View more like this',
  })
  const seeSimilarProductsTitleText = formatMessage({
    id: 'pdp.seeSimilarProductsTitle',
    defaultMessage: 'Looking for something similar?',
  })

  function handleAnalyticsEvent(eventAction) {
    analytics.send('productInteraction', {
      eventAction: `view similar products CTA ${eventAction}`,
      eventLocation: 'product image',
      eventLabel: selectedVariantId,
    })
  }

  const setAEDrawerConfig = useAEDrawer()

  const handleImpression = useCallback(() => {
    handleAnalyticsEvent('impression')
  }, [])

  const { scrollTo, clearTimer } = useScrollToWithDomModifications()
  const handleClick = useCallback(() => {
    handleAnalyticsEvent('click')
    if (isTabbedAdaptivePDP) {
      setActiveTabIndex(TABBED_SIMILAR_TAB)
    }
    if (setAEDrawerConfig) {
      setAEDrawerConfig({
        showDrawer: true,
        activeProduct: productData,
        eventLocation: 'alt image carousel',
      })
    } else {
      const recommendationContainer = document.querySelector(
        '#recommendations-section.certona_wrapper'
      )
      scrollTo(recommendationContainer)
    }
  }, [])

  useEffect(() => clearTimer(), [])

  return (
    <>
      <Box
        sx={{
          ...styles.similarOptionJumpLinkOverlay,
          ...(isPdpV41Enabled && styles.similarOptionJumpLinkOverlayCustomPaginationPosition),
        }}
      />
      <ImpressionSensor onVisible={handleImpression}>
        <Flex marginTop={marginTop} sx={styles.similarOptionJumpLinkContainer}>
          <Text sx={styles.similarOptionJumpLinkText}>{seeSimilarProductsTitleText}</Text>
          <Button
            data-qa="view_similar_pdp"
            sx={styles.similarOptionJumpLinkButtom}
            variant={'secondary'}
            onClick={handleClick}
          >
            {isTabbedAdaptivePDP
              ? seeSimilarProductsButtonAdaptivePDPText
              : seeSimilarProductsButtonText}
            {showArrowIcon && <Arrow width="16px" height="16px" />}
          </Button>
        </Flex>
      </ImpressionSensor>
    </>
  )
}

export default SimilarOptionJumplink
