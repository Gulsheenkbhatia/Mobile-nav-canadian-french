import ReactDOMServer from 'react-dom/server'
import HotspotProductTile from 'toro/cms/components/HotspotProductTile'

type PricingInfo = {
  type?: string
  sales: {
    value: number
    currency: string
    formatted: string
    decimalPrice: string
  }
  list: {
    value: number
    currency: string
    formatted: string
    decimalPrice: string
  }
  promotionalPrice?: any
  markdownDiscPercent?: number
  promotionDiscPercent?: number
  discountPercentage?: number
  min?: {
    sales: {
      formatted: string
    }
  }
  max?: {
    sales: {
      formatted: string
    }
  }
}

type DefaultVariant = {
  offers?: {
    priceValidUntil: string
    availability: string
  }
  id?: string
  masterId?: string
  variationValues?: {
    color?: string
    [key: string]: any
  }
  badgeData?: {
    bundlePromoJson?: any
    marketingBadge?: boolean
    marketingBadgeJson?: any
    marketingMessage?: boolean
    marketingMessageJson?: any
    soldOutBadge?: any
    bestSeller?: {
      pid: string
      bestseller: boolean
    }
  }
  customAttributes?: {
    [key: string]: any
  }
  promotionalCallouts?: Array<{
    promotionalPrice?: string
    isCouponCodeTypePromo?: boolean
    id: string
    name: string
    calloutMessageType: string
    promoCallOut: string
    [key: string]: any
  }>
  displayBopisCTA?: boolean
  UPC?: string
  pricingInfo?: PricingInfo[]
  productType?: {
    variant?: boolean
  }
}

type ProductData = {
  name: string
  url: string
  id: string
  defaultVariant: DefaultVariant
  defaultVariantGroup?: {
    imageGroups?: Array<{
      viewType: string
      images?: Array<{
        alt: string
        title: string
        src: string
        [key: string]: any
      }>
      [key: string]: any
    }>
    [key: string]: any
  }
}
type FormattedPrice = {
  salePrice?: string
  min?: string
  max?: string
}
export type HotspotProductData = {
  prodName: string
  relativeProdUrl: string
  ID: string
  formattedPrice: FormattedPrice
  defaultImage: {
    src: string
    alt: string
    title: string
  }
}

const constructUrlWithFrp = (baseUrl: string, productId: string): string => {
  if (!baseUrl || !productId) return baseUrl
  if (productId.includes(' ')) {
    const [pathname, existingSearch] = baseUrl.split('?')
    const searchParams = new URLSearchParams(existingSearch || '')
    searchParams.set('frp', productId)
    return `${pathname}?${searchParams.toString()}`
  }
  return baseUrl
}

export default function productDataToHotspotHTML(fullProductsData: ProductData[]) {
  const {
    name = '',
    url = '',
    id = '',
    defaultVariant = {},
    defaultVariantGroup = {},
  } = fullProductsData?.[0] || {}

  const pricing = defaultVariant?.pricingInfo?.[0]
  let formattedPrice: FormattedPrice = {}
  if (pricing) {
    if (pricing.type === 'range') {
      formattedPrice.min = pricing.min?.sales?.formatted || ''
      formattedPrice.max = pricing.max?.sales?.formatted || ''
    } else {
      formattedPrice.salePrice = pricing?.sales.formatted || ''
    }
  }
  const defaultImage = defaultVariantGroup?.imageGroups?.find(
    (group) => group.viewType === 'Product'
  )?.images?.[0] || { src: '', alt: '', title: '' }

  const productData: HotspotProductData = {
    prodName: name,
    relativeProdUrl: constructUrlWithFrp(url, id),
    ID: id,
    formattedPrice,
    defaultImage,
  }

  return ReactDOMServer.renderToStaticMarkup(<HotspotProductTile productData={productData} />)
}
