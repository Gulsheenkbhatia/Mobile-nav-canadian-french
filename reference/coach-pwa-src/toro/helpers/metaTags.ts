import get from 'lodash/get'
import isString from 'lodash/isString'
import pick from 'lodash/pick'

import { AVAILABLE_REFINEMENT_IDS } from 'toro/helpers/refinements'
import { PAGE_TYPES } from 'toro/constants/googleAnalytics'
import { SCHEMA_TYPES, SCHEMA_URLS } from 'toro/constants/seo'

const { PRODUCT, AGGREGATE_RATING, COLLECTION_PAGE, ITEM_LIST, LIST_ITEM, OFFER, AGGREGATE_OFFER } =
  SCHEMA_TYPES
const { BASE_URL, SORT_ASCENDING, IN_STOCK, OUT_OF_STOCK } = SCHEMA_URLS

const INDEX = 'index,follow'
const NO_INDEX = 'noindex,nofollow'
const MAX_IMAGE_PREVIEW = 'max-image-preview'

export const getRobotTag = ({
  pageData,
  router,
  minProductsForIndex,
  nonIndexableURLParameters,
  indexableFeaturedQueries,
  searchTerm,
}) => {
  const pageType = get(pageData, 'pageType', '').toLowerCase()
  const isFeatured = get(pageData, 'isFeatured')
  const seoFacetMetaTags = get(pageData, 'seoFacetMetaTags', {})
  const filters = get(pageData, 'filters', [])
  const appliedFacets = filters.map((filter) => filter.id)

  if (pageType === 'shopbypage') {
    return NO_INDEX
  }
  if (pageType === 'metaplp') {
    return NO_INDEX
  }
  if (pageType === 'search' && isFeatured) {
    const isIndexable = indexableFeaturedQueries.includes(searchTerm)
    return isIndexable ? `${INDEX}, ${MAX_IMAGE_PREVIEW}:large` : NO_INDEX
  } else if (pageType === 'search' || pageType === 'coachtopiapassport') return NO_INDEX
  if (pageType === 'plp') {
    if (seoFacetMetaTags?.indexable !== undefined) {
      return seoFacetMetaTags.indexable ? INDEX : NO_INDEX
    }

    if (
      router.query.index === '0' ||
      router.asPath.includes('index') ||
      filters.some((filter) => filter?.values?.length > 1) ||
      (filters?.length > 0 && pageData?.total <= minProductsForIndex) ||
      filters?.length >= 3 ||
      appliedFacets.find((facet) => nonIndexableURLParameters.includes(facet))
    ) {
      return NO_INDEX
    }

    // this value comes from BM global setting for each category.
    // we should use this value in a case if current PLP rules does not match override rules.
    const c_metarobotTag = get(pageData, 'c_metarobotTag')
    let robots = INDEX

    if (!!c_metarobotTag && isString(c_metarobotTag)) {
      robots = c_metarobotTag
    }

    return robots.includes(MAX_IMAGE_PREVIEW) ? robots : `${robots},${MAX_IMAGE_PREVIEW}:large`
  } else {
    const defaultRobots = get(pageData, 'total') === 0 ? NO_INDEX : INDEX
    const robots =
      get(pageData, 'custom.c_metarobotTag') || get(pageData, 'c_metarobotTag') || defaultRobots
    return robots.includes(MAX_IMAGE_PREVIEW) ? robots : `${robots}, ${MAX_IMAGE_PREVIEW}:large`
  }
}

