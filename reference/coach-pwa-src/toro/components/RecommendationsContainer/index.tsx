import noop from 'lodash/noop'
import { type FC, memo, type ReactNode, useEffect, useMemo } from 'react'
import { useInView } from 'react-intersection-observer'

import Box from 'toro/components/Box'
import Flex from 'toro/components/Flex'
import Text from 'toro/components/Text'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import useVariantGroupData from 'toro/hooks/useVariantGroupData'

import useViewportType from 'toro/hooks/useViewportType'
import useRecommendations from 'toro/hooks/useRecommendations'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'

import StylesProvider from 'toro/components/StylesProvider'
import CertonaSkeleton from 'toro/components/Certona/CertonaSkeleton'
import RecommendationItemTile from 'toro/components/RecommendationItemTile'
import MobileRecommendations from 'toro/components/RecommendationsContainer/MobileRecommendations'
import DesktopRecommendations from 'toro/components/RecommendationsContainer/DesktopRecommendations'
import useAnalyticsEventsRec from 'toro/components/RecommendationsContainer/useAnalyticsEventsRec'
import {
  RecommendationStyles,
  ResponseRecommendations,
} from 'toro/components/RecommendationsContainer/types'
import useProductData from 'toro/hooks/useProductData'
import withSchemeValidation from 'toro/hocs/withSchemeValidation'
import PostAddToCartDrawer2upGrid from 'toro/components/RecommendationsContainer/PostAddToCartDrawer2upGrid'
import { XgenContainerID } from 'lib/xgen'
import RecommendationWrapper from 'toro/components/RecommendationsContainer/RecommendationWrapper'
import HomeFeaturedProductsJsonLd from 'toro/components/RecommendationsContainer/HomeFeaturedProductsJsonLd'

export type ContainerSupportedTypes =
  | 'ymal'
  | 'recentlyviewed'
  | 'addtocart'
  | 'productlisting1_rr'
  | 'productlisting2_rr'
  | 'productlisting3_rr'
  | 'productlisting4_rr'
  | 'productlisting5_rr'
  | 'productlisting7_rr'
  | 'home1_rr'
  | 'home3_rr'
  | 'ae_drawer'
  | 'ae_drawer_plp'
  | 'product3_rr'
  | 'product6_rr'
  | 'sm_el_plp7'
  | 'sm_el_plp_top_products'
  | 'sm_el_plp5'
  | 'sm_el_pdp4'
  | 'sm_el_pdp7'
  | 'sm_el_plp8'
  | 'sm_el_nosearch1'
  | 'sm_el_sitewide1'
  | 'upsellRecs'

type RecommendationsContainerProps = {
  type: ContainerSupportedTypes
  variant?:
    | 'baseStyle'
    | 'recommendationsOnHP'
    | 'pdpV3ATCRecommendationMobile'
    | 'aeDrawer'
    | 'aeDrawerGrid'
    | 'aeDrawerGridSocial'
    | 'similarProductRecommendation'
    | 'similarProductRecommendationAdaptivePDP'
    | 'recomCarouselThink'
    | 'pdpv5_1'
    | 'inlinePDPv6'
    | 'plpTopProducts'
    | 'tabbedPDPRecommendation'
    | 'tabbedRecommendation'
    | 'goneViralRecommendation'
    | 'goneViralRecommendationPLP'
    | 'recentlyViewedV7'
    | 'visuallySimilarPDPv7'
    | 'recommendationsStack'
    | 'postATBMobile'
    | 'postAddToCartDrawer'
  vgId?: string
  onResponse?: (response: ResponseRecommendations) => void
  navigation?: ReactNode
  footer?: ReactNode
  showItemSkeletons?: boolean
  title?: string
  hideLabel?: boolean
  showRecommendationTitle?: boolean
  showDivider?: boolean
  limit?: number
  styles?: RecommendationStyles
  hideWishlist?: boolean
  closeAeDrawer?: () => void
  enableHeaderTitle?: boolean
  headerTitle?: string
  enableInlineAddToBag?: boolean
  styleVariantOverride?: string
  /** When true, emits CollectionPage JSON-LD for featured products (homepage only; DIGIT-37216). */
  emitHomeFeaturedProductsJsonLd?: boolean
}

