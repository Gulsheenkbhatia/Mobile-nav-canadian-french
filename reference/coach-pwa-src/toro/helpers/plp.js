import getAPIURL from 'helpers/getAPIURL'
import omit from 'lodash/omit'
import omitBy from 'lodash/omitBy'
import pickBy from 'lodash/pickBy'
import isString from 'lodash/isString'
import isArray from 'lodash/isArray'
import isPlainObject from 'lodash/isPlainObject'
import has from 'lodash/has'
import get from 'lodash/get'
import { getFilterPosition } from 'toro/helpers/filterPath'
import { getCachedResponse } from 'toro/helpers/cacheStorageHelpers'
import { fetchFullProductsDataFromClient } from 'toro/helpers/fetchProductDataFromClient'

export function convertFiltersToQueryParams(filters) {
  const query = {}
  const alphabeticalFilters = filters.sort((a, b) => (a.id < b.id ? -1 : 1))
  const orderedFilters = alphabeticalFilters.sort((a, b) =>
    getFilterPosition(a.id) < getFilterPosition(b.id) ? -1 : 1
  )

  for (const filter of orderedFilters) {
    if (filter.id === 'isMemberExclusive' || filter.id === 'name') {
      query['prefn1'] = filter.id
      query['prefv1'] = filter.values.sort().join('|')
    } else if (filter.id === 'inStockProduct') {
      query[filter.id] = [...filter.values, 'inStock'].sort().join('|')
    } else {
      query[filter.id] = filter.values.sort().join('|')
    }
  }
  return query
}

function getFilterValueByName(filters, name) {
  return filters.find(({ id }) => id === name)?.values[0]
}

/**
 * Prepare a content asset id for featured page
 * @param searchTerm {string} The term used for search on the featured page
 * @returns {string} A seo id string.
 */
export const getFeaturedSeoId = (searchTerm) => {
  return `SEO-featured-${searchTerm.trim().replace(/ /g, '-')}`
}

export const getPLPSeoId = (categoryData = {}, filters = []) => {
  if (filters.length === 1 && filters[0].values.length === 1) {
    // fetch SEO content when 1 speicific filter was applied
    return `SEO-${categoryData.cgid || categoryData.id}-${filters[0].id}-${filters[0].values[0]}`
  }
  if (filters.length === 2) {
    const pmin = getFilterValueByName(filters, 'pmin')
    const pmax = getFilterValueByName(filters, 'pmax')
    if (pmin && pmax) {
      return `SEO-${categoryData.cgid || categoryData.id}-p${pmin}-p${pmax}`
    }
  }

  // if there are more then 1 or 0 filter - we won't fetch SEO content
  return
}

export const getPageTitle = ({ pageTitle, filters, name, alternateH1Tag }) => {
  return filters?.length > 2 || filters?.length === 0
    ? pageTitle
    : alternateH1Tag || name?.toLowerCase()
}

export const getReducedPayloadUrl = (url, isShopBy = false) => {
  if (!isShopBy && url.includes('shop-by')) return getAPIURL(url)

  const reducedUrl = getAPIURL(url?.replace('shop', 'get-shop'))

  if (isShopBy) {
    return reducedUrl.replace('shop-by', 'shop')
  }

  return reducedUrl
}

export const getURLForState = (query, path, locale) => {
  const url = locale ? `${locale}${path}` : path
  const { pathname } = new URL(url, 'http://localhost:3000')
  const sortedQuery = Object.entries(query).sort(([keyA], [keyB]) =>
    keyA === 'index' ? 1 : keyB === 'index' ? -1 : 0
  )
  const searchParams = new URLSearchParams(sortedQuery)

  let filterByDiscountPart = ''
  if (searchParams.has('filterByDiscount')) {
    const value = encodeURIComponent(searchParams.get('filterByDiscount'))
    filterByDiscountPart = `filterByDiscount=${value}`
    searchParams.delete('filterByDiscount')
  }

  let qs = decodeURI(searchParams.toString())

  if (filterByDiscountPart) {
    qs = qs ? `${qs}&${filterByDiscountPart}` : filterByDiscountPart
  }

  return pathname + (qs ? `?${qs}` : '')
}

