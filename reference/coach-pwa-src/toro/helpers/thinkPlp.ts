import cheerio from 'toro/lib/cheerio'
import sanitizeHtmlMarkup from 'toro/helpers/sanitizeHtmlMarkup'

export type GridVariant = '1up' | '2up' | '3up' | '4up' | '5up' | 'fixedA' | 'fixedB' | 'fixedC'

export const GRID_SIZES_MAPPING: Record<GridVariant, number> = {
  '1up': 1,
  '2up': 2,
  '3up': 3,
  '4up': 4,
  '5up': 5,
  fixedA: 5,
  fixedB: 5,
  fixedC: 4,
}

export const DESKTOP_GRID_VARIANTS: GridVariant[] = [
  '1up',
  '2up',
  '3up',
  '4up',
  '5up',
  'fixedA',
  'fixedB',
  'fixedC',
]

export const MOBILE_GRID_VARIANTS: GridVariant[] = ['1up', '2up', '3up']

const getAdjustedGridVariant = (
  originalVariant: GridVariant,
  availableProductsCount: number
): GridVariant => {
  const originalSize = GRID_SIZES_MAPPING[originalVariant]
  return availableProductsCount < originalSize
    ? (`${availableProductsCount}up` as GridVariant)
    : originalVariant
}

export interface SFCCGridEntity {
  type: 'grid'
  value: GridVariant
}

export interface SFCCContentEntity {
  type: 'content'
  value: string
}

export interface SFCCFilterSectionEntity {
  type: 'filter'
  title: string
  tabs: { buttonText: string; content: string; filterString: string }[]
}

export interface SFCCRecommendationsEntity {
  type: 'recomGrid'
  schema: string
  viewMoreText: string
  viewLessText: string
  content?: string
  title?: string
  subtitle?: string
}

export interface SFCCRecomCarouselEntity {
  type: 'recomCarousel'
  schema: string
}

export type SFCCPageEntity =
  | SFCCGridEntity
  | SFCCContentEntity
  | SFCCFilterSectionEntity
  | SFCCRecommendationsEntity
  | SFCCRecomCarouselEntity

export interface GridEntity {
  id: string
  gridVariant: GridVariant
  products: any[]
  rowStartPosition: number
  onModelSequence?: string[]
}

export interface ContentEntity {
  id: string
  html: string
  hasVideo: boolean
}

export interface FilterEntity {
  id: string
  title: string
  productsPerPage: number | null
  rowStartPosition: number
  tabs: {
    buttonText: string
    content: { id: string; html: string } | null
    filterString: string
  }[]
}
export interface RecommendationsEntity {
  id: string
  type: 'recomGrid'
  schema: string
  viewMoreText: string
  viewLessText: string
  title?: string
  subtitle?: string
  content?: { html: string; id: string; hasVideo: boolean } | null
}
export interface RecomCarouselEntity {
  id: string
  type: string
  schema: string
}

export type PageEntity =
  | GridEntity
  | ContentEntity
  | FilterEntity
  | RecommendationsEntity
  | RecomCarouselEntity

const getSequence = ({
  gridVariant,
  mobileSequence,
  desktopSequence,
  isMobile,
}: {
  gridVariant: GridVariant
  isMobile: boolean
  mobileSequence?: string
  desktopSequence?: string
}) => {
  if (isMobile && mobileSequence && gridVariant === '1up') {
    return mobileSequence.split(',')
  }

  if (
    !isMobile &&
    desktopSequence &&
    ['1up', '2up', 'fixedA', 'fixedB', 'fixedC'].includes(gridVariant)
  ) {
    return desktopSequence.split(',')
  }

  return undefined
}

export const mapPageTemplateToProducts = ({
  pageTemplate,
  products,
  isMobile = false,
  contentSlotData,
  onModelImageSequenceMobile = '',
  onModelImageSequenceDesktop = '',
  productsPerPage,
}: {
  pageTemplate: SFCCPageEntity[]
  products: any[]
  isMobile?: boolean
  contentSlotData: string
  onModelImageSequenceMobile?: string
  onModelImageSequenceDesktop?: string
  productsPerPage: number | null
}) => {
  const html = sanitizeHtmlMarkup(contentSlotData)
  const $ = cheerio.load(html)

  const allowedGridVariants = isMobile ? MOBILE_GRID_VARIANTS : DESKTOP_GRID_VARIANTS

  const { result } = pageTemplate.reduce(
    (acc, layout, layoutIndex) => {
      if (layout.type === 'grid') {
        if (!allowedGridVariants.includes(layout.value)) {
          return acc
        }

        const gridSize = GRID_SIZES_MAPPING[layout.value]

        if (!gridSize) {
          return acc
        }

        const productsSlice = products.slice(
          acc.productsStartIndex,
          acc.productsStartIndex + gridSize
        )

        if (!productsSlice.length || (isMobile && productsSlice.length < gridSize)) {
          return {
            ...acc,
            productsStartIndex: acc.productsStartIndex + gridSize,
          }
        }

        const gridVariant = getAdjustedGridVariant(layout.value, productsSlice.length)

        const onModelSequence = getSequence({
          gridVariant,
          mobileSequence: onModelImageSequenceMobile,
          desktopSequence: onModelImageSequenceDesktop,
          isMobile,
        })

        acc.result.push({
          id: `grid-${layoutIndex}`,
          gridVariant,
          products: productsSlice,
          rowStartPosition: acc.productsStartIndex,
          onModelSequence,
        })

        return {
          ...acc,
          productsStartIndex: acc.productsStartIndex + gridSize,
        }
      } else if (layout.type === 'content') {
        const $slot = $(`#${layout.value}`)
        let markup = $slot.html()?.trim()

        // Early return if no markup
        if (!markup) {
          return acc
        }
        acc.result.push({
          id: `grid-${layoutIndex}`,
          html: markup,
          hasVideo: !!$slot?.find('.content-video')?.length,
        })

        return acc
      } else if (layout.type === 'filter') {
        acc.result.push({
          id: `filter-${layoutIndex}`,
          title: layout.title,
          productsPerPage,
          rowStartPosition: acc.productsStartIndex,
          tabs:
            layout.tabs?.map((t) => {
              const $slot = $(`#${t.content}`)
              const markup = $slot.html()?.trim()
              return {
                ...t,
                content: markup
                  ? {
                      html: markup,
                      id: t.content,
                      hasVideo: !!$slot?.find('.content-video')?.length,
                    }
                  : null,
              }
            }) ?? [],
        })
      } else if (layout.type === 'recomGrid') {
        const $slot = layout.content ? $(`#${layout.content}`) : null
        const markup = $slot?.html()?.trim()
        acc.result.push({
          id: `recom-grid-${layoutIndex}`,
          type: 'recomGrid',
          schema: layout.schema,
          viewMoreText: layout.viewMoreText,
          viewLessText: layout.viewLessText,
          title: layout.title,
          subtitle: layout.subtitle,
          content:
            markup && layout.content
              ? {
                  html: markup,
                  id: layout.content,
                  hasVideo: !!$slot?.find('.content-video')?.length,
                }
              : null,
        })
      } else if (layout.type === 'recomCarousel') {
        acc.result.push({
          id: `recom-carousel-${layoutIndex}`,
          type: 'recomCarousel',
          schema: layout.schema,
        })
      }

      return acc
    },
    { result: [] as PageEntity[], productsStartIndex: 0 }
  )

  return result
}
