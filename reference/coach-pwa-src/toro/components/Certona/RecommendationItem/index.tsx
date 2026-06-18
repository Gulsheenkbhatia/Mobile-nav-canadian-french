import { useMemo, memo, useCallback, useState } from 'react'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import getAPIURL from 'helpers/getAPIURL'
import Text from 'toro/components/Text'
import Box from 'toro/components/Box'
import Image from 'toro/components/Image'
import Link from 'toro/components/Link'
import SaveForLater from 'toro/components/SaveForLater'
import ImpressionSensor from 'toro/analytics/ImpressionSensor'
import useViewportType from 'toro/hooks/useViewportType'
import RecommendationPrice from 'toro/components/Certona/RecommendationPrice'
import getProductURLHref from 'helpers/getProductURLHref'
import noop from 'lodash/noop'
import { TABBED_VARIANTS } from 'toro/components/Certona/helpers'
import AddToBagButton from 'toro/components/AddToBagButton'
import usePreference from 'toro/hooks/usePreference_new'
import usePageType from 'toro/hooks/usePageType'
import { useAtomValue } from 'jotai/utils'
import { isOneCoachNAEnabledAtom } from 'store/menu-data.atom'

type Props = {
  product: any
  idx: number
  viewport: string
  hidePrice?: boolean
  hideWishlist?: boolean
  addImpression: any
  selectRecommItem?: (payload: any) => void | Promise<void>
  addToWishlistRecommItem?: (payload: any) => void | Promise<void>
  removeFromWishlistRecommItem?: (payload: any) => void | Promise<void>
  scheme?: string
  label?: string
  variant?: string
  onItemClick?: any
  isSendOnceInViewport?: boolean
  hideProductName?: boolean
  hideATBButton?: boolean
  isLLMrecommendation?: boolean
  experienceId?: string
  hideLLMPromo?: boolean
  dataQaPromotionalCallout?: string
}

const defaultPromoDisabledSchemes = []

