import type { ProductItem } from 'toro/types'

import {
  buildHomeFeaturedProductsJsonLd,
  parseOfferPriceFromFormatted,
} from 'toro/components/RecommendationsContainer/buildHomeFeaturedProductsJsonLd'

describe('parseOfferPriceFromFormatted', () => {
  it('parses US-style currency strings', () => {
    expect(parseOfferPriceFromFormatted('$395')).toBe(395)
    expect(parseOfferPriceFromFormatted('$395.00')).toBe(395)
  })

  it('returns undefined for empty input', () => {
    expect(parseOfferPriceFromFormatted('')).toBeUndefined()
    expect(parseOfferPriceFromFormatted(undefined)).toBeUndefined()
  })
})

describe('buildHomeFeaturedProductsJsonLd', () => {
  const baseParams = {
    pageUrl: 'https://www.example.com/en-us/',
    collectionPageName: 'Featured',
    itemListName: 'Featured',
    priceCurrency: 'USD',
  }

  it('returns null when required strings are missing', () => {
    expect(
      buildHomeFeaturedProductsJsonLd({
        ...baseParams,
        pageUrl: '',
        items: [],
      })
    ).toBeNull()
  })

  it('builds CollectionPage with ItemList and Product offers', () => {
    const items = [
      {
        id: '1',
        masterId: 'm1',
        variationId: 'v1',
        variationGroupId: 'vg1',
        url: '/products/test/ABC.html',
        name: 'Test Bag',
        image: { src: 'https://cdn.example.com/img.jpg', alt: 'bag' },
        isSized: false,
        price: { value: '$100', sale: false },
        inventory: { orderable: true },
      },
    ] as ProductItem[]

    const json = buildHomeFeaturedProductsJsonLd({
      ...baseParams,
      items,
    })

    expect(json).toMatchObject({
      '@type': 'CollectionPage',
      name: 'Featured',
      url: 'https://www.example.com/en-us/',
    })
    const mainEntity = json?.mainEntity as Record<string, unknown>
    expect(mainEntity['@type']).toBe('ItemList')
    const elements = mainEntity.itemListElement as Record<string, unknown>[]
    expect(elements).toHaveLength(1)
    const product = (elements[0].item as Record<string, unknown>) || {}
    expect(product['@type']).toBe('Product')
    expect(product.name).toBe('Test Bag')
    expect(product.url).toBe('https://www.example.com/products/test/ABC.html')
    expect(product.image).toBe('https://cdn.example.com/img.jpg')
    const offers = product.offers as Record<string, unknown>
    expect(offers['@type']).toBe('Offer')
    expect(offers.price).toBe(100)
    expect(offers.priceCurrency).toBe('USD')
    expect(offers.availability).toContain('InStock')
  })

  it('skips products without name or resolvable url', () => {
    const items = [
      {
        id: '1',
        masterId: 'm1',
        variationId: 'v1',
        variationGroupId: 'vg1',
        url: '',
        name: ' ',
        image: { src: '/img.jpg', alt: 'x' },
        isSized: false,
      },
    ] as ProductItem[]

    expect(
      buildHomeFeaturedProductsJsonLd({
        ...baseParams,
        items,
      })
    ).toBeNull()
  })
})
