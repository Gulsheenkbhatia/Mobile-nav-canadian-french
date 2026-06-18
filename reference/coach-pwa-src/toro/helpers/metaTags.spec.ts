import { createPLPSEOitemsList } from './metaTags'

import { SCHEMA_TYPES, SCHEMA_URLS } from 'toro/constants/seo'

const { PRODUCT, AGGREGATE_RATING, COLLECTION_PAGE, ITEM_LIST, LIST_ITEM, OFFER, AGGREGATE_OFFER } =
  SCHEMA_TYPES
const { BASE_URL, SORT_ASCENDING } = SCHEMA_URLS

const products = [
  {
    name: 'Alter/Ego Satchel Bag In Checkerboard Upcrafted Leather',
    masterId: 'CU068',
    productId: 'CU068 B4XAT',
    url: '/products/coachtopia/alterego-satchel-bag-in-checkerboard-upcrafted-leather/CAE88.html',
    colors: [{ id: 'BRS', text: 'Brass/Dark Rose Red' }],
    variationValues: { color: 'BRS' },
    custom: { c_material: 'Leather', c_avgRatingEmplifi: 4.5, c_revCountEmplifi: 40 },
    pickedProps: {
      currency: 'USD',
      inventory: {
        orderable: true,
      },
      promotionData: {
        Pricing: [
          {
            sales: { value: 150, currency: 'USD', formatted: '$150', decimalPrice: '150.00' },
            list: null,
          },
        ],
      },
    },
    media: {
      thumbnails: [
        {
          src: 'https://coach.scene7.com/is/image/Coach/cae88_mpl_a0',
        },
        {
          src: 'https://coach.scene7.com/is/image/Coach/cae88_mpl_a1',
        },
        {
          src: 'https://coach.scene7.com/is/image/Coach/cae88_mpl_a2',
        },
        {
          src: 'https://coach.scene7.com/is/image/Coach/cae88_mpl_a3',
        },
      ],
    },
  },
  {
    name: 'Alter/Ego Shoulder Bag In Checkerboard Upcrafted Leather',
    masterId: 'CU068',
    productId: 'CU068 BLK',
    url: '/products/coachtopia/alterego-shoulder-bag-in-checkerboard-upcrafted-leather/CY360-BLK.html',
    colors: [{ id: 'BLK', text: 'Black' }],
    variationValues: { color: 'BLK' },
    custom: { c_material: 'Dark Leather', c_avgRatingEmplifi: 5.0, c_revCountEmplifi: 20 },
    pickedProps: {
      currency: 'USD',
      inventory: {
        orderable: false,
      },
      promotionData: {
        Pricing: [
          {
            type: 'range',
            min: {
              sales: { value: 100, currency: 'USD', formatted: '$100', decimalPrice: '100.00' },
              list: { value: 250, currency: 'USD', formatted: '$250', decimalPrice: '250.00' },
            },
            max: {
              sales: { value: 150, currency: 'USD', formatted: '$150', decimalPrice: '150.00' },
              list: { value: 250, currency: 'USD', formatted: '$250', decimalPrice: '250.00' },
            },
          },
        ],
      },
    },
    media: {
      thumbnails: [
        {
          src: 'https://coach.scene7.com/is/image/Coach/cy360_blk_a0',
        },
      ],
    },
  },
]

