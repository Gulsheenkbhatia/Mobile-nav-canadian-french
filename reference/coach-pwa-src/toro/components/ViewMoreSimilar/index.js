import { useMemo } from 'react'
import Box from 'toro/components/Box'
import Text from 'toro/components/Text'
import Button from 'toro/components/Button'
import { useIntl } from 'react-intl'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import useExperiment from 'toro/hooks/useExperiment'
import { EXPERIMENTS } from 'toro/constants/experiments'
import usePreference from 'toro/hooks/usePreference_new'
import get from 'lodash/get'
import useViewportType from 'toro/hooks/useViewportType'
import useAEDrawer from 'toro/hooks/useAEDrawer'
import useAnalytics from 'toro/analytics/useAnalytics'
import { useAtomValue } from 'jotai/utils'
import { productDataAtom } from 'store/pdp.atom'
import useAnalyticsEventsRec from 'toro/components/RecommendationsContainer/useAnalyticsEventsRec'
import RecommendationItemTile from 'toro/components/RecommendationItemTile'
import { xgenRecommendationsDataAtom } from 'store/xgen-recommendations.atom'
import Arrow from 'toro/icons/arrow.svg' // TODO: change to design token after sub task DIGIT-31095 will be done
import useTemplate from 'toro/hooks/useTemplate'
import { TemplateName } from 'toro/constants/templates'
import useHeaderHeight from 'toro/hooks/useHeaderHeight'
import useIsKS from 'toro/helpers/isKS'

const RECOMMENDATIONS_LIMIT = 4

const ViewMoreSimilar = ({ selectedVariantId, variant, hidePromotions = false }) => {
  const styles = useMultiStyleConfig('SimilarOptionJumpLinkStyles', { variant })
  const analytics = useAnalytics()
  const productData = useAtomValue(productDataAtom)
  const recommendations = useAtomValue(xgenRecommendationsDataAtom)
  const headerHeight = useHeaderHeight()
  const isKateSpade = useIsKS()

  const { formatMessage } = useIntl()

  const {
    adaptiveExperience: { enableAEDrawerExp },
  } = usePreference({
    adaptiveExperience: ['enableAEDrawerExp'],
  })

  const setAEDrawerConfig = useAEDrawer()

  const { isMobile } = useViewportType()
  const isPDPv5_1Enabled = useTemplate([TemplateName.pdpv5_1])
  const isPDPv6Enabled = useTemplate([TemplateName.pdpv6])
  const marginTop = isKateSpade && isPDPv6Enabled ? headerHeight : 0
  const showArrowIcon = isPDPv6Enabled || isPDPv5_1Enabled

  const isViewMoreSimilarEnabled =
    useExperiment(EXPERIMENTS.VIEW_MORE_SIMILAR_PRODUCTS_PDP) && (isMobile || isPDPv5_1Enabled)

  const [recommender] = get(enableAEDrawerExp, 'PDP.recommenders', [])

  const {
    items = [],
    vendor,
    containerDisplayName,
    strategyId,
    containerId,
  } = recommendations?.[recommender] || {}

  const limitedItems = useMemo(() => {
    return items.slice(0, RECOMMENDATIONS_LIMIT)
  }, [items])

  const analyticsEvents = useAnalyticsEventsRec({
    containerId,
    vendor,
    label: containerDisplayName,
    strategyId,
  })

  const viewMoreButtonText = formatMessage({
    id: 'pdp.viewMoreButton',
    defaultMessage: 'View More',
  })

  const viewMoreSimilarProductsTitleText = formatMessage({
    id: 'pdp.viewMoreSimilarProductsTitle',
    defaultMessage: 'More options for you',
  })

  function handleAnalyticsEvent(eventAction) {
    analytics.send('productInteraction', {
      eventAction: `view similar products CTA ${eventAction}`,
      eventLocation: 'product image',
      eventLabel: selectedVariantId,
    })
  }

  const handleClick = () => {
    handleAnalyticsEvent('click')
    if (setAEDrawerConfig) {
      setAEDrawerConfig({
        showDrawer: true,
        activeProduct: productData,
        shouldClearSchemeData: false,
        eventLocation: 'alt image carousel',
      })
    }
  }

  if (!isViewMoreSimilarEnabled || items.length === 0) {
    return null
  }

  return (
    <Box marginTop={marginTop} sx={styles.viewMoreOverlay}>
      <Box sx={styles.similarOptionsContainer}>
        <Text sx={styles.similarOptionsTitle}>{viewMoreSimilarProductsTitleText}</Text>
        <Box id="recommendations-section" className="xgen_wrapper">
          <Box sx={styles.similarOptionsProductsContainer}>
            {limitedItems.map((product, idx) => (
              <RecommendationItemTile
                key={product.id}
                idx={idx}
                containerId={containerId}
                strategyId={strategyId}
                productItem={product}
                styleVariant={variant}
                analyticsEvents={analyticsEvents}
                containerLabel={viewMoreSimilarProductsTitleText}
                vendor={vendor}
                hideWishlist
                hidePromotions={hidePromotions}
              />
            ))}
          </Box>
        </Box>
        <Button
          data-qa="view_more_similar_pdp"
          sx={styles.viewMoreSimilarButton}
          variant="secondary"
          onClick={handleClick}
        >
          <Text sx={styles.viewMoreButtonText}>
            {viewMoreButtonText}
            {showArrowIcon && <Arrow width="16px" height="16px" />}
          </Text>
        </Button>
      </Box>
    </Box>
  )
}

export default ViewMoreSimilar
