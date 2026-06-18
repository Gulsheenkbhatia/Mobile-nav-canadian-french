import { useAtom } from 'jotai'
import { useAtomValue } from 'jotai/utils'
import {
  customizerRecipesAtom,
  customizerVariantsAtom,
  isQuickViewAtom,
  productCustomStateAtom,
  selectedColorAtom,
  selectedVariantGroupAtom,
} from 'store/pdp.atom'
import EnjectCustomizationScript from 'toro/components/EnjectCustomizationScript'
import usePreference from 'toro/hooks/usePreference_new'
import useProductData from 'toro/hooks/useProductData'
import useSelectedColorData from 'toro/hooks/useSelectedColorData'
import useSelectedVariantData from 'toro/hooks/useSelectedVariantData'

export type CustomizeAndMonogramProps = {
  type?: 'widget' | 'links'
}

function CustomizeAndMonogram({ type = 'widget' }: CustomizeAndMonogramProps) {
  const [
    customizerData,
    masterId,
    redirectUrl,
    selectedVariantGroupData,
    defaultVariantGroup,
    defaultVariantProductId,
    masterDefaultVariantID,
    colors,
    category_id,
    pickedPropsPromotionDataItemCategory,
  ] = useProductData([
    'customizerData',
    'masterId',
    'url',
    'selectedVariantGroupData',
    'defaultVariantGroup',
    'defaultVariant.productId',
    'master.defaultVariantID',
    'colors',
    'category_id',
    'pickedProps.promotionData.item_category',
  ])

  const [recipes, setRecipes] = useAtom(customizerRecipesAtom)
  const [productCustomState, setProductCustomState] = useAtom(productCustomStateAtom)
  const isQuickView = useAtomValue(isQuickViewAtom)
  const [isCustomize, isMonogram] = useSelectedColorData(['isCustomized', 'isMonogrammed'])
  const selectedVG = useAtomValue(selectedVariantGroupAtom)
  const variationGroupData = selectedVG || selectedVariantGroupData || defaultVariantGroup
  const [customizerVariants, setCustomizerVariants] = useAtom(customizerVariantsAtom)
  const [skuId, selectedVariantProductId] = useSelectedVariantData(['id', 'productId'])
  const [selectedColor, setSelectedColor] = useAtom(selectedColorAtom)
  const {
    customizer: {
      CustomizerApiKey,
      CustomizerAddonHangtags,
      CustomizerEnabled,
      CustomizerMonogrammingEnabled,
    },
  } = usePreference({
    Customizer: [
      'CustomizerApiKey',
      'CustomizerAddonHangtags',
      'CustomizerEnabled',
      'CustomizerMonogrammingEnabled',
    ],
  })

  const isCustomizedVg = isCustomize || isMonogram
  if ((type === 'links' && !isCustomizedVg) || (type === 'widget' && isCustomizedVg)) return null

  const defaultVariantProductID = defaultVariantProductId || masterDefaultVariantID
  const selectedVariant = {
    id: skuId,
    productId: selectedVariantProductId,
  }

  const productData = {
    colors,
    masterId,
    pickedProps: {
      promotionData: {
        item_category: pickedPropsPromotionDataItemCategory,
      },
    },
    category_id,
  }

  const isCustomizerPreferenceEnabled =
    CustomizerEnabled?.default || CustomizerMonogrammingEnabled?.default

  const preference = {
    CustomizerApiKey,
    CustomizerAddonHangtags,
  }

  return (
    <EnjectCustomizationScript
      skuId={skuId}
      variationGroupData={variationGroupData || selectedVG}
      productData={productData}
      setCustomizerVariants={setCustomizerVariants}
      customizerVariants={customizerVariants}
      selectedVariant={selectedVariant}
      selectedColor={selectedColor}
      setSelectedColor={setSelectedColor}
      isCustomize={isCustomize}
      isMonogram={isMonogram}
      isQuickView={isQuickView}
      redirectUrl={redirectUrl}
      masterId={masterId}
      customizerPrefernce={preference}
      isCustomizerPrefernceEnabled={isCustomizerPreferenceEnabled}
      recipes={recipes}
      setRecipes={setRecipes}
      productCustomState={productCustomState}
      setProductCustomState={setProductCustomState}
      customizerData={customizerData}
      defaultVariantProductID={defaultVariantProductID}
      colors={productData?.colors || []}
      type={type}
    />
  )
}

export default CustomizeAndMonogram
