import { useEffect, useCallback } from 'react'
import { useAtomValue } from 'jotai/utils'
import usePreference from 'toro/hooks/usePreference_new'
import { productPriceGroupAtom, skuIdAtom, tangibleeDataAtom } from 'store/pdp.atom'
import useSelectedVariantData from 'toro/hooks/useSelectedVariantData'
import useVariantGroupData from 'toro/hooks/useVariantGroupData'
import { getSKUs, getFormattedPrices } from 'toro/helpers/skuHelper'
import getCurrentLocale from 'toro/helpers/getCurrentLocale'
import { currentLocaleAtom } from 'store/global.atom'

declare global {
  interface Window {
    tangiblee?: (action: string, params?: any) => any
  }
}

const useTangibleeColorSwatches = () => {
  const {
    priceSitePreferences: { hideListPrice },
  } = usePreference({
    priceSitePreferences: ['hideListPrice'],
  })
  const skuId = useAtomValue(skuIdAtom)
  const tangibleeData = useAtomValue(tangibleeDataAtom)
  const [orderable] = useSelectedVariantData(['orderable'])
  const [hideCompValue] = useVariantGroupData(['customAttributes.c_hideComparablePriceValue'])
  const productPriceGroup = useAtomValue(productPriceGroupAtom)
  const locale = useAtomValue(currentLocaleAtom)

  const updateTangiblee = useCallback(() => {
    const { currencySymbol: currency } = getCurrentLocale(locale.replace(/_/g, '-'))
    const { price, discountedPrice } = getFormattedPrices(productPriceGroup)

    window?.tangiblee('productSilentUpdate', {
      variations: getSKUs(tangibleeData),
      sku: skuId,
      price: price,
      currency: currency,
      discountedPrice: !(hideListPrice && hideCompValue) && discountedPrice,
      inStock: orderable,
    })
  }, [skuId, tangibleeData, hideListPrice, hideCompValue, orderable])

  useEffect(() => {
    if (window.tangiblee && window.tangiblee('isModalOpened')) {
      updateTangiblee()
    }
  }, [updateTangiblee])
}

export default useTangibleeColorSwatches
