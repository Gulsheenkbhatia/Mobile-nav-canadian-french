import { useCallback, useContext } from 'react'
import get from 'lodash/get'

import VideoObjectSchema from 'toro/components/AppMetaTags/VideoObjectSchema'

import getProductUrlBrandOptions from 'toro/helpers/getProductUrlBrandOptions'
import getProductUrl from 'toro/helpers/getProductUrl'
import { getDimensions } from 'toro/components/AppMetaTags/ProductSchema/helpers'

import usePreference from 'toro/hooks/usePreference_new'
import { slugify } from 'lib/sales-force-connector/utils/getUrl'

import { DetailedProduct, ProductVariant, VariationAttribute } from 'toro/types/productTypes'

import PWAContext from 'components/common/PWAContext'

import { SCHEMA_TYPES, SCHEMA_URLS } from 'toro/constants/seo'

type AppData = Record<string, unknown>
type Variant = Record<string, unknown>
type ReviewInput = { details?: Record<string, unknown>; metrics?: Record<string, unknown> }
type AdditionalPropertyItem = { '@type': string; name: string; value: string }
type ProductMedia = {
  src: string
  title?: string
  alt?: string
  type?: string
  position?: number | string
  createdDate?: string
  poster?: { src: string; title: string; alt: string }
}

const {
  PROPERTY_VALUE,
  EDITORS_NOTES,
  HANDLE_DROP,
  ORGANIZATION,
  OFFER,
  BRAND,
  PRODUCT,
  PRODUCT_GROUP,
  IMAGE,
  RATING,
  AGGREGATE_RATING,
  REVIEW,
  PERSON,
} = SCHEMA_TYPES
const { BASE_URL, COLOR, SIZE, IN_STOCK, OUT_OF_STOCK } = SCHEMA_URLS

// Max number of variant images to include in ProductGroup schema
const MAX_VARIANT_IMAGES = 3

const getProductUrlFromVariant = (
  productData: DetailedProduct,
  appData: AppData,
  variant: ProductVariant
) => {
  let url = get(variant, 'url')
  if (!url && variant) {
    const productName = productData?.name || productData?.productName
    const name = slugify(productName)
    const [masterId, colorId] = (variant?.id as string)?.split(/[\s]+/) || []

    if (masterId && colorId) {
      const productId = `${masterId}-${colorId}`
      const frpId = variant?.id
      const locale = appData?.localeInPath ? `/${appData.localeInPath}` : ''
      url = getProductUrl({
        name,
        productId,
        frpId,
        ...getProductUrlBrandOptions({
          product: productData,
          brandConfig: {
            isSubBrand: appData?.isSubBrandActive,
            subBrandName: appData?.subBrandName,
          },
          locale,
        }),
      } as Parameters<typeof getProductUrl>[0])
    }
  }
  return url
}

const getCouponPromotionalPrice = (variant: ProductVariant) => {
  const promoCallouts = get(variant, 'promotionalCallouts', []).filter(
    (promo) => promo?.promoCallOut !== '' || promo?.promoCallOutdefault !== ''
  )
  return get(promoCallouts, '0.isCouponCodeTypePromo', false) &&
    get(promoCallouts, '0.promotionalPrice', '')
    ? get(promoCallouts, '0.promotionalPrice')
    : null
}

// SFCC has 9999-12-31 as default value. We need to add this field only if value is configured
function getPriceValidUntil(dateStr: string | undefined) {
  const year = Number(dateStr?.split('-')[0])
  return Number.isInteger(year) && year < 9999 ? dateStr : undefined
}

const getOfferFromVariant = (
  pageData: DetailedProduct,
  appData: AppData,
  variant: ProductVariant
) => ({
  '@type': OFFER,
  url:
    'https://' +
    get(appData, 'backendDomain', '') +
    getProductUrlFromVariant(pageData, appData, variant),
  availability: get(variant, 'orderable') ? `${BASE_URL}${IN_STOCK}` : `${BASE_URL}${OUT_OF_STOCK}`,
  priceCurrency:
    get(pageData, 'pickedProps.currency') ||
    get(variant, 'pricingInfo[0].sales.currency') || // New Product API
    get(variant, 'pricingInfo[0].list.currency'), // New Product API
  price:
    getCouponPromotionalPrice(variant) ||
    get(variant, 'prices.currentPrice') ||
    get(variant, 'pricingInfo[0].promotionalPrice.value') ||
    get(variant, 'pricingInfo[0].sales.value') || // New Product API
    get(pageData, 'pricingInfo[0].list.value'), // New Product API
  priceValidUntil: getPriceValidUntil(
    get(pageData, 'defaultVariantData.pickedProps.promotionData.offers.priceValidUntil') ||
      get(pageData, 'defaultVariationGroupData.pickedProps.promotionData.offers.priceValidUntil') ||
      get(variant, 'offers.priceValidUntil')
  ), // New Product API
})

