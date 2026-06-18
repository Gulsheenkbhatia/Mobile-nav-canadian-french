import { useCallback, useEffect, useMemo } from 'react'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import get from 'lodash/get'
import useGetCurrencyOptions from 'toro/hooks/useGetCurrencyOptions'
import { price as formatPrice } from 'toro/helpers/price-format'
import { productDataAtom, productPriceAtom, setPriceGroupAtom } from 'store/pdp.atom'
import { promotionalPricingData } from './helper'

/**
 * Keeps priceGroupAtom in sync for Tangiblee.
 * Deal / promotional price (dohDod) matches PriceInfo setPriceGroup shape.
 */
export function useSyncTangibleePriceGroup(): void {
  const { regularPrice, salePrice } = useAtomValue(productPriceAtom)
  const productData = useAtomValue(productDataAtom)
  const setPriceGroup = useUpdateAtom(setPriceGroupAtom)

  const getCurrencyOptions = useGetCurrencyOptions()
  const currentCurrency = get(productData, 'pickedProps.currency')
  const priceToFormat = useCallback(
    (price: string | number | undefined) => {
      const currencyOptions = getCurrencyOptions(currentCurrency)
      return formatPrice(price as number, { hideSymbol: false, ...currencyOptions })
    },
    [currentCurrency, getCurrencyOptions]
  )

  const dohDodPricing = useMemo(
    () => promotionalPricingData(productData, Boolean(productData?.promotionPrice)),
    [productData]
  )

  const dohDodPrice = useMemo(
    () =>
      priceToFormat(get(dohDodPricing, 'prices.value')) || get(dohDodPricing, 'prices.formatted'),
    [dohDodPricing, priceToFormat]
  )

  useEffect(() => {
    if (!regularPrice && !salePrice) {
      return
    }
    setPriceGroup({
      listPrice: regularPrice,
      salePrice,
      dohDodPrice,
    })
  }, [regularPrice, salePrice, dohDodPrice, setPriceGroup])
}
