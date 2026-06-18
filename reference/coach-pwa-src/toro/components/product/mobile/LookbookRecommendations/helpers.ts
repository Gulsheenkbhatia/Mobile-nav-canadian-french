import type { ResponseRecommendations } from 'toro/components/RecommendationsContainer/types'
import _isEmpty from 'lodash/isEmpty'
import { extractLookbookImage } from 'toro/components/product/ProductMediaArea/helpers'
import type { ProductMediaItem } from 'toro/types'

type LookbookPreferences = {
  brand: boolean
  subbrand: boolean
  imageAssets: string[]
  departments: string[]
  imageAssets_c?: string[]
  imageAssets_d?: string[]
}

type GetLookbookRecommendationItemsFunc = (args: {
  preferences: LookbookPreferences
  isSubBrandActive: boolean
  recommendationItems: ResponseRecommendations['items']
  department: string
}) => ResponseRecommendations['items']

type ProductMediaImageItem = Extract<ProductMediaItem, { type: 'image' }>

const isProductImageItem = (item: ProductMediaItem): item is ProductMediaImageItem =>
  item.type === 'image'

export const getLookbookRecommendationItems: GetLookbookRecommendationItemsFunc = ({
  preferences,
  isSubBrandActive,
  recommendationItems,
  department,
}) => {
  if (!recommendationItems.length) return []
  if (_isEmpty(preferences)) return recommendationItems

  const bmSiteLevelToggle = isSubBrandActive ? preferences.subbrand : preferences.brand
  const bmDepartmentLevelToggle = department && preferences.departments.includes(department)

  if (!bmSiteLevelToggle || !bmDepartmentLevelToggle) return recommendationItems

  return recommendationItems.map((item) => {
    const [lookbookImage, rest] = extractLookbookImage(item.media, preferences.imageAssets)

    if (!lookbookImage) return item

    return {
      ...item,
      media: [{ ...lookbookImage, isLookbookImage: true }, ...rest],
    }
  })
}

const DEFAULT_IMAGE_COUNT = 1
const LOOKBOOK_IMAGE_COUNT = 2

export const getImages = (mediaItems: ProductMediaItem[]): ProductMediaImageItem[] => {
  const images = mediaItems.filter(isProductImageItem)
  const count = images[0]?.isLookbookImage ? LOOKBOOK_IMAGE_COUNT : DEFAULT_IMAGE_COUNT
  return images.slice(0, count)
}
