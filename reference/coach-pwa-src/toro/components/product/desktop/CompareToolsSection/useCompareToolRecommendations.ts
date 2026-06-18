import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import { useCallback, useEffect, useMemo, useState } from 'react'
import get from 'lodash/get'
import { productDataAtom, selectedColorAtom, selectedVariantAtom } from 'store/pdp.atom'
import { xgenFeaturesAtom } from 'store/xgen-features.atom'
import { CertonaScheme, clearSchemeInCertonaAtom } from 'store/certona-schemes.atoms'
import useSelectedColorData from 'toro/hooks/useSelectedColorData'
import useVariantGroupData from 'toro/hooks/useVariantGroupData'
import useSelectedVariantData from 'toro/hooks/useSelectedVariantData'
import useRecommendations from 'toro/hooks/useRecommendations'
import useCertonaScheme from 'toro/hooks/useCertonaScheme'
import useRecommAnalytics from 'toro/analytics/useRecommAnalytics'
import useAnalytics from 'toro/analytics/useAnalytics'
import usePreference from 'toro/hooks/usePreference_new'
import { EXPERIMENTS } from 'toro/constants/experiments'
import useExperiment from 'toro/hooks/useExperiment'
import { XgenContainerID } from 'toro/lib/xgen'
import {
  CompareToolHookReturn,
  HandleProductOnVisiblePayload,
} from 'toro/components/product/desktop/CompareToolsSection/types'
import { fetchCompareProductsData } from 'toro/lib/vendorProductsAdapter/features/ProductCompareTool/utils/fetchCompareProductsData'
import { normaliseComparedProductsData as normaliseComparedXgenProductsData } from 'lib/vendorProductsAdapter/features/ProductCompareTool/utils/normaliseComparedProductsData'
import { normalizeCurrentProductData as normalizeCurrentXgenProductData } from 'lib/vendorProductsAdapter/features/ProductCompareTool/utils/normalizeCurrentProductData'
import { ProductCompareItemProps } from 'lib/vendorProductsAdapter/features/ProductCompareTool/types'
import isEmpty from 'lodash/isEmpty'

const TYPE = 'product5_rr'
// Minimum number of items required to show recommendations
const MIN_ITEMS_REQUIRED = 2

export const getPriceValue = (sales, list) => {
  if (sales?.value) {
    return sales?.formatted
  }
  if (list?.value) {
    return list?.formatted
  }
  return ''
}

export const normalizeCertonaProductsData = (
  certonaItems = [],
  compareProducts = [],
  displayAtb = false
) =>
  certonaItems.map((certonaProduct) => {
    const currentCompareProduct = compareProducts.find(
      (product) => product.id === certonaProduct.ID
    )

    if (currentCompareProduct) {
      return {
        ...certonaProduct,
        ...currentCompareProduct,
        image: currentCompareProduct.img,
        url: certonaProduct.detailURL,
        price: {
          value: `${certonaProduct.price?.currency}${
            certonaProduct.price?.saleprice || certonaProduct.price?.fullprice
          }`,
        },
        displayAtb,
      }
    }
    return {
      ...certonaProduct,
      price: {
        value: certonaProduct.price?.saleprice,
      },
      url: certonaProduct.detailURL,
      displayAtb,
    }
  })

export const normalizeCurrentCertonaProductData = ({
  productData,
  selectedVariantOrVG,
  selectedColorImage,
  selectedMediaImage,
  displayAtb,
}) => {
  const { sales, list } = get(selectedVariantOrVG, ['pricingInfo', '0'], {})

  return {
    ...productData,
    price: {
      value: getPriceValue(sales, list),
    },
    colorSwatch: selectedColorImage,
    image: selectedMediaImage,
    VariationIdV2: selectedVariantOrVG?.id,
    ID: productData?.id,
    SizeFlag: productData?.sizes?.length > 0,
    displayAtb,
  }
}

const addAdditionalFieldsToXgenProduct = (product) => ({
  ...product,
  ID: product?.variationGroupId,
  VariationIdV2: product?.variationId,
  SizeFlag: product?.isSized,
})

const addAdditionalFieldsToXgenProducts = (products) =>
  products.map(addAdditionalFieldsToXgenProduct)