export function getCanonicalValue({ pageData, router, backendDomain, localePath }) {
  const pageType = get(pageData, 'pageType', '').toLowerCase()
  const seoFacetMetaTags = get(pageData, 'seoFacetMetaTags', {})
  const filters = get(pageData, 'filters', [])
  const isFeatured = get(pageData, 'isFeatured')
  const { origin, pathname } = new URL(`https://${backendDomain}${localePath}${router.asPath}`)

  // Transform shop-by URLs to shop URLs for canonical
  if (pageType === 'shopbypage') {
    const shopPath = pathname.replace('/shop-by/', '/shop/')
    return `${origin}${shopPath}`
  }

  if (pageType === 'search' && isFeatured) {
    const allowedQueryParams = ['q', ...AVAILABLE_REFINEMENT_IDS]
    const filteredQueryParams = pick(router.query, allowedQueryParams)
    const stringified = new URLSearchParams(filteredQueryParams).toString()
    return `${origin}${pathname}?${stringified}`
  } else if (pageType === 'pdp') {
    const masterProductSlugUrl =
      get(pageData, 'pickedProps.promotionData.canonicals.default') ||
      get(pageData, 'canonicals.default') // New Product Api
    if (
      pageData?.requestedId?.split('+').length > 1 ||
      pageData?.requestedId?.split(' ').length > 1
    ) {
      return get(
        pageData,
        'defaultVariantData.custom.c_customOverrideCanonical',
        masterProductSlugUrl
      )
    }

    return get(pageData, 'custom.c_customOverrideCanonical', masterProductSlugUrl)
  } else if (pageType === 'plp' || pageType === PAGE_TYPES.CLP_LANDING_PAGE.toLowerCase()) {
    if (seoFacetMetaTags?.canonicals) {
      return seoFacetMetaTags.canonicals
    }
    const customCanonical =
      get(pageData, 'c_customOverrideCanonical') || get(pageData, 'canonicalUrl')
    if (customCanonical && isString(customCanonical)) return customCanonical
    else {
      const pageParams = ['page', 'startFrom']
      const containsParams = Object.keys(router.query).some((key) => pageParams.includes(key))
      if (filters?.length > 0 || containsParams) {
        const plpQueryParams = {}
        for (const [key, value] of Object.entries(router.query)) {
          if (filters.some(({ id }) => id === key) || pageParams.includes(key)) {
            plpQueryParams[key] = value
          }
        }
        const stringified = new URLSearchParams(plpQueryParams).toString()
        return `${origin}${pathname}?${stringified}`
      } else {
        return `https://${backendDomain}${localePath}${router.asPath.split('?')[0]}`
      }
    }
  }
}

function getOriginWithPathname({ pageData, router, backendDomain, localePath }) {
  const pageType = get(pageData, 'pageType', '').toLowerCase()
  const filters = get(pageData, 'filters', [])

  switch (pageType.toLowerCase()) {
    case 'plp': {
      const pageUrl = router.asPath.split('?')
      const paginationValue = pageUrl[1]?.split('&').pop()
      if (filters?.length > 0) {
        return `https://${backendDomain}${localePath}${router.asPath}`
      }

      if (typeof paginationValue === 'undefined') {
        return `https://${backendDomain}${localePath}${router.asPath.split('?')[0]}`
      }
      const paginationBoolean = paginationValue.includes('page')
      if (!paginationBoolean) {
        return `https://${backendDomain}${localePath}${router.asPath.split('?')[0]}`
      } else if (router?.asPath && backendDomain && paginationBoolean) {
        return `https://${backendDomain}${localePath}${
          router.asPath.split('?')[0]
        }?${paginationValue}`
      } else {
        return ''
      }
    }
    case 'pdp': {
      if (router?.asPath && backendDomain) {
        return `https://${backendDomain}${localePath}${get(pageData, 'url')}`
      }
      return ''
    }
    case 'hp': {
      if (backendDomain) {
        return `https://${backendDomain}${localePath || '/'}`
      }
      return ''
    }
    case 'search': {
      if (router?.asPath && backendDomain) {
        return decodeURIComponent(
          encodeURIComponent(`https://${backendDomain}${localePath}${router.asPath}`)
        )
      }
      return ''
    }
    default: {
      // fix(TM-10582): for server-side rendering of canonical link
      const pageUrl = router.asPath.split('?')
      if (!pageUrl) {
        return `https://${backendDomain}${localePath}`
      }
      const queryValue = pageUrl[1] || ''
      if (queryValue) {
        return `https://${backendDomain}${localePath}${pageUrl[0]}?${queryValue}`
      }
      return `https://${backendDomain}${localePath}${pageUrl[0]}`
    }
  }
}

export function getCanonicalUrl(props) {
  return getCanonicalValue(props) || getOriginWithPathname(props)
}

const FILTER_SIZE_MAP = {
  xxs: 'Extra Extra Small',
  xs: 'Extra Small',
  s: 'Small',
  m: 'Medium',
  l: 'Large',
  xl: 'Extra Large',
  xxl: 'Extra Extra Large',
}

function getExtendedSizeNameByKey(key) {
  return FILTER_SIZE_MAP[key?.toLowerCase()] || key
}

export const getPageTitleWithFilters = (inputString, filtersLength) => {
  if (!filtersLength) {
    return inputString
  }
  return inputString.replace(/Size ([\w\/]+)/g, (match, size) => {
    return 'Size ' + getExtendedSizeNameByKey(size)
  })
}