enum STYLES_VARIANTS {
  productlisting1_rr = 'PLP',
  productlisting2_rr = 'PLP',
  productlisting3_rr = 'PLP',
  productlisting4_rr = 'PLP',
  sm_el_plp8 = 'PLP',
  productlisting7_rr = 'tabbedPLP',
  product6_rr = 'tabbedPDP',
  sm_el_plp7 = 'tabbedPLP',
  home1_rr = 'recommendationsOnHP',
  home3_rr = 'tabbedHP',
  addtocart = 'pdpV3ATCRecommendationMobile',
  recentlyviewed = 'recentlyViewed',
  ymal = 'pdpv5_1',
  sm_el_nosearch1 = 'recommendationsOnHP',
  upsellRecs = 'recommendationsStack',
}

enum APPLY_SAME_VARIANT {
  recomCarouselThink = 'recomCarouselThink',
  inlinePDPv6 = 'inlinePDPv6',
  recentlyViewedV7 = 'recentlyViewedV7',
  visuallySimilarPDPv7 = 'recentlyViewedV7',
  recommendationsStack = 'recommendationsStack',
  postATBMobile = 'postATBMobile',
}

/*
 * Some containers require a selected variant group id to fetch recommendations,
 * while others can fetch recommendations without it.
 * The conditions below define whether the container can fetch recommendations based on its type and the presence of a selected variant group id.
 * And avoid multiple condition checks in the useEffect hook.
 * */
const containerFetchingConditions: Record<
  ContainerSupportedTypes,
  (type: ContainerSupportedTypes, selectedVgId?: string) => boolean
> = {
  ymal: (type, selectedVgId) => !!selectedVgId,
  recentlyviewed: (type, selectedVgId) => !!selectedVgId,
  addtocart: (type, selectedVgId) => true,
  home1_rr: (type, selectedVgId) => true,
  home3_rr: (type, selectedVgId) => true,
  product3_rr: (type, selectedVgId) => true,
  product6_rr: (type, selectedVgId) => true,
  productlisting1_rr: (type, selectedVgId) => true,
  productlisting2_rr: (type, selectedVgId) => true,
  productlisting3_rr: (type, selectedVgId) => true,
  productlisting4_rr: (type, selectedVgId) => true,
  productlisting5_rr: (type, selectedVgId) => true,
  productlisting7_rr: (type, selectedVgId) => true,
  sm_el_plp8: (type, selectedVgId) => true,
  ae_drawer: (type, selectedVgId) => true,
  ae_drawer_plp: (type, selectedVgId) => true,
  sm_el_plp7: (type, selectedVgId) => true,
  sm_el_plp_top_products: (type, selectedVgId) => true,
  sm_el_plp5: (type, selectedVgId) => true,
  sm_el_pdp4: (type, selectedVgId) => true,
  sm_el_pdp7: (type, selectedVgId) => true,
  sm_el_nosearch1: (type, selectedVgId) => true,
  sm_el_sitewide1: (type, selectedVgId) => true,
  upsellRecs: (type, selectedVgId) => true,
}

const desktopVariantComponents = {
  aeDrawerGrid: MobileRecommendations,
  aeDrawerGridSocial: MobileRecommendations,
  recommendationsStack: MobileRecommendations,
  postAddToCartDrawer: PostAddToCartDrawer2upGrid,
  default: DesktopRecommendations,
}

const mobileVariantComponents = {
  aeDrawerGrid: MobileRecommendations,
  aeDrawerGridSocial: MobileRecommendations,
  recommendationsStack: MobileRecommendations,
  default: MobileRecommendations,
}