function RecommendationItem({
  product,
  idx,
  viewport,
  hidePrice,
  hideWishlist = false,
  addImpression,
  selectRecommItem = noop,
  addToWishlistRecommItem = noop,
  removeFromWishlistRecommItem = noop,
  scheme = undefined,
  label = undefined,
  variant,
  onItemClick = undefined,
  hideATBButton = false,
  isSendOnceInViewport = undefined,
  hideProductName = undefined,
  isLLMrecommendation = false,
  experienceId,
  hideLLMPromo = false,
  dataQaPromotionalCallout,
}: Props) {
  const styles = useMultiStyleConfig('PDPRecommendations', { variant })
  const { isMobile } = useViewportType()
  const { isPLP } = usePageType()
  const isOneCoachNAEnabled = useAtomValue(isOneCoachNAEnabledAtom)
  const selectedVariant: { productId?: string } = {}
  const labelValue = label?.trim?.()
  product.id = product?.ID
  selectedVariant.productId = product?.defaultOrFirstVariantID || product?.ID
  const pdpUrl = getProductURLHref(product?.detailURL)
  const isTabbedRecommendation = TABBED_VARIANTS.has(variant)
  const [isATBButtonDisabled, setIsATBButtonDisabled] = useState(false)

  const {
    certonaConfiguration: { certonaATBConfigs },
    recommendations: { promoDisabledSchemes = defaultPromoDisabledSchemes },
  } = usePreference({
    CertonaConfiguration: ['certonaATBConfigs'],
    recommendations: ['promoDisabledSchemes'],
  })

  const isLLMVariant = variant === 'LLMRecommendation'
  const isLLMPromoDisabled = promoDisabledSchemes.includes('visually_similar')
  const renderLLMPromo =
    isLLMrecommendation &&
    !isLLMVariant &&
    !!product?.promotionalCallouts &&
    !isLLMPromoDisabled &&
    !hideLLMPromo

  // Check if the product has an ATB button based on configuration
  const hasATBButton = !!certonaATBConfigs?.[scheme]

  const productImageMainWrapperStyles = useMemo(
    () => styles.productImageMainWrapper(viewport),
    [viewport]
  )
  const productNameWrapperStyles = useMemo(() => styles.productNameWrapper(viewport), [viewport])
  const recommendationItemWrapperStyles = useMemo(
    () => styles.RecommendationItemWrapper(isMobile),
    [isMobile]
  )

  const onTileVisible = () => {
    addImpression({
      listName: labelValue,
      product: { ...product, is_quick_add: hasATBButton && !isATBButtonDisabled ? '1' : '0' },
      idx,
      certonaScheme: isLLMrecommendation ? 'product1_llm' : scheme,
      recAIType: isLLMrecommendation ? 'llm' : 'certona',
      sendOnceInViewport: isSendOnceInViewport,
    })
  }
  const onLinkClick = () => {
    onItemClick?.()
    selectRecommItem({
      listName: labelValue,
      product: { ...product, is_quick_add: hasATBButton && !isATBButtonDisabled ? '1' : '0' },
      idx,
      eventLocation: isLLMrecommendation ? 'product1_llm' : scheme,
      recAIType: isLLMrecommendation ? 'llm' : 'certona',
    })
  }

  const onAddToWishlistSuccess = useCallback(() => {
    addToWishlistRecommItem({
      listName: labelValue,
      product,
      idx,
      eventLocation: isLLMrecommendation ? 'product1_llm' : scheme || 'product tile',
      recAIType: isLLMrecommendation ? 'llm' : 'certona',
    })
  }, [removeFromWishlistRecommItem, label, product, idx])

  const onRemoveFromWishlistSuccess = useCallback(() => {
    removeFromWishlistRecommItem({
      listName: labelValue,
      product,
      idx,
      eventLocation: scheme || 'product tile',
    })
  }, [removeFromWishlistRecommItem, label, product, idx])

  const stringifiedProductData = useMemo(() => JSON.stringify(product), [product])

  const denyWishlistRecommendationMobileVariants = [
    'pdpV3RecommendationMobile',
    'pdpV3ATCRecommendationMobile',
    'similarProductRecommendation',
    'inlinegridV3',
    'tabbedRecommendation',
    'goneViralRecommendation',
    'BecauseYouViewedPDPRecommendation',
    'becauseYouViewedPLPV2',
    'recentlyViewedV7',
  ]

  return (
    <ImpressionSensor
      key={`product-${product?.ID}`}
      onVisible={onTileVisible}
      threshold={isMobile ? 0.7 : 0.2}
      rootMargin={!isMobile ? '0px 340px 0px 0px' : '0px'}
    >
      <Box
        sx={recommendationItemWrapperStyles}
        className="recommendation-tile-wrapper"
        position="relative"
      >
        <Link
          href={pdpUrl}
          prefetchUrl={getAPIURL(pdpUrl)}
          prefetch={true}
          sx={styles.productLink}
          onClick={onLinkClick}
          pageData={stringifiedProductData}
        >
          <Box as="div" position="relative" sx={productImageMainWrapperStyles}>
            <Box
              className="recommendation-tile-image-wrapper"
              sx={{ ...styles.productImageWrapper, ...styles.RecommendationItem(isMobile) }}
            >
              <Image
                className="product-image"
                src={product?.imageURL}
                alt={`${product?.name}, ${product?.Color}, ProductTile`}
                maxWidth={isMobile && 'none'}
                sx={{ ...styles.productImage, ...styles.RecommendationItem(isMobile) }}
                lazy
                data-qa={isMobile ? 'm_plp_link_pt_img' : 'd_plp_link_pt_img'}
                aspectRatio={isTabbedRecommendation ? 5 / 4 : 1.24}
              />
            </Box>
            {!hideProductName && (
              <Box sx={productNameWrapperStyles} className="recommendation-tile-name-wrapper">
                <Text
                  className="productName"
                  data-qa="cm_pdt_link_pt_title"
                  sx={{
                    ...styles.productName,
                    ...(hasATBButton && styles.atbEnabledProductName),
                  }}
                >
                  {product?.name}
                </Text>
              </Box>
            )}
          </Box>
        </Link>
        <RecommendationPrice
          product={product}
          hidePrice={hidePrice}
          scheme={scheme}
          variant={variant}
        />
        <Box sx={styles.recommendationFooter}>
          {renderLLMPromo &&
            product.promotionalCallouts.map(({ type, content }) => (
              <Box
                key={type}
                sx={styles.llmPromotion}
                dangerouslySetInnerHTML={{ __html: content }}
                data-qa={dataQaPromotionalCallout}
              />
            ))}
          {hasATBButton && !hideATBButton && (
            <Box sx={styles.addToBagButtonWrapper}>
              <AddToBagButton
                variantId={product.VariationIdV2 || product.defaultOrFirstVariantID}
                variantGroupId={product.ID}
                isSizedProduct={product.SizeFlag}
                styles={styles.addToBagStyles}
                analyticsData={{
                  eventLocation: scheme,
                  experienceId,
                  recAIType: isLLMrecommendation ? 'llm' : 'certona',
                }}
                setIsATBButtonDisabled={setIsATBButtonDisabled}
                hideIcon={isOneCoachNAEnabled}
                dataQA={
                  isLLMrecommendation && isPLP && !isMobile ? 'llm_add_to_bag_plp' : undefined
                }
              />
            </Box>
          )}
        </Box>
        {!denyWishlistRecommendationMobileVariants.includes(variant) && !hideWishlist && (
          <SaveForLater
            name={product?.name}
            selectedVariant={selectedVariant}
            onAddToWishlistSuccess={onAddToWishlistSuccess}
            onRemoveFromWishlistSuccess={onRemoveFromWishlistSuccess}
            pdpQaTag={'pdpQaTagRecomm'}
            styleVariant={variant}
            isRecommendationTile
            wrapperStyles={styles.saveForLaterPosition}
          />
        )}
      </Box>
    </ImpressionSensor>
  )
}

export default memo(RecommendationItem)
