import Box from 'toro/components/Box'
import Image from 'toro/components/Image'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import SectionSlider from 'toro/components/product/desktop/SectionSlider'
import getAPIURL from 'helpers/getAPIURL'
import Text from 'toro/components/Text'
import Link from 'toro/components/Link'
import getProductURLHref from 'helpers/getProductURLHref'
import React, { CSSProperties, useCallback, useMemo, useState } from 'react'
import usePreference from 'toro/hooks/usePreference_new'
import ImpressionSensor from 'toro/analytics/ImpressionSensor'
import { type SystemStyleObject } from '@chakra-ui/react'
import AddToBagButton from 'toro/components/AddToBagButton'
import get from 'lodash/get'
import useTemplate from 'toro/hooks/useTemplate'
import { TemplateName } from 'toro/constants/templates'
import RecommendationPrice from 'toro/components/Certona/RecommendationPrice'

const LAST_VISIBLE_SLIDE_THRESHOLD = 3

export enum RecommendationProvider {
  certona = 'certona',
  llm = 'llm',
  einstein = 'einstein',
}

const defaultPromoDisabledSchemes = []

interface SlideProps {
  product: any
  styles: Record<string, SystemStyleObject>
  hidePrice: boolean
  onTileVisible: (product: any, idx: number) => () => void
  onLinkClick: (product: any, idx: number) => () => void
  idx: number
  hasATBButton: boolean
  provider: RecommendationProvider
  scheme: string
  title: string
  experienceId?: string
  variant?: string
}
const Slide = ({
  product,
  styles,
  hidePrice = false,
  onLinkClick,
  idx,
  onTileVisible,
  hasATBButton,
  scheme,
  experienceId,
  provider,
  variant,
  title,
}: SlideProps) => {
  const [isATBButtonDisabled, setIsATBButtonDisabled] = useState(false)

  const {
    recommendations: { promoDisabledSchemes = defaultPromoDisabledSchemes },
  } = usePreference({
    recommendations: ['promoDisabledSchemes'],
  })

  const hidePromos =
    provider === RecommendationProvider.llm && promoDisabledSchemes.includes('visually_similar')

  const pdpUrl = getProductURLHref(product?.detailURL)
  const stringifiedProductData = useMemo(() => JSON.stringify(product), [product])

  const analyticsProduct = { ...product, is_quick_add: isATBButtonDisabled ? '0' : '1' }

  const dataQaPromotionalCallout =
    provider === RecommendationProvider.llm ? 'pdp_visually_similar_llm_promotions' : undefined

  const linkProps = {
    href: pdpUrl,
    prefetchUrl: getAPIURL(pdpUrl),
    prefetch: true,
    sx: styles.productLink,
    pageData: stringifiedProductData,
    onClick: onLinkClick(analyticsProduct, idx),
  }

  return (
    <ImpressionSensor
      key={`product-${product?.ID}`}
      onVisible={onTileVisible(analyticsProduct, idx)}
      threshold={0.2}
      rootMargin="0px 340px 0px 0px"
      style={styles.productContainer as CSSProperties}
    >
      <Box sx={styles.productImageWrapper}>
        <Link {...linkProps}>
          <Image
            src={product?.imageURL}
            alt={`${product?.name}, ${product?.Color}, ProductTile`}
            sx={styles.productImage}
            lazy
          />
        </Link>
      </Box>
      <Link {...linkProps}>
        <Box sx={styles.infoContainer}>
          <Text as="span" sx={styles.productName}>
            {product?.name}
          </Text>
          <RecommendationPrice
            product={product}
            hidePrice={hidePrice}
            scheme={scheme}
            variant={variant}
          />
          {!hidePromos &&
            product.promotionalCallouts?.map(({ type, content }) => (
              <Box
                key={type}
                sx={styles.llmPromotion}
                dangerouslySetInnerHTML={{ __html: content }}
                data-qa={dataQaPromotionalCallout}
              />
            ))}
        </Box>
      </Link>
      {hasATBButton && (
        <Box sx={styles.addToBagButtonContainer}>
          <AddToBagButton
            variantId={product.VariationIdV2 || product.defaultOrFirstVariantID}
            variantGroupId={product.ID}
            isSizedProduct={product.SizeFlag}
            styles={styles}
            analyticsData={{
              eventLocation: scheme,
              experienceId,
              recAIType: provider,
              containerLabel: title.toLowerCase(),
            }}
            setIsATBButtonDisabled={setIsATBButtonDisabled}
            dataQA={provider === RecommendationProvider.llm ? 'llm_add_to_bag_pdp' : undefined}
          />
        </Box>
      )}
    </ImpressionSensor>
  )
}

export interface RecommendationsSliderProps {
  title
  products
  hidePrice?: boolean
  addImpression: (any) => void
  selectRecommItem: (any) => Promise<void>
  provider: RecommendationProvider
  scheme: string
  experienceId?: string
  variant?: string
}
const RecommendationsSlider = ({
  title,
  products,
  hidePrice = false,
  addImpression,
  selectRecommItem,
  provider,
  scheme = '',
  experienceId = '',
  variant,
}: RecommendationsSliderProps) => {
  const {
    certonaConfiguration: { certonaATBConfigs },
  } = usePreference({
    CertonaConfiguration: ['certonaATBConfigs'],
  })
  const isPDPv5_1 = useTemplate([TemplateName.pdpv5_1])
  const isPDPV6Enabled = useTemplate([TemplateName.pdpv6])

  const hasATBButton = !!get(certonaATBConfigs, scheme)

  const styles = useMultiStyleConfig('RecommendationsSlider', { hasATBButton, variant })

  const onTileVisible = useCallback(
    (product, idx) => () => {
      addImpression?.({
        listName: title,
        product,
        idx,
        certonaScheme: scheme,
        recAIType: provider,
        // sendOnceInViewport: isSendOnceInViewport,
      })
    },
    [addImpression, title, scheme, provider]
  )

  const onLinkClick = useCallback(
    (product, idx) => () => {
      selectRecommItem?.({
        listName: title,
        product,
        idx,
        eventLocation: scheme,
        recAIType: provider,
      })
    },
    [addImpression, title, scheme, provider]
  )

  return (
    <Box sx={styles.sliderContainer}>
      <SectionSlider
        title={title}
        sliderOptions={{
          start: 0,
          fixedWidth: '324px',
          gap: isPDPv5_1 ? '18px' : '12px',
          perPage: 1,
        }}
        arrows={products?.length > 4}
        isSlider={products?.length > 4}
        customStyles={{ sectionSliderContainer: styles.sectionSliderContainer }}
        isRecommenderSlider
        visibleSlideTreshhold={LAST_VISIBLE_SLIDE_THRESHOLD}
        dataQaTitle="certona-title"
        dataQAWrapper="pdp_recommendation_section_wrapper"
        dataQaArrows={{
          next: 'recently_viewed_slider_right_arrow',
          prev: 'recently_viewed_slider_left_arrow',
        }}
        customPagination={!(isPDPv5_1 || isPDPV6Enabled)}
        variant={variant}
      >
        {products?.map?.((product, i) => (
          <Slide
            idx={i}
            key={product.ID}
            product={product}
            styles={styles}
            hidePrice={hidePrice}
            onLinkClick={onLinkClick}
            onTileVisible={onTileVisible}
            hasATBButton={hasATBButton}
            provider={provider}
            scheme={scheme}
            experienceId={experienceId}
            variant={variant}
            title={title}
          />
        ))}
      </SectionSlider>
    </Box>
  )
}

export default RecommendationsSlider
