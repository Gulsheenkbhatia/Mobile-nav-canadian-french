const PLP_SUFFIX = {
  mobile: '$mobileProductTile$',
  tablet: '$tabletProductTile$',
  desktop: '$desktopProductTile$',
}

const PLP_SWATCH_SUFFIX = {
  mobile: '$mobilePLPSwatch$',
  desktop: '$desktopPLPSwatch$',
}

const THINK_PLP_1UP_SUFFIX = {
  mobile: '$productTile-4-5-m$',
  desktop: '$productTile-4-5-xl$',
}

const THINK_PLP_2UP_SUFFIX = {
  mobile: '$mobileProductTile$',
  desktop: '$productTile-4-5-m$',
}

const THINK_PLP_3UP_SUFFIX = {
  mobile: '$mobileProductTile$',
  desktop: '$desktopProductV5$',
}

const PDP_SWATCH_SUFFIX = {
  mobile: '$mobileSwatchImage$',
  desktop: '$desktopSwatchImage$',
}

const PDP_SWATCH_V3_SUFFIX = {
  mobile: '$mobileSwatchImageV3$',
  desktop: '$desktopSwatchImage$',
}

const PDP_SUFFIX = {
  mobile: '$mobileProductV3$',
  tablet: '$tabletProduct$',
  desktop: '$desktopProduct$',
  quickView: '$quickViewProduct$',
}

const PDP_TABBED_SUFFIX = {
  ...PDP_SUFFIX,
  mobile: '$mobileProduct$',
}

const PDP_V5_SUFFIX = {
  ...PDP_SUFFIX,
  tablet: '$desktopProductV5$',
  desktop: '$desktopProductV5$',
}

const PDP_V6_SUFFIX = {
  mobile: '$mobileProductV6$',
}

const PDP_THUMBNAIL_SUFFIX = {
  mobile: '$mobileThumbnail$',
  tablet: '$tabletThumbnail$',
  desktop: '$desktopThumbnail$',
}

const PDP_ZOOM_SUFFIX = {
  mobile: '$mobileProductZoom$',
  tablet: '$tabletProductZoom$',
  desktop: '$desktopProductZoom$',
}

const PDP_TABBED_ZOOM_SUFFIX = {
  ...PDP_ZOOM_SUFFIX,
  mobile: '$mobileProductZoomV1$',
}

const MENU_SUFFIX = {
  mobile: '$mobileNavImage$',
  tablet: '$mobileNavImage$',
  dekstop: '$desktopNavImage$',
}

const PDP_COMPARE_TOOL_SWATCH_SUFFIX = {
  mobile: '$mobilePDPSwatch$',
}

const PDP_COMPARE_TOOL_MATERIAL_SUFFIX = {
  mobile: '$mobileSwatchCompare$',
}

const PDP_PNG_SWATCH_SUFFIX = {
  mobile: '$pngPDPSwatch$',
  tablet: '$pngPDPSwatch$',
  desktop: '$pngPDPSwatch$',
}

const GRID_VARIANT_SUFFIX_MAP = {
  '1up': THINK_PLP_1UP_SUFFIX,
  '2up': THINK_PLP_2UP_SUFFIX,
  '3up': THINK_PLP_3UP_SUFFIX,
}

const BENTO_BOX_SMALL_SUFFIX = {
  mobile: '$productImage-1-1-400$',
}

const BENTO_BOX_LARGE_SUFFIX = {
  mobile: '$productImage-4-5-740$',
}

const ONE_TO_ONE_S_SUFFIX = {
  mobile: '$productTile-1-1-s$',
  desktop: '$productTile-1-1-s$',
}

const isRightSrcFormat = (src) => {
  const endPattern = /\?$/g
  if (src?.match?.(endPattern)) {
    return src
  } else {
    return src + '?'
  }
}