const expectedMetaData = {
  '@context': BASE_URL,
  '@type': COLLECTION_PAGE,
  '@id': 'https://coach.com/shop/women/view-all',

  name: "Women's   Styles | COACH®",
  headline: "Women's   Styles | COACH®",
  description: "Shop All Women's   Styles At COACH®. Enjoy Free Shipping & Returns On All Orders.",
  image: 'https://img1.cohimg.net/is/image/Coach/cp899_blk_a0',

  url: 'https://coach.com/shop/women/view-all',
  inLanguage: 'en-US',

  mainEntity: {
    '@type': ITEM_LIST,
    itemListOrder: `${BASE_URL}${SORT_ASCENDING}`,
    numberOfItems: 2,
    itemListElement: [
      {
        '@type': LIST_ITEM,
        position: '1',
        url: 'https://coach.com/products/coachtopia/alterego-satchel-bag-in-checkerboard-upcrafted-leather/CAE88.html',
        item: {
          '@type': PRODUCT,
          '@id':
            'https://coach.com/products/coachtopia/alterego-satchel-bag-in-checkerboard-upcrafted-leather/CAE88.html',
          name: 'Alter/Ego Satchel Bag In Checkerboard Upcrafted Leather',
          sku: 'CU068 B4XAT',
          color: 'Brass/Dark Rose Red',
          material: 'Leather',
          image: [
            'https://coach.scene7.com/is/image/Coach/cae88_mpl_a0',
            'https://coach.scene7.com/is/image/Coach/cae88_mpl_a1',
            'https://coach.scene7.com/is/image/Coach/cae88_mpl_a2',
          ],
          offers: {
            '@type': OFFER,
            priceCurrency: 'USD',
            price: '150.00',
            availability: 'https://schema.org/InStock',
            url: 'https://coach.com/products/coachtopia/alterego-satchel-bag-in-checkerboard-upcrafted-leather/CAE88.html',
          },
          aggregateRating: {
            '@type': AGGREGATE_RATING,
            ratingValue: 4.5,
            reviewCount: 40,
          },
        },
      },
      {
        '@type': LIST_ITEM,
        position: '2',
        url: 'https://coach.com/products/coachtopia/alterego-shoulder-bag-in-checkerboard-upcrafted-leather/CY360-BLK.html',
        item: {
          '@type': PRODUCT,
          '@id':
            'https://coach.com/products/coachtopia/alterego-shoulder-bag-in-checkerboard-upcrafted-leather/CY360-BLK.html',
          name: 'Alter/Ego Shoulder Bag In Checkerboard Upcrafted Leather',
          sku: 'CU068 BLK',
          color: 'Black',
          material: 'Dark Leather',
          image: ['https://coach.scene7.com/is/image/Coach/cy360_blk_a0'],
          offers: {
            '@type': AGGREGATE_OFFER,
            priceCurrency: 'USD',
            lowPrice: '100.00',
            highPrice: '150.00',
            availability: 'https://schema.org/OutOfStock',
            url: 'https://coach.com/products/coachtopia/alterego-shoulder-bag-in-checkerboard-upcrafted-leather/CY360-BLK.html',
          },
          aggregateRating: {
            '@type': AGGREGATE_RATING,
            ratingValue: 5.0,
            reviewCount: 20,
          },
        },
      },
    ],
  },
}

const expectedMetaDataForEmptyProducts = {
  '@context': BASE_URL,
  '@type': COLLECTION_PAGE,
  '@id': 'https://coach.com/shop/women/view-all',
  name: "Women's   Styles | COACH®",
  headline: "Women's   Styles | COACH®",
  description: "Shop All Women's   Styles At COACH®. Enjoy Free Shipping & Returns On All Orders.",
  image: 'https://img1.cohimg.net/is/image/Coach/cp899_blk_a2',

  url: 'https://coach.com/shop/women/view-all',
  inLanguage: 'en-US',

  mainEntity: {
    '@type': ITEM_LIST,
    itemListOrder: `${BASE_URL}${SORT_ASCENDING}`,
    numberOfItems: 0,
    itemListElement: [],
  },
}

const backendDomain = 'coach.com'
const locale = 'en-US'
const pageData = {
  currentPageTitle: "Women's   Styles | COACH®",
  pageTitle: "Women's   Styles | COACH®",
  currentPageDescription:
    "Shop All Women's   Styles At COACH®. Enjoy Free Shipping & Returns On All Orders.",
  pageDescription:
    "Shop All Women's   Styles At COACH®. Enjoy Free Shipping & Returns On All Orders.",
  canonicalUrl: 'https://coach.com/shop/women/view-all',
}

describe('meta tags helpers', () => {
  describe('createPLPSEOitemsList', () => {
    it('transforms products into a JSON metadata string', () => {
      const { seoProductsMetaData } = createPLPSEOitemsList({
        backendDomain,
        products,
        pageData,
        locale,
        categoryImage: 'https://img1.cohimg.net/is/image/Coach/cp899_blk_a0',
      })

      expect(seoProductsMetaData).toEqual(JSON.stringify(expectedMetaData))
    })

    it('returns metadata with empty itemListElement when products array is empty', () => {
      const { seoProductsMetaData } = createPLPSEOitemsList({
        backendDomain,
        products: [],
        pageData,
        locale,
        categoryImage: 'https://img1.cohimg.net/is/image/Coach/cp899_blk_a2',
      })

      expect(JSON.parse(seoProductsMetaData)).toEqual(expectedMetaDataForEmptyProducts)
    })
  })
})
