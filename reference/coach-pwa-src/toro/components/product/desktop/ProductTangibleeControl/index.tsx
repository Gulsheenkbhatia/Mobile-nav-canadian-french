import { useAtomValue } from 'jotai/utils'
import { type FC, useMemo } from 'react'
import ProductMediaTangibleeControls from 'toro/components/product/ProductMediaArea/ProductMediaTangibleeControls'
import usePreference from 'toro/hooks/usePreference_new'
import useVariantGroupData from 'toro/hooks/useVariantGroupData'
import { skuIdAtom, tangibleeDataAtom } from 'store/pdp.atom'
import useSelectedVariantData from 'toro/hooks/useSelectedVariantData'
import TangibleeWidget from 'toro/components/product/Tangiblee/TangibleeWidget'
import useProductData from 'toro/hooks/useProductData'
import { isSubBrandActiveAtom } from 'store/global.atom'

export enum TangibleeControlType {
  media = 'productMedia',
  details = 'productDetails',
  vpcMedia = 'vpcProductMedia',
  vpcDetails = 'vpcProductDetails',
}

type ProductTangibleeControlProps = {
  imageUrl?: string
  type: TangibleeControlType
  onVpdCards?: boolean
}

const ProductTangibleeControl: FC<ProductTangibleeControlProps> = ({
  imageUrl,
  type,
  onVpdCards,
}) => {
  const {
    tangiblee: { enableStrategicTangiblee },
    priceSitePreferences: { hideListPrice },
  } = usePreference({
    Tangiblee: ['enableStrategicTangiblee'],
    priceSitePreferences: ['hideListPrice'],
  })
  const isSubBrandActive = useAtomValue(isSubBrandActiveAtom)
  const tangibleeData = useAtomValue(tangibleeDataAtom)
  const skuId = useAtomValue(skuIdAtom)

  const [hideCompValue, isDiscontinued] = useVariantGroupData([
    'customAttributes.c_hideComparablePriceValue',
    'customAttributes.c_isDiscontinued',
  ])

  const [id, orderable, isVariantDiscontinued] = useSelectedVariantData([
    'id',
    'orderable',
    'customAttributes.c_isDiscontinued',
  ])

  const [filterCategory, categoryId, primaryCategoryId, productId, defaultVariantId] =
    useProductData([
      'custom.c_filterCategory',
      'category_id',
      'masterProductData.primaryCategoryId',
      'id',
      'defaultVariant.id',
    ])

  const isControlVisible = !isDiscontinued && !isVariantDiscontinued && tangibleeData[skuId]

  const tangibleeWidgetProps = useMemo(
    () => ({
      skuId: skuId,
      tangibleeData,
      variantData: { id, orderable },
      productData: {
        id: productId,
        custom: {
          c_filterCategory: filterCategory,
        },
        category_id: categoryId,
        masterProductData: {
          primaryCategoryId,
        },
        defaultVariant: {
          id: defaultVariantId,
        },
      },
      isVisible: isControlVisible,
      hideComparablePriceValue: hideListPrice && hideCompValue,
    }),
    [
      skuId,
      orderable,
      id,
      tangibleeData,
      hideCompValue,
      hideListPrice,
      isControlVisible,
      filterCategory,
      categoryId,
      primaryCategoryId,
      productId,
    ]
  )

  if (
    (type === TangibleeControlType.media || type === TangibleeControlType.vpcMedia) &&
    enableStrategicTangiblee
  ) {
    return (
      <ProductMediaTangibleeControls
        {...tangibleeWidgetProps}
        imageUrl={imageUrl}
        variant={type === TangibleeControlType.media ? 'pdpV5' : 'vpc'}
      />
    )
  }

  if (
    (type === TangibleeControlType.details || type === TangibleeControlType.vpcDetails) &&
    isControlVisible
  ) {
    let variant
    if (type === TangibleeControlType.vpcDetails) {
      variant = 'vpc'
    } else if (isSubBrandActive) {
      variant = 'coachtopia'
    }
    return <TangibleeWidget {...tangibleeWidgetProps} variant={variant} onVpdCards={onVpdCards} />
  }

  return null
}

export default ProductTangibleeControl
