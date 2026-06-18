import get from 'lodash/get'
import set from 'lodash/set'
import mapKeys from 'lodash/mapKeys'
import isPlainObject from 'lodash/isPlainObject'
import isArray from 'lodash/isArray'
import isEmpty from 'lodash/isEmpty'
import { ORDERING_STATUS } from 'toro/helpers/productVariations'

export const getCleanedSku = function (str = '') {
  const regExpCleanSku = /[^A-Za-z0-9_]/g // find special symbols (/&%=+; etc.)
  const cleanedSku = str
    .toLowerCase()
    .replace(/ {2}men| {2}wmn/g, '')
    .replace(/[\s]{2,}/gi, '_')
    .replace(/[ ]/g, '_')
    .replace(/[ // ]/g, '')
    .replace(regExpCleanSku, '-')
  return cleanedSku
}

export const getSKUs = function (tangibleeData) {
  const skus = []
  const colorVariantsEl = document.querySelector('.color-variants')
  if (colorVariantsEl) {
    const moovSkusEls = colorVariantsEl.querySelectorAll('[data-product-id]')
    moovSkusEls.forEach((el) => {
      let sku = el.dataset?.productId?.replace('%2F', '')
      if (sku) {
        sku = getCleanedSku(sku)
        skus.push(sku)
      }
    })
  }
  return skus.filter((sku) => tangibleeData[sku])
  //IMPORTANT: this method should return only SKUs where Tangiblee can appear
}

export const getActiveSKU = function () {
  // gives the current swatch that is selected
  const skuElelement = document.querySelector('.color-variants button.selected')
  let sku = skuElelement?.dataset?.productId
  // alternative case
  if (!sku) {
    const atcButton = document.querySelector('button[data-pid]')
    sku = atcButton?.dataset?.pid
  }
  // replace and lowercase
  if (sku) {
    sku = sku.replace('%2F', '')
    sku = getCleanedSku(sku)
  }
  return sku
}

export const getDiscountedPrice = function (selectedVariant, defaultVariantData) {
  const price = selectedVariant?.prices.currentPrice || defaultVariantData?.prices.currentPrice
  const discountAmount = selectedVariant?.prices?.discount || defaultVariantData?.discount
  if (!discountAmount) return false
  else return price - discountAmount
}

export const getFormattedPrices = function (priceGroup) {
  const salePrice = priceGroup?.salePrice
  const listPrice = priceGroup?.listPrice
  const dohDodPrice = priceGroup?.dohDodPrice

  // Only keep digits, dots, and commas
  // currency symbol are diif. - ¥15,400 ￥
  const currencyRegex = /[^0-9.,]/g
  const salesPriceValue =
    typeof salePrice === 'number' || salePrice === undefined
      ? salePrice
      : salePrice.replace(currencyRegex, '')
  const listPriceValue =
    typeof listPrice === 'number' || listPrice === undefined
      ? listPrice
      : listPrice.replace(currencyRegex, '')
  let price = salesPriceValue
  let discountedPrice = null

  if (dohDodPrice) {
    discountedPrice = salesPriceValue || listPriceValue
    price = dohDodPrice.replace(currencyRegex, '')
  } else {
    discountedPrice = listPriceValue
  }

  return {
    price: price,
    discountedPrice: discountedPrice,
  }
}

export const getVGFromColor = (productData, color) => {
  return productData?.variationGroup?.find(
    (item) =>
      (item?.id?.includes(color?.id) ||
        item?.id?.includes(color?.value) ||
        item?.id?.includes(color)) &&
      item?.masterId === color?.masterId
  )
}

export const getVGSizesfromColor = (productData, color) => {
  const selectedVg = getVGFromColor(productData, color)
  const selectedVgSizesObj = selectedVg?.variationAttributes?.find((item) => item?.id === 'size')
  return selectedVgSizesObj?.values?.map?.((data) => {
    return {
      ...data,
      id: data?.value,
      text: data?.name,
    }
  })
}

export const getVGWidthsfromColor = (productData, color) => {
  const selectedVg = getVGFromColor(productData, color)
  const selectedVgWidthsObj = selectedVg?.variationAttributes?.find((item) => item?.id === 'width')
  return selectedVgWidthsObj?.values?.map?.((data) => {
    return {
      ...data,
      id: data?.value,
      text: data?.name,
    }
  })
}

export const findAttributeByType = (variationAttrs = [], attributeName) => {
  return variationAttrs?.find((attr) => attr?.id?.toLowerCase() === attributeName)
}

export function getProductVideosArray(videoSrcLinksAttribute, colorId = '') {
  if (!videoSrcLinksAttribute?.includes('videoURL')) {
    return []
  }

  let videosData = {}
  try {
    videosData = JSON.parse(videoSrcLinksAttribute)
  } catch (e) {
    console.log('Error parsing videoSrcLink', e)
    return []
  }

  const productVideos = videosData?.Product
  const cleanedColorId = colorId.replace(/[^a-zA-Z0-9]+/g, '')

  if (!productVideos || !cleanedColorId) {
    return []
  }

  const colorIdRegexp = new RegExp(cleanedColorId, 'ig')

  return Object.entries(productVideos).reduce((prev, [videoKey, videoData]) => {
    const isVideoMatching = videoKey.split('_')?.[1]?.match(new RegExp(colorIdRegexp))?.length
    if (isVideoMatching) {
      const videoKeys = Object.keys(videoData).filter((key) => key.includes('videoURL'))
      return [
        ...prev,
        ...videoKeys.map((videoKey) => {
          const videoNumber = videoKey.split('videoURL')[1]
          const videoPosition = videoData[`Position${videoNumber ?? ''}`] ?? -1
          return {
            videoURL: videoData[videoKey],
            Position: videoPosition,
            createdDate: videoData[`createdDate${videoNumber ?? ''}`],
          }
        }),
      ]
    }

    return prev
  }, [])
}

function getMediaAssetSuffix(url = '', mediaType = '') {
  if (!url) return ''
  if (mediaType === 'video') {
    return url.match(/_v\d+/g)?.at(-1)
  }
  return url.split('_').splice(-1)[0]
}

export function sortFullMediaBySequence(fullMedia = [], mediaSequence = {}) {
  const totalSequenceLength = !isEmpty(mediaSequence) ? Object.keys(mediaSequence).length : 0

  return [...fullMedia].sort((firstAsset, secondAsset) => {
    const firstAssetType = firstAsset.type || 'image'
    const secondAssetType = secondAsset.type || 'image'

    const firstAssetPosition =
      get(mediaSequence, getMediaAssetSuffix(firstAsset.src, firstAssetType)) ??
      (firstAssetType === 'video' && firstAsset.position !== undefined && firstAsset.position !== -1
        ? firstAsset.position
        : totalSequenceLength)

    const secondAssetPosition =
      get(mediaSequence, getMediaAssetSuffix(secondAsset.src, secondAssetType)) ??
      (secondAssetType === 'video' &&
      secondAsset.position !== undefined &&
      secondAsset.position !== -1
        ? secondAsset.position
        : totalSequenceLength)

    return firstAssetPosition - secondAssetPosition
  })
}

export const mergeImageAndVideoMedia = (images, videos, sequence = {}) => {
  const fullVideos = videos.map((video) => {
    const sequencePosition = get(sequence, getMediaAssetSuffix(video.videoURL, 'video'))
    const pimPosition = parseFloat(video?.Position || '')
    const attributePosition = !isNaN(pimPosition) && pimPosition !== -1 ? pimPosition - 1 : -1
    const positionToSet = sequencePosition ?? attributePosition
    return {
      src: video.videoURL,
      type: 'video',
      position: positionToSet,
      poster: images[0],
      createdDate: video.createdDate,
    }
  })

  const fullMedia = [...images]

  fullVideos.forEach((video) => {
    if (video?.position === -1) {
      fullMedia.push(video)
    } else {
      fullMedia.splice(video?.position, 0, video)
    }
  })

  return fullMedia
}

export function getMedia(imageGroupsArr = [], videos = [], mediaSequence) {
  const fullImages =
    imageGroupsArr?.find((imageObj) => imageObj?.viewType?.toLowerCase() === 'product')?.images ??
    []
  const thumbMediaArr = imageGroupsArr?.find(
    (imageObj) => imageObj?.viewType?.toLowerCase() === 'producttile'
  )?.images
  const fullMedia = mergeImageAndVideoMedia(fullImages, videos, mediaSequence)

  // Sort the fullMedia (including both images and videos) based on the mediaSequence if provided
  const sortedFullMedia = mediaSequence
    ? sortFullMediaBySequence(fullMedia, mediaSequence)
    : fullMedia

  return {
    full: sortedFullMedia,
    thumbnails: thumbMediaArr,
    thumbnail: thumbMediaArr?.[0],
  }
}

const getColorObject = (item, locale, mediaSequence) => {
  const imgObj = item?.imageGroups?.find(
    (imageObj) => imageObj?.viewType?.toLowerCase() === 'swatch'
  )?.images?.[0]
  const variationAttrs = get(item, 'variationAttributes', [])
  const variationsAssigned = get(item, 'variantsAssigned', [])
  if (!variationsAssigned?.length) return
  const currentVariationAttr = findAttributeByType(variationAttrs, 'color')
  const customAttributes = get(item, 'customAttributes', {})
  const canonicals = get(item, `canonicals[${locale}]`, '') || get(item, 'canonicals.default', '')
  const id = get(currentVariationAttr, `values[0].value`, '')
  return {
    id,
    text: get(currentVariationAttr, `values[0].name`, ''),
    image: imgObj,
    orderable: get(currentVariationAttr, `values[0].orderable`, true),
    media: getMedia(
      get(item, 'imageGroups', []),
      getProductVideosArray(get(customAttributes, 'c_productVideo'), id),
      mediaSequence
    ),
    url: canonicals?.replace(/^(?:\/\/|[^/]+)*\//, '/'),
    sizes: findAttributeByType(variationAttrs, 'size')?.values || [],
    widths: findAttributeByType(variationAttrs, 'width')?.values || [],
    vgId: get(item, 'id', ''),
    masterId: get(item, 'masterId', ''),
    materialName: get(customAttributes, 'c_megaPDPMaterialName', ''),
    styleGroup: get(customAttributes, 'c_megaPDPStyleGroup', ''),
    displayIfOOS: get(customAttributes, 'c_displayIfOOS', false),
  }
}

/**
 *
 * @param {array} VGArr
 * @returns array of colours in normalized format
 */
export function getVGColours(VGArr, locale, mediaSequence) {
  return VGArr?.map?.((item) => getColorObject(item, locale, mediaSequence)).filter((item) => item)
}

export const orderingStatusGAMap = {
  [ORDERING_STATUS.addToBag]: 'in stock',
  [ORDERING_STATUS.soldOut]: 'out of stock',
  [ORDERING_STATUS.preorder]: 'pre order',
  [ORDERING_STATUS.backorder]: 'backorder',
}

export const getVGColorsByMaterial = (VGArray, locale, mediaSequence) => {
  let result = {}

  VGArray.forEach((item) => {
    const materialName = get(item, 'customAttributes.c_megaPDPMaterialName', '').toLowerCase()

    if (materialName) {
      if (!(materialName in result)) {
        result[materialName] = []
      }

      const temp = getColorObject(item, locale, mediaSequence)
      result[materialName].push(temp)
    }
  })

  return result
}

export const getSelectedNewMegaPDPAttributes = (customAttributes, newMegaPDPTabsJSONData) => {
  const selectedTabsData = newMegaPDPTabsJSONData.map((tabData) => {
    const selectedAttributeName =
      Object.keys(customAttributes)?.find?.(
        (customAttribute) =>
          customAttribute?.toLowerCase()?.replace?.('c_', '') === tabData?.id?.toLowerCase()
      ) || ''
    return {
      tabId: tabData?.name || '',
      name: customAttributes?.[selectedAttributeName]?.toLowerCase?.() || '',
    }
  })
  return selectedTabsData
}

export const getNewMegaPDPGroup = (
  newMegaPDPDataJSON = [],
  newMegaPDPTabsJSONData = [],
  vgs = [],
  locale
) => {
  let groupedJson = {}
  const tabsAttributes = newMegaPDPTabsJSONData?.map((tabData) => ({
    id: tabData?.id?.toLowerCase() || '',
  }))

  newMegaPDPDataJSON?.forEach((item) => {
    let keyToAccess = ''
    const updatedItem = mapKeys(item, (value, key) => key.toLowerCase())

    tabsAttributes?.forEach((tab, index) => {
      const itemAttributeName = updatedItem[tab?.id]?.toLowerCase()
      const isLastItem = tabsAttributes?.length - 1 === index
      keyToAccess += index === 0 ? itemAttributeName : `.${itemAttributeName}`
      const data = get(groupedJson, keyToAccess)

      if (!data) {
        set(groupedJson, keyToAccess, {})
      }
      if (isLastItem) {
        const itemVgs = vgs
          .filter((vg) => vg?.masterId === updatedItem?.id)
          .map((vg) => ({
            id: vg?.id,
            url: get(vg, `canonicals[${locale}]`, '').replace(/^(?:\/\/|[^/]+)*\//, '/'),
          }))

        updatedItem.vgs = itemVgs
        delete updatedItem.id
        if (data) {
          updatedItem.vgs = [...data.vgs, ...updatedItem.vgs]
        }
        set(groupedJson, keyToAccess, updatedItem)
      }
    })
  })
  return groupedJson
}
export const getTabsUrl = (newMegaPDPGroupData, keyToAccess, totalAttributesLength) => {
  const keyAlreadyAccessed = keyToAccess?.split('.')
  const keyToAccessLength = totalAttributesLength - keyAlreadyAccessed?.length

  for (let i = 0; i < keyToAccessLength; i++) {
    const data = get(newMegaPDPGroupData, keyToAccess, {})
    const firstKey = Object.keys(data)?.filter((key) => {
      const vgsArr = get(data, `${key}.vgs`)
      /* Filter out only objects that have a "vgs" array that is empty */
      return !isArray(vgsArr) || (isArray(vgsArr) && !isEmpty(vgsArr))
    })?.[0]
    keyToAccess += `.${firstKey}`
  }
  return get(newMegaPDPGroupData, `${keyToAccess}.vgs[0].url`) || '/'
}

export const getNewMegaPDPTabsData = (
  selectedTabsData = [],
  newMegaPDPGroupData = {},
  newMegaPDPTabsJSONData = []
) => {
  let keyToAccess = ''
  let tabsData = []
  let objectToSearch = {}
  selectedTabsData?.forEach((selectedAttribute, index) => {
    if (keyToAccess?.length) {
      objectToSearch = get(newMegaPDPGroupData, keyToAccess)
      keyToAccess += `.${selectedAttribute?.name}`
    } else {
      objectToSearch = newMegaPDPGroupData
      keyToAccess = selectedAttribute?.name
    }
    if (isPlainObject(objectToSearch)) {
      const tabNames = Object.keys(objectToSearch)
      let tabs = []
      tabNames.forEach((tabName) => {
        let modifiedKeyToAccess = keyToAccess
        const toSplit = modifiedKeyToAccess?.includes('.')
        modifiedKeyToAccess = toSplit
          ? modifiedKeyToAccess?.split('.')
          : modifiedKeyToAccess?.split()
        modifiedKeyToAccess[index] = tabName
        modifiedKeyToAccess = modifiedKeyToAccess?.join('.')
        const tab = {
          name: tabName,
          url: getTabsUrl(newMegaPDPGroupData, modifiedKeyToAccess, selectedTabsData?.length),
          tabId: selectedAttribute?.tabId,
        }
        tabs.push(tab)
      })

      const tabNamesFromTabsJSONData =
        newMegaPDPTabsJSONData
          ?.find((data) => data?.name?.toLowerCase() === selectedAttribute?.tabId?.toLowerCase())
          ?.values?.map((item) => item.toLowerCase()) || []

      tabs = tabs.sort((a, b) => {
        const aIndex = tabNamesFromTabsJSONData?.indexOf(a?.name?.toLowerCase())
        const bIndex = tabNamesFromTabsJSONData?.indexOf(b?.name?.toLowerCase())
        return aIndex - bIndex
      })

      tabsData.push({
        tabId: selectedAttribute?.tabId,
        tabs,
        selectedTab: {
          name: selectedAttribute?.name,
        },
      })
    }
  })
  return tabsData
}

export const getNewMegaPDPColors = (newMegaPDPGroupData, colorKeyToAccess, colors = []) => {
  const vgs = get(newMegaPDPGroupData, `${colorKeyToAccess}.vgs`, [])
  const vgIds = vgs.map((vg) => vg.id)
  return colors
    .filter((color) => vgIds.includes(color.vgId))
    .sort((a, b) => b.orderable - a.orderable)
}
