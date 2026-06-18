import { useMemo } from 'react'
import last from 'lodash/last'
import { NON_LAZY_LIMIT_DESKTOP, NON_LAZY_LIMIT_MOBILE } from 'toro/constants/productList'
import usePreference from 'toro/hooks/usePreference_new'
import { visibleTilesPathsMap } from 'toro/constants/utils.plp'
import get from 'lodash/get'

export const isPromo = (data) =>
  !!(
    get(data, 'content.markup')?.trim() ||
    get(data, 'isCertona') ||
    get(data, 'isInlineSearch') ||
    get(data, 'isSurvey') ||
    get(data, 'isRecommendedCategories')
  )

export const getColSpan = (product, isDesktop = true) => {
  if (
    product?.isCertona ||
    product?.isInlineSearch ||
    product?.isSurvey ||
    product?.isRecommendedCategories
  )
    return isDesktop ? product?.tileUP : 2

  const regex = /(?:col-|md-)([0-9]{2}|[0-9])(?=.*promo-tile-up)/gm
  const matches = product.content?.markup?.match(regex) ?? []
  const sizes = matches.map((m) => {
    const tokens = m.split('-')
    if (tokens.length) {
      return tokens[tokens.length - 1]
    }
    return null
  })

  // 2 - as default
  if (!sizes.length) return 2

  if (!isDesktop) {
    return parseInt(sizes[0], 10) > 6 ? 2 : 1
  }

  const sizePromoTileUp4 = sizes.every((size) => size === '12')

  if (sizePromoTileUp4) {
    return 4
  } else if (sizes[0] === '6') {
    return 1
  }
  return 2
}

export const getRowSpan = (product, isDesktop) => {
  return isDesktop && product?.tileUP === 2.2 ? 2 : null
}

export const assignCellPosition = (items, isDesktop) => {
  let lastCell = 0
  return items.map((item) => {
    const cells = isPromo(item)
      ? Array.from({ length: getColSpan(item, isDesktop) }, (_, i) => lastCell + i)
      : [lastCell]
    lastCell = last(cells) + 1
    return { ...item, cells }
  })
}

export const getLastNonLazyProductIdx = (newProducts, isDesktop) => {
  const nonLazyLimit = isDesktop ? NON_LAZY_LIMIT_DESKTOP : NON_LAZY_LIMIT_MOBILE
  const maxNonLazyIndex = Math.min(newProducts.length, nonLazyLimit) - 1
  for (let idx = maxNonLazyIndex; idx >= 0; idx--) {
    if (!isPromo(newProducts[idx])) {
      return idx
    }
  }
}

export const getPageBecameInteractiveTriggerIndex = (pageUrlHash, newProducts, isDesktop) => {
  // When going back we will have some of the product tile marked as visible and it's one of those
  // tiles that should trigger the event, because the last non-lazy product tile might not be one
  // of those.
  const visibleTilesOnFirstRender = visibleTilesPathsMap.get(pageUrlHash)
  if (visibleTilesOnFirstRender?.length) {
    return Math.min(...visibleTilesOnFirstRender)
  }

  // In case none of the product tiles are marked as visible we fall back to the last non-lazy
  // product tile.
  return getLastNonLazyProductIdx(newProducts, isDesktop)
}

export const mergeProductsWithPromos = (products, inlinePromoTileSlotsContent, isDefault) => {
  if (!inlinePromoTileSlotsContent?.length) {
    return products
  }
  const newProductsCopy = [...(products || [])]
  inlinePromoTileSlotsContent.forEach((element) => {
    if (isPromo(element) && newProductsCopy.length >= element?.position) {
      const tileUp = isDefault || element?.tileUP === 2.2 ? 2 : element?.tileUP
      Array.from(Array(tileUp).keys()).forEach((id) => {
        newProductsCopy.splice(element?.position + id - 1, 0, element)
      })
    }
  })
  const promoIds = []
  return newProductsCopy.filter((data) => {
    if (isPromo(data)) {
      if (promoIds.includes(data.id)) {
        return false
      } else {
        promoIds.push(data.id)
        return true
      }
    }
    return true
  })
}

export const useTilePreferences = () => {
  const {
    toggleSiteFeatures: {
      enableSwatchesOnVG,
      showMaterialToggle: showMaterial,
      DisplayMaterialInfoinProductTile: displayMaterialInfoInProductTile,
      sourceCodeGroupAttributeMapping,
    },
    storefrontConfigs: { displayOosSwatch: isDisplayOosSwatch },
    powerReviews: { isEnableLoaderOnPDP },
    badging: {
      maxPromoCalloutsDisplayPLP,
      onPurposeBadgeImage = '',
      hideOnPurposeBadgeOnMobilePlpv3,
    },
    salePreferences: { enableSaleSuppression: isEnableSaleSuppression },
    searchSuggestions: { EnableCategoryAltImageSequence: enableCategoryImageSequence },
  } = usePreference({
    ToggleSiteFeatures: [
      'enableSwatchesOnVG',
      'showMaterialToggle',
      'DisplayMaterialInfoinProductTile',
      'sourceCodeGroupAttributeMapping',
    ],
    'Storefront Configs': ['displayOosSwatch'],
    powerReviews: ['isEnableLoaderOnPDP'],
    badging: [
      'maxPromoCalloutsDisplayPLP',
      'onPurposeBadgeImage',
      'hideOnPurposeBadgeOnMobilePlpv3',
    ],
    salePreferences: ['enableSaleSuppression'],
    SearchSuggestions: ['EnableCategoryAltImageSequence'],
  })
  return useMemo(
    () => ({
      displayMaterialInfoInProductTile,
      isEnableLoaderOnPDP,
      isEnableSaleSuppression,
      maxPromoCalloutsDisplayPLP,
      enableCategoryImageSequence,
      sourceCodeGroupAttributeMapping,
      showMaterial,
      enableSwatchesOnVG,
      isDisplayOosSwatch,
      onPurposeBadgeImage,
      hideOnPurposeBadgeOnMobilePlpv3,
    }),
    [
      displayMaterialInfoInProductTile,
      isEnableLoaderOnPDP,
      isEnableSaleSuppression,
      maxPromoCalloutsDisplayPLP,
      enableCategoryImageSequence,
      sourceCodeGroupAttributeMapping,
      showMaterial,
      enableSwatchesOnVG,
      isDisplayOosSwatch,
      onPurposeBadgeImage,
      hideOnPurposeBadgeOnMobilePlpv3,
    ]
  )
}