export const populateQueryParams = (searchQuery, page, filters, srule, defaultSort) => {
  let query = omitExtraParams(searchQuery)
  const addIndex = filters?.some((filter) => filter.values?.length >= 2) || filters?.length >= 3

  if (Array.isArray(filters) && filters.length) {
    query = {
      ...query,
      ...convertFiltersToQueryParams(filters),
    }
  }

  if (srule && (srule !== defaultSort || has(searchQuery, 'srule'))) {
    query.srule = srule
  }

  if (page > 1) {
    query.page = String(page)
  }

  if (addIndex) {
    query.index = '0'
  }

  return query
}

export const isPageDataPrefetched = async (url) => {
  const cachedResponse = await getCachedResponse(url)
  return cachedResponse !== undefined
}

const extraParams = ['page', 'srule', 'q']
const omitRegExp = new RegExp(extraParams.join('|'))

export const omitExtraParams = (query) => {
  return omitBy(query, (_, key) => !omitRegExp.test(key))
}

export const deriveAdjacentPageUrls = (pageData, searchQuery, asPath, locale) => {
  if (!isPlainObject(pageData || !isPlainObject(searchQuery))) {
    return {}
  }
  const { page, totalPages, filters, defaultSort, srule } = pageData
  if (!Number.isSafeInteger(page) || !totalPages) {
    return {}
  }
  const query = populateQueryParams(searchQuery, page, filters, srule, defaultSort)
  let nextUrl
  let nextUrlToFetch
  let prevUrl
  const nextPage = page < totalPages ? page + 1 : undefined
  const prevPage = page > 1 ? page - 1 : undefined

  if (prevPage) {
    const omitParams = ['srule']
    if (prevPage === 1) {
      omitParams.push('page')
    }
    const prevPageQuery = { ...query, page: prevPage }
    prevUrl = getURLForState(omit(prevPageQuery, omitParams), asPath, locale)
  }

  if (nextPage) {
    const nextPageQuery = { ...query, page: nextPage }
    nextUrl = getURLForState(omit(nextPageQuery, 'srule'), asPath, locale)
    nextUrlToFetch = getAPIURL(
      getURLForState(nextPageQuery, asPath, locale)?.replace('shop', 'get-shop')
    )
  }
  return pickBy({ prevUrl, nextUrl, nextUrlToFetch }, isString)
}

export const extractAndNormalizeCertonaSlots = (sapiData) => {
  const rawData = get(sapiData, 'certonaPositions')
  const isCertonaEnabled = get(sapiData, 'isCertonaEnabled')

  if (!isCertonaEnabled) return null

  if (isString(rawData) && rawData.length > 0) {
    try {
      const parsedData = JSON.parse(rawData)
      if (isArray(parsedData)) {
        const certonaSlots = parsedData.reduce(
          (prev, curr) => {
            const item = {
              ...curr,
              tileUP: 4,
              isCertona: true,
              id: `${curr.recommendations}_${curr.position}`,
            }
            if (item.placement === 'bottom') {
              prev.bottomCertonaSlots.push(item)
            } else {
              prev.inBetweenCertonaSlots.push(item)
            }

            return prev
          },
          { bottomCertonaSlots: [], inBetweenCertonaSlots: [] }
        )

        // order by position
        certonaSlots.bottomCertonaSlots.sort((a, b) => a.position - b.position)

        return certonaSlots
      } else {
        console.log('certonaSlotsJson bad format after parsing.')
      }
    } catch (e) {
      console.log(`certonaSlotsJson error ${e}`)
    }
  }

  return null
}

