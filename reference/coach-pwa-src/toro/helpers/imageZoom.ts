import { UpdateAction } from 'react-quick-pinch-zoom/esm/PinchZoom/types'
import { MouseEvent } from 'react'

export const ZOOM_STEP_DESKTOP = 2
export const ANIM_DURATION_DESKTOP = 1000

export const ZOOM_STEP_MOBILE = 2
export const ANIM_DURATION_MOBILE = 250
export const DEFAULT_MOBILE_IMAGE_WIDTH = 360
export const DEFAULT_MOBILE_IMAGE_HEIGHT = 450 // 4:5 aspect ratio, portrait

export const ZOOM_SCALE = {
  ZERO: 0,
  ONE: 1,
  TWO: 2,
}

export const MAX_ZOOM = {
  '1xZoom': 2,
  '2xZoom': 4,
}

// zoomClickCount is 0, 1 or 2
const getZoomScale = (zoomClickCount: number, zoomStep: number): number => {
  if (zoomClickCount === 1) {
    return zoomStep
  } else if (zoomClickCount === 2) {
    return zoomStep * 2
  }
  return 1
}

export const getClickPosScaleOnElement = (
  e: MouseEvent<HTMLImageElement>,
  zoomClickCount: number,
  zoomStep: number
): UpdateAction => {
  const scale = getZoomScale(zoomClickCount, zoomStep)
  const q = scale / zoomStep
  const rect = (e.target as HTMLImageElement).getBoundingClientRect()
  // x and y are positions within the element
  const x = (e.clientX - rect.left) / q
  const y = (e.clientY - rect.top) / q
  return { x, y, scale }
}

export const wheelInterceptHandler = () => false
