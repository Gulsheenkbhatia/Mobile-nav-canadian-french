import React, { memo, useMemo } from 'react'
import get from 'lodash/get'
import Box from 'toro/components/Box'
import Text from 'toro/components/Text'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'

interface PriceInfo {
  promotionalPrice?: {
    formatted?: string
    value?: number | string
  }
  sales?: {
    formatted?: string
    value?: number | string
  }
  list?: {
    formatted?: string
    value?: number | string
  }
}

interface VariationGroup {
  id?: string
  color?: string
  pricingInfo?: PriceInfo[]
}

interface VariantOnSale {
  id?: string
  price?: PriceInfo
}

interface Product {
  isServerSide?: boolean
  id?: string
  master?: {
    defaultVariantGroupID?: string
  }
  variationGroup?: VariationGroup[]
  defaultColor?: {
    id?: string
  }
  promotionPrice?: PriceInfo[]
  defaultVariant?: {
    productId?: string
    pricingInfo?: PriceInfo[]
  }
  variantsOnSale?: VariantOnSale[]
  name?: string
  sku?: string
}

interface PriceDetailsProps {
  product?: Product | null
}

const PriceDetails = memo(({ product = null }: PriceDetailsProps) => {
  const styles = useMultiStyleConfig('PriceDetails')

  const pricingData = useMemo<PriceInfo | null>(() => {
    if (!product) {
      return null
    }
    const getPriceSource = (): PriceInfo | undefined => {
      const isServerSide = product.isServerSide

      if (isServerSide) {
        // Fall back to default variant
        const defaultVgId = get(product, 'master.defaultVariantGroupID')
        const defaultVariant = defaultVgId
          ? product.variationGroup?.find?.((vg) => vg.id === defaultVgId)
          : product?.variationGroup?.find?.((item) => item?.color === product?.defaultColor?.id)

        return get(defaultVariant, 'pricingInfo[0]')
      }

      // For client-side products, use promotion price or default variant
      return get(product, 'promotionPrice[0]', get(product, 'defaultVariant.pricingInfo[0]'))
    }

    return getPriceSource() || null

    // Get promotionPrice array and return first element
    //   return get(product, 'promotionPrice[0]')
  }, [product])

  const getFinalPrice = (): string | null => {
    if (!pricingData) return null

    // Find first price tier that has a value: promotional > sales > list
    const priceKey = ['promotionalPrice', 'sales', 'list'].find(
      (key) => get(pricingData, `${key}.formatted`) as string | null
    )

    if (!priceKey) return null
    return get(pricingData, `${priceKey}.formatted`) as string | null
  }

  const finalPrice = useMemo(() => getFinalPrice(), [pricingData])

  if (!finalPrice) {
    return null
  }

  return (
    <Box sx={styles?.priceWrapper} data-qa="cm_search_suggestion_price_wraper">
      <Text sx={styles?.priceText} data-qa="cm_text_search_suggestion_price">
        {finalPrice}
      </Text>
    </Box>
  )
})

export default withErrorBoundaryWrapper(PriceDetails)