export const normalizeInlineSlots = ({
  certonaSlots,
  inlineSearch,
  isInlineSearchExperience,
  surveySlot,
  recommendedCategoriesOnPLP,
  isMobile,
}) => {
  const insertInlineSlot = (position, element, inBetweenSlots) => {
    const index = inBetweenSlots.findIndex((slot) => slot.position > position)

    if (index !== -1) {
      inBetweenSlots.splice(index, 0, element)
    } else {
      inBetweenSlots.push(element)
    }
  }

  const inBetweenSlots = [...(certonaSlots?.inBetweenCertonaSlots || [])]
  const bottomSlots = [...(certonaSlots?.bottomCertonaSlots || [])]

  const isInlineSearchEnabled = inlineSearch?.enabled && isInlineSearchExperience

  if (isInlineSearchEnabled) {
    if (inlineSearch?.placement == 'bottom') {
      bottomSlots.push({
        ...inlineSearch,
        position: inlineSearch?.position || -1,
        isInlineSearch: true,
      })
    } else {
      const inlineSearchPosition = inlineSearch?.position || 1
      const position =
        inlineSearchPosition % 2 === 0
          ? Math.max(inlineSearchPosition - 1, 1)
          : inlineSearchPosition

      insertInlineSlot(
        position,
        { ...inlineSearch, position, isInlineSearch: true },
        inBetweenSlots
      )
    }
  }

  if (surveySlot?.plp && isMobile && !!surveySlot?.answers?.length) {
    const position = surveySlot?.plpPosition || -1
    if (surveySlot?.placement == 'bottom') {
      bottomSlots.push({
        answers: surveySlot.answers,
        position,
        isSurvey: true,
      })
    } else {
      insertInlineSlot(position, { ...surveySlot, position, isSurvey: true }, inBetweenSlots)
    }
  }

  if (recommendedCategoriesOnPLP?.placement === 'inline') {
    insertInlineSlot(
      recommendedCategoriesOnPLP?.position,
      recommendedCategoriesOnPLP,
      inBetweenSlots
    )
  } else if (recommendedCategoriesOnPLP?.placement === 'bottom') {
    bottomSlots.push(recommendedCategoriesOnPLP)
  }

  return {
    bottomSlots: bottomSlots.sort((a, b) => a.position - b.position),
    inBetweenSlots,
  }
}

export const updateProductDataForQuickView = ({ id, productData, products }) => {
  const selectedProduct = products.find((product) => product.id === id)
  const variationGroup = get(selectedProduct, 'variationGroup', [])
  const updatedVariationGroup = productData?.variationGroup?.map((vg) => {
    const { isAlmostGone, color } =
      variationGroup?.find((productVG) => productVG?.productID === vg?.id) || {}
    return { ...vg, isAlmostGone, color }
  })
  return { ...productData, variationGroup: updatedVariationGroup }
}
export const getLazyIndex = (pageSize, hasTopContentSlot = false) => {
  if (hasTopContentSlot) {
    return 4
  } else {
    return Math.ceil(Math.max(pageSize / 2, 6))
  }
}

export const fetchColorSizes = async (vgId) => {
  try {
    const responseJson = await fetch(`/api/get-color-sizes/${encodeURIComponent(vgId)}`).then((r) =>
      r.json()
    )
    return get(responseJson, 'sizes', [])
  } catch (e) {
    throw new Error(`Error fetching sizes for ${vgId} : ${e.message}`)
  }
}

export const productHasSizes = (product) => {
  return Boolean(
    get(product, 'sizes.length') ||
      get(product, 'variationAttributes', []).find((attr) => attr.attributeID === 'size')
  )
}

export const fetchSizeVariantData = async (variantId) => {
  try {
    const response = await fetchFullProductsDataFromClient([variantId], {
      includeInventory: true,
    })
    return get(response, '0')
  } catch (e) {
    console.error(`Failed to fetch selected size variant data for ${variantId}`)
  }
}

export const isQuickATBDisabled = (product, session) => {
  const membershipExclusiveProduct =
    get(product, 'masterProductData.custom.c_isMemberExclusive') ||
    get(product, 'master.customAttributes.c_isMemberExclusive')

  const isLoggedIn = !!get(session, 'user.userEmail')
  const isProductSet = get(product, 'isProductSet', null)

  return (
    (membershipExclusiveProduct && !isLoggedIn) ||
    product?.custom?.c_inStockCustomText ||
    product?.defaultVariant?.customAttributes?.c_inStockCustomText ||
    product?.custom?.instockText ||
    isProductSet ||
    !product?.defaultColor?.orderable
  )
}

export const getIsNotifyMeButtonVisible = (product) => {
  const isNotifyMeProduct =
    get(product, 'custom.c_isNotifyMeAvailable') ||
    get(product, 'defaultVariant.customAttributes.c_isNotifyMeAvailable')
  const isOrderable = get(product, 'defaultColor.orderable')
  return isNotifyMeProduct && !isOrderable
}

export const parseJsonField = (value, fallbackValue) => {
  try {
    if (!value) {
      return fallbackValue
    }

    return JSON.parse(value) ?? fallbackValue
  } catch (_error) {
    return fallbackValue
  }
}
