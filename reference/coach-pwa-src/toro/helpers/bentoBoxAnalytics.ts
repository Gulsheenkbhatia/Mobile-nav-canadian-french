import { getFileBaseName } from 'toro/components/product/ProductMediaArea/helpers'

export interface BentoBoxAnalyticsParams {
  eventAction: string
  mediaIndex: number
  mediaSrc: string
  selectedVariantId: string
  swatchValue?: string
  swatchVariant?: string
}

export const getBentoBoxSwatchInteractionEvent = ({
  eventAction,
  mediaSrc,
  selectedVariantId,
  swatchValue,
  swatchVariant,
}: Omit<BentoBoxAnalyticsParams, 'mediaIndex'>) => {
  return [
    'swatchInteraction',
    {
      eventAction,
      eventLabel: selectedVariantId,
      swatchType: 'product image',
      swatchValue: swatchValue || getFileBaseName(mediaSrc),
      swatchVariant: swatchVariant || selectedVariantId,
    },
  ]
}

export const BentoBoxEventActions = {
  PRODUCT_TILE_CLICK: (position: number) => `P${position}:product image click`,
  IMAGE_TILE_ZOOM: (position: number) => `P${position}:product image zoom`,
  PRODUCT_IMAGE_SWIPE: (position: number) => `P${position}:product image swipe`,
  PRODUCT_IMAGE_SCROLL: (position: number) => `P${position}:product image scroll view`,
  CAROUSEL_SCROLL: 'product image carousel scroll',
} as const

export const getBentoBoxTileClickEvent = (params: Omit<BentoBoxAnalyticsParams, 'eventAction'>) => {
  return getBentoBoxSwatchInteractionEvent({
    ...params,
    eventAction: BentoBoxEventActions.PRODUCT_TILE_CLICK(params.mediaIndex + 1),
  })
}

export const getBentoBoxImageZoomEvent = (params: Omit<BentoBoxAnalyticsParams, 'eventAction'>) => {
  return getBentoBoxSwatchInteractionEvent({
    ...params,
    eventAction: BentoBoxEventActions.IMAGE_TILE_ZOOM(params.mediaIndex + 1),
  })
}

export const getBentoBoxPopupSwipeEvent = (
  params: Omit<BentoBoxAnalyticsParams, 'eventAction'>
) => {
  return getBentoBoxSwatchInteractionEvent({
    ...params,
    eventAction: BentoBoxEventActions.PRODUCT_IMAGE_SWIPE(params.mediaIndex + 1),
  })
}

export const getBentoBoxPopupScrollEvent = (
  params: Omit<BentoBoxAnalyticsParams, 'eventAction'>
) => {
  return getBentoBoxSwatchInteractionEvent({
    ...params,
    eventAction: BentoBoxEventActions.PRODUCT_IMAGE_SCROLL(params.mediaIndex + 1),
  })
}

export const getBentoBoxCarouselScrollEvent = (
  params: Pick<BentoBoxAnalyticsParams, 'selectedVariantId'>
) => {
  return [
    'swatchInteraction',
    {
      eventAction: BentoBoxEventActions.CAROUSEL_SCROLL,
      eventLabel: params.selectedVariantId,
      swatchType: 'product image',
      swatchValue: undefined,
      swatchVariant: undefined,
    },
  ]
}