const RecommendationsContainer: FC<RecommendationsContainerProps> = ({
  type,
  variant: stylesVariant,
  vgId,
  onResponse,
  navigation,
  footer,
  showItemSkeletons,
  title,
  hideLabel = false,
  showRecommendationTitle = false,
  showDivider = true,
  limit,
  styles: titleStyles,
  hideWishlist = false,
  enableHeaderTitle = false,
  headerTitle = '',
  enableInlineAddToBag = false,
  styleVariantOverride,
  emitHomeFeaturedProductsJsonLd = false,
}) => {
  const { isDesktop } = useViewportType()
  const variant =
    styleVariantOverride ||
    APPLY_SAME_VARIANT[stylesVariant] ||
    STYLES_VARIANTS[type] ||
    stylesVariant
  const styles = useMultiStyleConfig('RecommendationsContainer', { variant })
  const fallbackSelectedVgId = useProductData('bundleProductData[0].defaultVariantGroup.id')
  const selectedVgId = useVariantGroupData('id') || vgId || fallbackSelectedVgId

  const { fetchRecommendations, isLoading, isError, errorMessage, data } = useRecommendations(
    type,
    onResponse
  )

  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: '50px',
  })

  useEffect(() => {
    const canFetch = containerFetchingConditions?.[type]?.(type, selectedVgId)

    if (!canFetch) {
      return
    }

    fetchRecommendations(selectedVgId)
  }, [selectedVgId, type, fetchRecommendations])

  const { items = [], vendor, containerDisplayName, strategyId, containerId } = data
  const label = title || containerDisplayName

  if (isError) {
    throw new Error(errorMessage)
  }

  const RecommendationsBlock = isDesktop
    ? desktopVariantComponents[variant] ?? desktopVariantComponents.default
    : mobileVariantComponents[variant] ?? mobileVariantComponents.default

  const analyticsEvents = useAnalyticsEventsRec({ containerId, vendor, label, strategyId })

  const limitedItems = useMemo(() => {
    return limit ? items.slice(0, limit) : items
  }, [items, limit])

  const isMatchingExperienceEnabled = ['sm_el_hp3', 'sm_el_plp7', 'sm_el_pdp6'].includes(
    XgenContainerID[type]
  )

  if (isMatchingExperienceEnabled && !isLoading && data && !limitedItems?.length) {
    return (
      <Box ref={ref}>
        {inView && (
          <RecommendationWrapper
            type={type}
            vendor={vendor}
            label={label}
            hideLabel={hideLabel}
            styles={styles}
            navigation={navigation}
            showDivider={showDivider}
            showRecommendationTitle={showRecommendationTitle}
            titleStyles={titleStyles}
            footer={footer}
            enableHeaderTitle={enableHeaderTitle}
            headerTitle={headerTitle}
          >
            <Flex sx={styles.fallbackMessageContainer}>
              <Text sx={styles.fallbackMessage}>
                <strong>🚨 Oops!</strong>
                <br />
                Something went wrong and we couldn&apos;t load the products.
                <br />
                Please explore another filter to explore more options.
              </Text>
            </Flex>
          </RecommendationWrapper>
        )}
      </Box>
    )
  }
  return (
    <Box ref={ref}>
      {emitHomeFeaturedProductsJsonLd && limitedItems?.length > 0 && (
        <HomeFeaturedProductsJsonLd
          items={limitedItems}
          sectionLabel={(typeof label === 'string' && label.trim()) || 'Featured products'}
        />
      )}
      {isLoading ? (
        <CertonaSkeleton variant={variant} manageVisibility={noop} />
      ) : (
        inView &&
        limitedItems?.length > 0 && (
          <RecommendationWrapper
            type={type}
            vendor={vendor}
            label={label}
            hideLabel={hideLabel}
            styles={styles}
            navigation={navigation}
            showDivider={showDivider}
            showRecommendationTitle={showRecommendationTitle}
            titleStyles={titleStyles}
            footer={footer}
            enableHeaderTitle={enableHeaderTitle}
            headerTitle={headerTitle}
          >
            <StylesProvider value={styles}>
              <RecommendationsBlock variant={variant}>
                {limitedItems?.map((product, idx) => (
                  <RecommendationItemTile
                    idx={idx}
                    containerId={containerId}
                    strategyId={strategyId}
                    key={product.id}
                    styleVariant={variant}
                    productItem={product}
                    analyticsEvents={analyticsEvents}
                    containerLabel={label}
                    vendor={vendor}
                    showSkeleton={showItemSkeletons}
                    hideWishlist={hideWishlist}
                    enableInlineAddToBag={enableInlineAddToBag}
                  />
                ))}
              </RecommendationsBlock>
            </StylesProvider>
          </RecommendationWrapper>
        )
      )}
    </Box>
  )
}

export default withErrorBoundaryWrapper(withSchemeValidation(memo(RecommendationsContainer), null))