export const getPageDescriptionWithFilters = (filterData) => {
  if (!filterData) {
    return ''
  }
  const relevantFilters = [
    'size',
    'bagSize',
    'colorVal',
    'sustainableMaterials',
    'fabrication',
    'filterCategory',
    'materialVal',
  ]
  const descriptionFilters = filterData
    .filter(({ id }) => relevantFilters.includes(id))
    .sort(
      (filterA, filterB) =>
        relevantFilters.indexOf(filterA.id) - relevantFilters.indexOf(filterB.id)
    )

  if (
    descriptionFilters.length > 0 &&
    descriptionFilters.length < 3 &&
    !descriptionFilters.some(({ values }) => values.length > 1)
  ) {
    return (
      descriptionFilters
        .map(({ id, values }) =>
          id === 'size' || id === 'bagSize'
            ? `Size ${getExtendedSizeNameByKey(values[0])}`
            : values[0]
        )
        .join(' ') + ' '
    )
  }

  return ''
}

const getOfferDetails = (product, backendDomain) => {
  const priceObject = get(product, 'pickedProps.promotionData.Pricing.0')
  const priceCurrency = get(product, 'pickedProps.currency')
  const isAvailable = get(product, 'pickedProps.inventory.orderable', false)
  const availability = isAvailable ? `${BASE_URL}${IN_STOCK}` : `${BASE_URL}${OUT_OF_STOCK}`
  const url = `https://${backendDomain}${get(product, 'url')}`

  const isRangedPrice = get(priceObject, 'type', '') === 'range'

  let price
  let lowPrice
  let highPrice

  if (isRangedPrice) {
    const min = get(priceObject, 'min')
    const max = get(priceObject, 'max')
    lowPrice = get(min, 'sales.decimalPrice') || get(min, 'list.decimalPrice')
    highPrice = get(max, 'sales.decimalPrice') || get(max, 'list.decimalPrice')
  } else {
    price = get(priceObject, 'sales.decimalPrice') || get(priceObject, 'list.decimalPrice')
  }

  // either `price` or both `lowPrice` and `highPrice` should be returned based on whether it's a ranged price or not
  // `undefined` values do not get added to the final object, so we can conditionally return these values without additional checks
  return {
    '@type': isRangedPrice ? AGGREGATE_OFFER : OFFER,
    priceCurrency,
    price,
    lowPrice,
    highPrice,
    availability,
    url,
  }
}

export function createPLPSEOitemsList({
  backendDomain = '',
  products = [],
  pageData,
  locale = '',
  categoryImage,
}): {
  seoProductsMetaData: string
} {
  const { currentPageTitle, pageTitle, currentPageDescription, pageDescription, canonicalUrl } =
    pageData || {}

  const metaData = {
    '@context': BASE_URL,
    '@type': COLLECTION_PAGE,
    '@id': canonicalUrl,
    name: currentPageTitle || pageTitle,
    headline: currentPageTitle || pageTitle,
    description: currentPageDescription || pageDescription,
    image: categoryImage,

    url: canonicalUrl,
    inLanguage: locale,

    mainEntity: {
      '@type': ITEM_LIST,
      itemListOrder: `${BASE_URL}${SORT_ASCENDING}`,
      numberOfItems: products?.length,

      itemListElement: products.map((product, index) => {
        const ratingValue = Number(get(product, 'custom.c_avgRatingEmplifi'))
        const reviewCount = Number(get(product, 'custom.c_revCountEmplifi'))
        return {
          '@type': LIST_ITEM,
          position: (index + 1).toString(),
          url: `https://${backendDomain}${get(product, 'url')}`,
          item: {
            '@type': PRODUCT,
            '@id': `https://${backendDomain}${get(product, 'url')}`,
            name: get(product, 'name'),
            sku: get(product, 'productId'),
            color: get(product, 'colors', []).find(
              (color) => color.id === get(product, 'variationValues.color')
            )?.text,
            material: get(product, 'custom.c_material'),
            image: get(product, 'media.thumbnails', [])
              .map((image) => image.src)
              .slice(0, 3),

            offers: getOfferDetails(product, backendDomain),

            ...(ratingValue > 0 &&
              reviewCount > 0 && {
                aggregateRating: {
                  '@type': AGGREGATE_RATING,
                  ratingValue,
                  reviewCount,
                },
              }),
          },
        }
      }),
    },
  }

  return { seoProductsMetaData: JSON.stringify(metaData) }
}