const useCompareToolRecommendations = (): CompareToolHookReturn => {
  const analytics = useAnalytics()
  const productData = useAtomValue(productDataAtom)
  const selectedVariantOrVG = useAtomValue(selectedVariantAtom)
  const clearScheme = useUpdateAtom(clearSchemeInCertonaAtom)
  const { recommendations: isXgenRecommendations = false } = useAtomValue(xgenFeaturesAtom)

  // Variant group data for XGen
  const [vgId, vgPricingInfo] = useVariantGroupData(['id', 'pricingInfo[0]'])
  const selectedVariantId = useSelectedVariantData('id')

  // Common data for both systems
  const [mediaImageSelectedColor, mediaThumbnailImg, baseProductColor] = useSelectedColorData([
    'media.full.[0]',
    'media.thumbnails.[0]',
    'baseProductColor',
  ])

  const selectedColor = useAtomValue(selectedColorAtom)
  const selectedColorImage = get(selectedColor, 'image')

  const selectedMediaImage = baseProductColor ? mediaThumbnailImg : mediaImageSelectedColor

  const [compareProducts, setCompareProducts] = useState<ProductCompareItemProps['product'][]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Check if comparison tool is enabled
  const isCompareToolEnable = useExperiment(
    `${EXPERIMENTS.COMPARISON_TOOL_EXPERIENCE}-${EXPERIMENTS.TAB_COMPARISON_TOOL_EXPERIENCE}`
  )

  // Check preferences
  const {
    recommendations: { disabledSchemes = [] },
    certonaConfiguration: { certonaATBConfigs },
    compareConfigs: { featureVisibility },
    storefrontConfigs: { displayOosSwatch },
  } = usePreference({
    recommendations: ['disabledSchemes'],
    CertonaConfiguration: ['certonaATBConfigs'],
    CompareConfigs: ['featureVisibility'],
    'Storefront Configs': ['displayOosSwatch'],
  })
  const isCompareToolPreferenceEnabled = get(featureVisibility, 'desktop', false)

  const isXgenRecommendationsDisabled = disabledSchemes.includes(XgenContainerID[TYPE])

  // Determine which system to use
  const shouldEnableCompareTool = isCompareToolPreferenceEnabled && isCompareToolEnable
  const shouldUseXgen =
    shouldEnableCompareTool && isXgenRecommendations && !isXgenRecommendationsDisabled

  // XGen
  const { fetchRecommendations, data: recommendationData } = useRecommendations(TYPE)
  const {
    vendor: xgenVendor,
    strategyId: xgenStrategyId,
    containerId: xgenContainerId,
    containerDisplayName: xgenTitle,
    items: recommendedProductsData,
  } = recommendationData

  // Certona
  const certonaScheme = useCertonaScheme(TYPE, {
    pagetype: 'product',
    itemid: selectedVariantOrVG?.id,
    enabled: shouldEnableCompareTool && !shouldUseXgen,
  }) as CertonaScheme

  const recommenderInfo = useMemo(() => {
    if (shouldUseXgen) {
      return {
        title: xgenTitle,
        displayAtb: !!recommendedProductsData?.[0]?.displayAtb,
        vendor: xgenVendor,
        scheme: xgenContainerId,
        experienceId: xgenStrategyId,
      }
    }
    return {
      title: get(certonaScheme, 'explanation'),
      displayAtb: !!certonaATBConfigs?.[certonaScheme?.scheme],
      vendor: 'certona' as const,
      scheme: get(certonaScheme, 'scheme'),
      experienceId: get(certonaScheme, 'experience_id'),
    }
  }, [shouldUseXgen, xgenVendor, xgenContainerId, xgenStrategyId, certonaScheme])

  const recommenderAnalytics = useRecommAnalytics(
    shouldUseXgen
      ? {
          products: compareProducts,
          schemeExpId: xgenStrategyId,
          eventLocation: xgenContainerId,
        }
      : {
          products: get(certonaScheme, 'items', []),
          certonaData: certonaScheme,
        }
  )

  const compareAttributesConfig = productData?.compareAttributesConfig

  // Load XGen recommendations, compare products data and normalize them
  const loadXgenCompareProductsData = useCallback(async () => {
    // Only trigger when VG ID is in normalized format (dashes, not spaces)
    if (!vgId || vgId.includes(' ')) return []

    const { items } = await fetchRecommendations(vgId)
    const productIDs = items?.reduce((acc, item) => {
      if (item.id) acc.push(item.id)
      return acc
    }, [])

    // Check if there are enough products to compare
    if (productIDs?.length < MIN_ITEMS_REQUIRED) return []

    const fullProductsData = await fetchCompareProductsData(
      productIDs,
      compareAttributesConfig,
      displayOosSwatch
    )
    const normalizedProducts = normaliseComparedXgenProductsData({
      fullProductsData,
      recommendedProductsData: items,
    })

    return addAdditionalFieldsToXgenProducts(normalizedProducts)
  }, [vgId, fetchRecommendations, compareAttributesConfig, displayOosSwatch])

  // Load Certona compare products data
  const loadCertonaCompareProductsData = useCallback(async () => {
    if (!certonaScheme?.items?.length) return []

    const productIDs = certonaScheme.items.map(({ ID: id }) => id).sort((a, b) => a - b)

    // Check if there are enough products to compare
    if (productIDs.length < MIN_ITEMS_REQUIRED) return []

    const productsData = await fetchCompareProductsData(
      productIDs,
      compareAttributesConfig,
      displayOosSwatch
    )

    return normalizeCertonaProductsData(
      certonaScheme.items,
      productsData,
      recommenderInfo?.displayAtb
    )
  }, [certonaScheme?.items, recommenderInfo?.displayAtb, compareAttributesConfig, displayOosSwatch])

  // Effect to load recommendations
  useEffect(() => {
    if (!productData?.id || isLoading || !shouldEnableCompareTool) {
      return
    }

    setIsLoading(true)

    const loadCompareProductsData = shouldUseXgen
      ? loadXgenCompareProductsData
      : loadCertonaCompareProductsData

    loadCompareProductsData()
      .then((normalizedProducts) => {
        setCompareProducts(normalizedProducts || [])
      })
      .catch((error) => {
        console.error('Fetch compare products failed', error)
        setCompareProducts([])
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [
    productData?.id,
    shouldEnableCompareTool,
    shouldUseXgen,
    loadXgenCompareProductsData,
    loadCertonaCompareProductsData,
  ])

  // Cleanup effect
  useEffect(() => {
    return () => {
      setCompareProducts([])
      if (!shouldUseXgen) {
        clearScheme(TYPE)
      }
    }
  }, [clearScheme, shouldUseXgen])

  // Normalize current product data
  const currentProductDataNormalized = useMemo(() => {
    if (shouldUseXgen) {
      const normalizedXgenProduct = normalizeCurrentXgenProductData({
        vgId,
        displayAtb: recommenderInfo.displayAtb,
        productData,
        vgPricingInfo,
        imageSelectedColor: selectedColorImage,
        mediaImageSelectedColor: selectedMediaImage,
        selectedVariantId,
      })
      return addAdditionalFieldsToXgenProduct(normalizedXgenProduct)
    }

    return normalizeCurrentCertonaProductData({
      productData,
      selectedVariantOrVG,
      selectedColorImage,
      selectedMediaImage,
      displayAtb: recommenderInfo.displayAtb,
    })
  }, [
    shouldUseXgen,
    vgId,
    recommenderInfo.displayAtb,
    productData,
    vgPricingInfo,
    selectedColorImage,
    selectedMediaImage,
    selectedVariantOrVG,
    selectedVariantId,
  ])

  const handleWrapperOnVisible = () => {
    analytics.send('productInteraction', {
      eventAction: 'comparison tool impression',
      eventLabel: get(productData, 'id'),
      eventLocationForced: shouldUseXgen ? TYPE : get(certonaScheme, 'scheme'),
    })
  }

  const handleProductOnVisible = ({ product, idx }: HandleProductOnVisiblePayload) => {
    recommenderAnalytics.addImpression({
      listName: recommenderInfo.title,
      product,
      idx,
      certonaScheme: recommenderInfo.scheme,
      recAIType: recommenderInfo.vendor,
      sendOnceInViewport: true,
    })
  }

  const handleProductOnClick = ({ product, idx }: HandleProductOnVisiblePayload) => {
    recommenderAnalytics.selectRecommItem({
      listName: recommenderInfo.title,
      product,
      idx,
      certonaScheme: recommenderInfo.scheme,
      recAIType: recommenderInfo.vendor,
    })
  }

  // Return null if compare tool is not enabled or not enough products to compare
  if (
    !shouldEnableCompareTool ||
    (!isLoading && compareProducts.length < MIN_ITEMS_REQUIRED) ||
    isEmpty(compareAttributesConfig)
  ) {
    return null
  }

  return {
    compareProducts,
    isLoading,
    currentProduct: currentProductDataNormalized,
    recommenderInfo,
    handleWrapperOnVisible,
    handleProductOnVisible,
    handleProductOnClick,
  }
}

export default useCompareToolRecommendations
