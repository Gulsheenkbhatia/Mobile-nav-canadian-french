import { ProductCompareItemProps } from 'lib/vendorProductsAdapter/features/ProductCompareTool/types'
import { Color, DetailedProduct } from 'toro/types/productTypes'
import { recAITypes } from 'toro/analytics/useRecommAnalytics'
import { CertonaScheme } from 'store/certona-schemes.atoms'
import { MediaFromProps } from 'toro/components/product/ProductMediaArea/AdaptiveProductCarouselMobileAlt/types'

type CertonaResponseItemType = CertonaScheme['items'][number]

type ProductCompareToolItemImageType = {
  src: string
  alt: string
}

type ProductCompareToolItemType = {
  name: string
  price: string | number
  detailURL: string
  img: ProductCompareToolItemImageType
  colorSwatch: ProductCompareToolItemImageType
  certonaResponse: CertonaResponseItemType
}

export type HandleProductOnVisiblePayload = { product: ProductCompareToolItemType; idx: number }

export type RecommenderInfo = {
  title?: string
  displayAtb: boolean
  vendor: keyof typeof recAITypes
  scheme: string
  experienceId: string
}

export type CompareToolHookReturn = {
  compareProducts: ProductCompareItemProps['product'][]
  isLoading: boolean
  currentProduct: DetailedProduct & {
    price?: string
    colorSwatch?: Color
    image: MediaFromProps['full'][0] | MediaFromProps['thumbnails'][0]
    VariationIdV2?: string
    ID?: string
    SizeFlag: boolean
    displayAtb: boolean
  }
  recommenderInfo: RecommenderInfo
  handleWrapperOnVisible: () => void
  handleProductOnVisible: (props: HandleProductOnVisiblePayload) => void
  handleProductOnClick: (props: HandleProductOnVisiblePayload) => void
}