export const getImageSuffixOptions = (page, options = {}) => {
  if (options.isOneToOneS) {
    return ONE_TO_ONE_S_SUFFIX
  }

  if (page === 'pdp') {
    if (options.isBentoBoxSmall) return BENTO_BOX_SMALL_SUFFIX
    if (options.isBentoBoxLarge) return BENTO_BOX_LARGE_SUFFIX
  }

  if (page === 'pdp' && options.is1to1AspectRatioImage) {
    if (options.isZoom) {
      return PDP_TABBED_ZOOM_SUFFIX
    }
    return PDP_TABBED_SUFFIX
  }

  if (page === 'plp') {
    if (options.isSwatchImage) {
      return PLP_SWATCH_SUFFIX
    }

    if (options.isThinkPage) {
      return GRID_VARIANT_SUFFIX_MAP[options.gridVariant] || PLP_SUFFIX
    }

    return PLP_SUFFIX
  }

  if (options.isMenu) {
    return MENU_SUFFIX
  }
  if (options.isThumbnail) {
    return PDP_THUMBNAIL_SUFFIX
  }
  if (options.isPdpV6) {
    return PDP_V6_SUFFIX
  }
  if (options.isZoom) {
    return PDP_ZOOM_SUFFIX
  }
  if (options.isSwatchImage) {
    return PDP_SWATCH_SUFFIX
  }
  if (options.isSwatchImageV3) {
    return PDP_SWATCH_V3_SUFFIX
  }
  if (options.isCompareToolSwatch) {
    return PDP_COMPARE_TOOL_SWATCH_SUFFIX
  }
  if (options.isCompareToolMaterial) {
    return PDP_COMPARE_TOOL_MATERIAL_SUFFIX
  }
  if (options.isPngPdpSwatch) {
    return PDP_PNG_SWATCH_SUFFIX
  }
  if (options.isPdpV5) {
    return PDP_V5_SUFFIX
  }

  return PDP_SUFFIX
}

/**
 * Retrieves the full product image src for the corresponding viewport and page.
 * @param src {string} Remote image source.
 * @param viewport {'mobile'|'tablet'|'desktop'} Viewport type.
 * @param page {'plp'|'pdp'} Product page.
 * @param options {object} Options related to image behavior.
 * @param options.isMenu {boolean=} Whether the image is used for the navigation menu.
 * @param options.isThumbnail {boolean=} Whether the image is a thumbnail. Usually used for PDP desktop carousel.
 * @param options.isZoom {boolean=} Whether the image is used for zooming. Usually used for PDP.
 * @param options.isSwatchImage {boolean=} Whether the image is used for variant swatches. Usually used for PDP.
 * @param options.isSwatchImageV3 {boolean=} Whether the image is used for variant swatches. Usually used for PDP. FOR V3
 * @param options.isQuickView {boolean=} Whether the image is used for QuickView.
 * @param options.isCompareToolSwatch {boolean=} Whether the image is used for ProductCompareToolItem Swatch.
 * @param options.isCompareToolMaterial {boolean=} Whether the image is used for ProductCompareToolItem Material.
 * @param options.is1to1AspectRatioImage {boolean=}
 * @param options.isPdpV5 {boolean=} Whether the PDPv5 template is active
 * @param options.isPdpV6 {boolean=} Whether the PDPv6 template is active
 * @param options.isBentoBoxSmall {boolean=} Whether the image is used in Bento Box small tile.
 * @param options.isBentoBoxLarge {boolean=} Whether the image is used in Bento Box large tile.
 * @param options.isThinkPage {boolean=} Whether the image is used on Think PLP.
 * @param options.gridVariant {string=} Grid variant for Think PLP.
 * @param options.isOneToOneS {boolean=} Whether the A/B test POST_ATB_DESKTOP enabled.
 * @returns {string} Product image source.
 */
export const getProductImageSrc = (src, viewport = 'mobile', page, options = {}) => {
  if (!src) {
    return ''
  }

  const [imageSrc] = src?.split?.('?') || []

  const suffix = getImageSuffixOptions(page, options, imageSrc)

  const formattedSrc = isRightSrcFormat(imageSrc)

  return `${formattedSrc}${suffix[options.isQuickView ? 'quickView' : viewport]}`
}

export const getProductIdValueAttr = (url) => {
  let returnVal = null
  if (url) {
    const urlArr = url.split?.('/') || []
    const htmlProductIdVal = urlArr[urlArr.length - 1]
    if (htmlProductIdVal?.includes('html')) {
      const decodedValue = decodeURI(htmlProductIdVal)
      returnVal = decodedValue.replace?.('.html', '')
    }
  }
  return returnVal
}

export const restoreReducedMediaImg = (productData, img) => {
  if (!productData || !img) {
    return {}
  }

  const srcPrefix = productData?.commonSrcPrefix
  let src = img?.src
  if (srcPrefix && img && img.src) {
    src = img.src.replace?.('$', srcPrefix)
  }
  const alt = img?.alt || productData?.commonAlt

  return { src, alt }
}

export const restoreReducedMedia = (productData, media) => {
  if (!productData || !media) {
    return {}
  }

  return {
    ...media,
    thumbnails: media?.thumbnails?.map?.((img) => restoreReducedMediaImg(productData, img)) || [],
  }
}
