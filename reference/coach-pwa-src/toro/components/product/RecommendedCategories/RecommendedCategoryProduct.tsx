import Link from 'toro/components/Link'
import Image from 'toro/components/Image'
import get from 'lodash/get'
import { useMemo } from 'react'
import Price from 'toro/components/Price'
import usePricePreferences from 'toro/hooks/usePricePreferences'
import usePreference from 'toro/hooks/usePreference_new'
import { isSpecificAssetTypeSrc } from 'toro/components/product/ProductMediaArea/helpers'
import { isPlpV3Atom } from 'store/plp.atom'
import { useAtomValue } from 'jotai/utils'
import ImpressionSensor from 'toro/analytics/ImpressionSensor'

export default function RecommendedCategoryProduct({
  product,
  isComparablePriceEnabledCategory,
  styles,
  onVisible,
  onProductClick,
  assetType = '_a0',
}) {
  const pricePreferences = usePricePreferences()
  const isPlpV3 = useAtomValue(isPlpV3Atom)

  const {
    priceSitePreferences: { isComparablePriceValue },
  } = usePreference({
    priceSitePreferences: ['isComparablePriceValue'],
    adaptiveExperience: ['recommendCategories'],
  })

  // TODO (DIGIT-9240, DIGIT-9241): Move to server
  const { hideComparablePrice = false, hideDiscountedRate = false } = useMemo(() => {
    const selectedVg = product?.variationGroup?.find(
      (vgProduct) => vgProduct?.id === product?.id || vgProduct?.firstVariant === product?.id
    )
    const selectedVariantForSelectedVg = product?.variant?.find((val) =>
      selectedVg?.variantsAssigned?.some((val2) => val2 === val.id)
    )
    const hideComparablePriceMemo = !!(
      selectedVariantForSelectedVg?.customAttributes?.c_hideComparablePriceValue || // variant
      selectedVg?.customAttributes?.c_hideComparablePriceValue || // vg
      selectedVg?.hideComparablePriceValue
    )

    const hideDiscountedRateMemo = !!(
      selectedVariantForSelectedVg?.customAttributes?.c_hideDiscountRate || // variant
      selectedVg?.customAttributes?.c_hideDiscountRate || // vg
      product?.hideDiscountedRate
    )

    return {
      hideComparablePrice: hideComparablePriceMemo,
      hideDiscountedRate: hideDiscountedRateMemo,
    }
  }, [product])

  const image = useMemo(() => {
    const thumbnail = get(product, 'media.thumbnails', []).find((thumbnail) =>
      isSpecificAssetTypeSrc(thumbnail.src, assetType)
    )
    if (thumbnail) return get(thumbnail, 'src')
    return (
      get(product, 'defaultColor.media.thumbnail.src') || get(product, 'media.thumbnails[0].src')
    )
  }, [product, assetType])

  const handleClick = () => {
    onProductClick(product)
  }

  return (
    <ImpressionSensor onVisible={() => onVisible(product)}>
      <Link href={product.url} sx={styles.productLink} onClick={handleClick}>
        <Image src={image} alt={get(product, 'name')} sx={styles.recommendedCategoryProductImage} />
        <Price
          product={product}
          pricePreferences={pricePreferences}
          hideComparablePrice={hideComparablePrice}
          hideDiscountedRate={hideDiscountedRate}
          isComparablePriceValue={isComparablePriceValue}
          isComparablePriceEnabledCategory={isComparablePriceEnabledCategory}
          variant={isPlpV3 && 'plpV3'}
        />
      </Link>
    </ImpressionSensor>
  )
}
