import { useEffect, useMemo, useRef } from 'react'
import Grid from 'toro/components/Grid'
import Box from 'toro/components/Box'
import EnhancedRecommendationItem from 'toro/components/EnhancedRecommendation/EnhancedRecommendationItem'
import get from 'lodash/get'
import useRecommAnalytics from 'toro/analytics/useRecommAnalytics'
import { useAtomValue } from 'jotai/utils'
import { maxCertonadataRecommendationAtom } from 'store/global.atom'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import usePreference from 'toro/hooks/usePreference_new'
import { RecommendationVendors } from 'lib/vendorProductsAdapter/recommendations/configurations'
import type { EnhancedCarouselProps } from 'toro/components/EnhancedRecommendation/types'

const MAX_PRODUCTS_QUANTITY = 16
const IMPRESSION_NAME = 'viewItemListCategory'

const EnhancedCarousel = ({ recommendationData, variant, label }: EnhancedCarouselProps) => {
  const styles = useMultiStyleConfig('EnhancedPDPRecommendation', { variant })
  const maxProductsQuantity = useAtomValue(maxCertonadataRecommendationAtom)
  const recommendationRef = useRef<HTMLDivElement>()

  const {
    recommendations: { hideRecommendationPrice: hidePrice },
    priceSitePreferences: { isComparablePriceValue: comparablePriceOn },
  } = usePreference({
    recommendations: ['hideRecommendationPrice'],
    priceSitePreferences: ['isComparablePriceValue'],
  })

  const products = useMemo(() => {
    const items = get(recommendationData, 'items', [])
    const vendor = get(recommendationData, 'vendor', RecommendationVendors.CERTONA)
    const isXgenData = vendor === RecommendationVendors.XGEN

    // For XGen data, display all recommendations without limit
    // For Certona data, apply the configured limit
    const limitedItems = isXgenData
      ? items
      : items.slice(0, Number(maxProductsQuantity) || MAX_PRODUCTS_QUANTITY)

    return limitedItems.map((item, idx) => {
      const variantType = idx % 3 === 0 ? 'Large' : 'Small'
      const imageURL = `${String(item?.imageURL).replace(/\$.*?\$/g, `$YMALPDP${variantType}$`)}`

      return {
        ...item,
        imageURL,
      }
    })
  }, [recommendationData, maxProductsQuantity])

  useEffect(() => {
    const currentRecommendationRef = get(recommendationRef, 'current')

    currentRecommendationRef?.scrollTo({ left: 0 })
  }, [products])

  const { addImpression, selectRecommItem } = useRecommAnalytics({
    products,
    certonaData: recommendationData,
    impressionName: IMPRESSION_NAME,
  })

  const vendor = get(recommendationData, 'vendor', RecommendationVendors.CERTONA)

  const productItems = products?.map?.((product, idx) => {
    const variantType = idx % 3 === 0 ? 'Large' : 'Small'

    const itemStyles = {
      ...styles?.enhancedRecommendationCell,
      ...styles?.[`enhancedRecommendation${variantType}Cell`],
    }

    return (
      <Box key={product?.ID} id={`${idx}-${variantType}`} sx={itemStyles}>
        <EnhancedRecommendationItem
          {...{
            product,
            idx,
            comparablePriceOn,
            hidePrice,
            addImpression,
            selectRecommItem,
            scheme: recommendationData?.scheme,
            experienceId: recommendationData?.experience_id,
            label,
            variant: `enhancedRecommendation${variantType}Cell`,
            vendor,
          }}
        />
      </Box>
    )
  })

  return (
    <Box
      maxW="100vw"
      height="fit-content"
      className="mob-recommend"
      data-qa={'recommendations-section'}
    >
      <Grid className="mob-recommend-items" sx={styles.recommendationGrid} ref={recommendationRef}>
        {productItems}
      </Grid>
    </Box>
  )
}

export default EnhancedCarousel