const getProductReview = ({ details, metrics }: ReviewInput, { brand }: { brand?: string }) => {
  const { comments, headline, nickname, created_date } = details || {}
  const { rating } = metrics || {}

  return {
    '@context': BASE_URL,
    '@type': REVIEW,
    reviewBody: comments,
    reviewRating: {
      '@type': RATING,
      ratingValue: rating,
      bestRating: 5,
      worstRating: 1,
    },
    name: headline,
    author: {
      '@type': PERSON,
      name: nickname,
    },
    datePublished: new Date(created_date as string).toISOString(),
    publisher: {
      '@type': ORGANIZATION,
      name: brand,
    },
  }
}

export default function ProductSchema({ pageData }: { pageData?: DetailedProduct }) {
  const { appData } = useContext(PWAContext)
  const {
    powerReviews: { enableEmplifi = false },
    toggleSiteFeatures: { enableFaqAccordions = false },
  } = usePreference({
    powerReviews: ['enableEmplifi'],
    ToggleSiteFeatures: ['enableFaqAccordions'],
  })
  const isHideReview = get(pageData, 'custom.c_hideReview')
  const breadCrumbData = get(pageData, 'breadcrumbs', [])
  const isReviewsEnabled = enableEmplifi && !isHideReview
  const averageRating = get(pageData, 'custom.c_avgRatingEmplifi', 0)
  const totalReviewCount = get(pageData, 'custom.c_revCountEmplifi', 0)
  const reviews = get(pageData, 'reviewsData.results[0].reviews')
  const similarProducts = get(pageData, 'similarProducts')
  const colors = get(pageData, 'colors', [])
  const productMasterId = get(pageData, 'masterId')
  const productUPC = get(pageData, 'UPC')
  const productName = get(pageData, 'name')
  const preloadSrc = get(pageData, 'preloadSrc')
  const isBundledProduct = get(pageData, 'isBundleProduct', false)
  const hasSize = get(pageData, 'isSizedOrWidthProduct', false)
  const faqData = enableFaqAccordions ? get(pageData, 'faqData', []) : []
  const productFullMediaObject = get(pageData, 'media.full', [])
  const productVideos =
    productFullMediaObject.filter(
      (media: ProductMedia) =>
        media?.type?.toLowerCase() === 'video' && !!media?.createdDate && !!media?.poster?.src
    ) || []

  const getVariantColorObject = useCallback(
    (variant: ProductVariant) =>
      colors.find((item: ProductVariant) => item?.id === variant?.variationValues?.color) || {},
    [colors]
  )

  const getOffers = (productVariant: ProductVariant) => {
    if (productVariant.id) {
      return getOfferFromVariant(pageData, appData, productVariant)
    } else if (pageData?.defaultVariant) {
      // Warning:  There's no method to determine a product's availability with the new product api
      //           It is expected that at least one variant is available for a product.
      return getOfferFromVariant(pageData, appData, pageData?.defaultVariant)
    } else {
      const { url, masterProductData, prices, isBundleProduct, bundleProductData } = pageData
      const anOffer: Variant = {
        '@type': OFFER,
        url: url
          ? get(appData, 'backendDomain', '') + url
          : get(pageData, 'canonicals.default', ''),
        availability: (masterProductData as { inventory?: { orderable?: boolean } })?.inventory
          ?.orderable
          ? `${BASE_URL}${IN_STOCK}`
          : `${BASE_URL}${OUT_OF_STOCK}`,
      }
      const pricesCurrent = (prices as { currentPrice?: number })?.currentPrice
      if (pricesCurrent) {
        anOffer.priceCurrency = get(pageData, 'pickedProps.currency')
        anOffer.price = pricesCurrent
      }
      if (isBundleProduct) {
        anOffer.priceCurrency =
          get(pageData, 'set.pricingInfo[0].sales.currency', 'USD') || anOffer?.priceCurrency
        anOffer.price = get(pageData, 'set.pricingInfo[0].sales.value', 0) || anOffer?.price
        anOffer.availability = (bundleProductData as Variant[])?.reduce(
          (prev: boolean, aProduct: Variant) =>
            prev ||
            !!((aProduct?.variants || aProduct?.variant) as Variant[])?.find(
              (v: Variant) => v?.orderable
            ),
          false
        )
          ? `${BASE_URL}${IN_STOCK}`
          : `${BASE_URL}${OUT_OF_STOCK}`
      }
      return anOffer
    }
  }

  const getSimilarProductColor = (product: Variant) => {
    const variationAttributes = product.variationAttributes as VariationAttribute[] | undefined
    return variationAttributes?.find((a) => a.id === 'color')?.values?.[0]?.name
  }

  const getSimilarProductOffer = (product: Variant) => {
    const url = get(product, 'prodUrl')

    const pricingInfo = get(product, 'pricingInfo[0]')
    const price =
      get(pricingInfo, 'promotionalPrice.value') ||
      get(pricingInfo, 'sales.value') ||
      get(pricingInfo, 'list.value')

    if (!price) return null

    const currency = get(pricingInfo, 'sales.currency') || get(pricingInfo, 'list.currency')
    const orderable = get(product, 'inventoryInfo.orderable', false)

    return {
      '@type': OFFER,
      url,
      availability: orderable ? `${BASE_URL}${IN_STOCK}` : `${BASE_URL}${OUT_OF_STOCK}`,
      priceCurrency: currency,
      price,
      priceValidUntil: getPriceValidUntil(get(product, 'validTo') as string | undefined),
    }
  }

  const similarProductsWithValidOffers = Array.isArray(similarProducts)
    ? similarProducts
        .map((p: Variant) => ({
          '@type': PRODUCT,
          '@id': get(p, 'prodUrl'),
          name: get(p, 'prodName'),
          color: getSimilarProductColor(p),
          offers: getSimilarProductOffer(p),
        }))
        .filter(({ '@id': id, offers }) => {
          if (!id || offers == null) return false
          return Boolean(get(offers, 'price'))
        })
    : []
  const variantForRelatedProductSchema =
    pageData?.selectedVariantData ||
    pageData?.defaultVariant ||
    (get(pageData, 'variants') as ProductVariant[] | undefined)?.[0] ||
    get(pageData, 'variant')?.[0]

  const relatedProductsTopLevelOffers = getOffers(
    (variantForRelatedProductSchema || ({} as ProductVariant)) as ProductVariant
  )
  const getImageArray = (variantColorObject: Variant) => {
    const thumbnails = get(variantColorObject, 'media.thumbnails', [])
    const thumbnailItems = Array.isArray(thumbnails) ? thumbnails.slice(0, MAX_VARIANT_IMAGES) : []

    return thumbnailItems
      .filter((item) => item?.src)
      .map((item) => ({
        '@type': IMAGE,
        url: item.src,
        description: item.alt || '',
      }))
  }

  const showProductWithColorVariations =
    !isBundledProduct &&
    get(pageData, 'defaultVariantGroup.variationAttributes', []).some(
      (item: { id?: string }) => item.id?.toLowerCase() === 'color'
    )
  const hasVariant = (
    get(pageData, 'variants', undefined) ||
    get(pageData, 'variant')?.map((variant) => {
      const variantColorObject = getVariantColorObject(variant)
      const imageArray = getImageArray(variantColorObject)
      const fallbackImage = get(variantColorObject, 'media.thumbnail')
        ? {
            '@type': IMAGE,
            url: get(variantColorObject, 'media.thumbnail.src'),
            description: get(variantColorObject, 'media.thumbnail.alt') || '',
          }
        : undefined

      const id = get(variant, 'id')

      return {
        '@type': PRODUCT,
        '@id': `https://${get(appData, 'backendDomain', '')}${get(variant, 'url')}`,
        productID: id,
        sku: id,
        gtin14: variant.UPC,
        mpn: id,
        image: imageArray.length > 0 ? imageArray : fallbackImage && [fallbackImage],
        color: variantColorObject?.text,
        material: get(variant, 'customAttributes.c_material'),
        name:
          get(variant, 'customAttributes.c_productNameH1', '') ||
          `${variantColorObject?.text} ${productName}`,
        offers: getOffers(variant),
        ...getDimensions(variant.customAttributes, hasSize),
      }
    })
  )
    ?.filter((variant: Variant) => {
      const hasValidImage = (variant?.image as { url?: string }[] | undefined)?.some(
        (img) => img?.url
      )

      const hasColor = !showProductWithColorVariations || variant?.color
      const hasSizeInfo = !hasSize || variant?.size
      // Filter out variants missing required Google Shopping fields: image (required), color when product has color variations, and size when product has size variations.
      return Boolean(hasValidImage && hasColor && hasSizeInfo)
    })
    ?.map((variant: Variant) => {
      if (get(variant, 'offers') && !get(variant, 'offers.price')) {
        const { offers: _unusedOffers, ...rest } = variant
        return rest
      }
      return variant
    })

  const variesBy: string[] = []
  const additionalProperties: AdditionalPropertyItem[] = []

  if (showProductWithColorVariations) {
    variesBy.push(`${BASE_URL}${COLOR}`)
  }
  if (hasSize) {
    variesBy.push(`${BASE_URL}${SIZE}`)
  }

  const editorNotes =
    get(pageData, 'custom.c_editorsNoteDescription', '') || get(pageData, 'pageDescription')
  const handleDrop = get(pageData, 'custom.c_handleDetail', '')

  if (editorNotes) {
    additionalProperties.push({
      '@type': PROPERTY_VALUE,
      name: EDITORS_NOTES,
      value: editorNotes,
    })
  }

  if (handleDrop) {
    additionalProperties.push({
      '@type': PROPERTY_VALUE,
      name: HANDLE_DROP,
      value: handleDrop,
    })
  }

  const json: Variant = {
    '@context': BASE_URL,
    '@type': PRODUCT_GROUP,
    '@id': `${get(pageData, 'canonicals.default')}#${get(pageData, 'masterId')}`,
    name: productName,
    description: get(pageData, 'longDescription'),
    category: breadCrumbData[breadCrumbData.length - 2]?.absUrl,
    brand: { '@type': BRAND, name: get(pageData, 'brand') },
    gtin14: productUPC,
    url: get(pageData, 'canonicals.default'),
    productGroupID: productMasterId,
    variesBy: variesBy.length > 0 ? variesBy : undefined,
    hasVariant,
    additionalProperty: additionalProperties.length > 0 ? additionalProperties : undefined,
  }
  const hasRating = totalReviewCount > 0 && isReviewsEnabled

  if (hasRating) {
    json.aggregateRating = {
      '@type': AGGREGATE_RATING,
      ratingValue:
        get(pageData, 'reviewsData.results[0].rollup.average_rating', 0) || averageRating,
      reviewCount:
        get(pageData, 'reviewsData.results[0].rollup.review_count', 0) || totalReviewCount,
      bestRating: 5,
      worstRating: 1,
      ratingCount: get(pageData, 'reviewsData.results[0].rollup.rating_count', 0),
    }
  }

  const hasReview = reviews?.length > 0 && hasRating

  // add reviews only if aggregateRating is available
  if (hasReview) {
    json.review = reviews?.map((review: Variant) => getProductReview(review, appData)) || []
  }

  const getFAQSchema = () => {
    if (!faqData?.length) {
      return null
    }

    const mainEntity = faqData
      .filter((item: Variant) => item?.title && item?.text)
      .map((item: Variant) => ({
        '@type': 'Question',
        name: item.title,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.text,
        },
      }))

    if (mainEntity.length === 0) {
      return null
    }

    return JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity,
    })
  }

  const faqSchema = getFAQSchema()

  // if there are no ratings or reviews, we want to remove variants that don't have price information to avoid showing unavailable products in google shopping results
  if (!hasReview) {
    json.hasVariant = (json.hasVariant as { offers?: { price?: unknown } }[])?.filter((variant) =>
      get(variant, 'offers.price')
    )
  }
  return (
    <>
      <script
        type="application/ld+json"
        data-key="ProductGroup"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
      ></script>

      {similarProductsWithValidOffers.length > 0 && (
        <script
          type="application/ld+json"
          data-key="RelatedProducts"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': BASE_URL,
              '@type': PRODUCT,
              '@id': get(pageData, 'canonicals.default'),
              name: productName,
              color: get(pageData, 'selectedColor.text') || get(pageData, 'defaultColor.text'),
              material:
                get(pageData, 'defaultVariantGroup.customAttributes.c_material') ||
                get(pageData, 'customAttributes.c_material'),
              brand: { '@type': BRAND, name: get(pageData, 'brand') },
              ...(relatedProductsTopLevelOffers && get(relatedProductsTopLevelOffers, 'price')
                ? { offers: relatedProductsTopLevelOffers }
                : {}),
              ...(typeof preloadSrc === 'string' && preloadSrc.trim() ? { image: preloadSrc } : {}),
              isSimilarTo: similarProductsWithValidOffers,
            }),
          }}
        ></script>
      )}

      {productVideos.length > 0 && <VideoObjectSchema videos={productVideos} />}

      {faqSchema && (
        <script
          type="application/ld+json"
          data-key="FAQPage"
          dangerouslySetInnerHTML={{ __html: faqSchema }}
        ></script>
      )}
    </>
  )
}
