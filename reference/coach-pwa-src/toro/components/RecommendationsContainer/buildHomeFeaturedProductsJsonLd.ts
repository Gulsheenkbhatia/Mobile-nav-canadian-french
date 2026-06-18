import get from 'lodash/get'

import { SCHEMA_TYPES, SCHEMA_URLS } from 'toro/constants/seo'
import type { ProductItem } from 'toro/types'

const { COLLECTION_PAGE, ITEM_LIST, LIST_ITEM, PRODUCT, OFFER } = SCHEMA_TYPES
const { BASE_URL, IN_STOCK, OUT_OF_STOCK, ITEM_LIST_ORDER_DESCENDING } = SCHEMA_URLS

const SCHEMA_CONTEXT = BASE_URL.replace(/\/$/, '')

export type BuildHomeFeaturedProductsJsonLdParams = {
  pageUrl: string
  collectionPageName: string
  itemListName: string
  items: ProductItem[]
  priceCurrency: string
}

/**
 * Best-effort numeric price for Offer.price from a locale-formatted display string.
 */
export const parseOfferPriceFromFormatted = (formatted?: string | null): number | undefined => {
  if (!formatted?.trim()) {
    return undefined
  }
  const match = formatted.replace(/\s/g, '').match(/(\d+(?:[.,]\d+)?)/)
  if (!match) {
    return undefined
  }
  const normalized =
    match[1].includes(',') && !match[1].includes('.')
      ? match[1].replace(',', '.')
      : match[1].replace(/,/g, '')
  const value = parseFloat(normalized)
  return Number.isFinite(value) ? value : undefined
}

const absoluteFromPath = (path: string | undefined, origin: string): string | undefined => {
  if (!path?.trim()) {
    return undefined
  }
  if (/^https?:\/\//i.test(path)) {
    return path
  }
  try {
    return new URL(path, origin).href
  } catch {
    return undefined
  }
}

const productImageUrl = (product: ProductItem, origin: string): string | undefined => {
  const src = get(product, 'image.src') || get(product, 'media[0].src')
  if (!src || typeof src !== 'string') {
    return undefined
  }
  return absoluteFromPath(src.startsWith('//') ? `https:${src}` : src, origin)
}

const buildOffer = (
  product: ProductItem,
  productUrl: string | undefined,
  priceCurrency: string
): Record<string, unknown> | undefined => {
  const priceValue = parseOfferPriceFromFormatted(product.price?.value)
  const orderable = product.inventory?.orderable
  const availability = orderable === false ? `${BASE_URL}${OUT_OF_STOCK}` : `${BASE_URL}${IN_STOCK}`

  const offer: Record<string, unknown> = {
    '@type': OFFER,
    availability,
  }

  if (priceValue !== undefined) {
    offer.price = priceValue
  }
  if (priceCurrency) {
    offer.priceCurrency = priceCurrency
  }
  if (productUrl) {
    offer.url = productUrl
  }

  return offer
}

const buildListItemForProduct = (
  product: ProductItem,
  position: number,
  origin: string,
  priceCurrency: string
): Record<string, unknown> | undefined => {
  const name = product.name?.trim()
  const productUrl = absoluteFromPath(product.url, origin)
  const image = productImageUrl(product, origin)

  if (!name || !productUrl) {
    return undefined
  }

  const productNode: Record<string, unknown> = {
    '@type': PRODUCT,
    name,
    url: productUrl,
  }

  if (image) {
    productNode.image = image
  }

  const offer = buildOffer(product, productUrl, priceCurrency)
  if (offer) {
    productNode.offers = offer
  }

  return {
    '@type': LIST_ITEM,
    position,
    item: productNode,
  }
}

/**
 * Builds schema.org CollectionPage JSON-LD for homepage featured recommendations (DIGIT-37216).
 */
export const buildHomeFeaturedProductsJsonLd = ({
  pageUrl,
  collectionPageName,
  itemListName,
  items,
  priceCurrency,
}: BuildHomeFeaturedProductsJsonLdParams): Record<string, unknown> | null => {
  const trimmedPageUrl = pageUrl?.trim()
  const trimmedCollectionName = collectionPageName?.trim()
  const trimmedListName = itemListName?.trim()

  if (!trimmedPageUrl || !trimmedCollectionName || !trimmedListName || !items?.length) {
    return null
  }

  let origin: string
  try {
    origin = new URL(trimmedPageUrl).origin
  } catch {
    return null
  }

  const itemListElement: Record<string, unknown>[] = []

  items.forEach((product, index) => {
    const listItem = buildListItemForProduct(product, index + 1, origin, priceCurrency)
    if (listItem) {
      itemListElement.push(listItem)
    }
  })

  if (!itemListElement.length) {
    return null
  }

  return {
    '@context': SCHEMA_CONTEXT,
    '@type': COLLECTION_PAGE,
    name: trimmedCollectionName,
    url: trimmedPageUrl,
    mainEntity: {
      '@type': ITEM_LIST,
      name: trimmedListName,
      itemListOrder: ITEM_LIST_ORDER_DESCENDING,
      itemListElement,
    },
  }
}
