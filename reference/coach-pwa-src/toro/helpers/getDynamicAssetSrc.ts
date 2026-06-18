import get from 'lodash/get'
import isString from 'lodash/isString'
import isBoolean from 'lodash/isBoolean'

type DynamicAssetConfig = {
  Preset: 'png'
  Scene7Template: 'pngTemplate'
  assetType: string
  enable: boolean
  zoomPreset: 'pngZoom'
}

export default function getDynamicAssetSrc(
  src: string,
  isZoom: boolean,
  dynamicAssetConfig?: DynamicAssetConfig
): null | string {
  const dynamicAssetPreset = get(dynamicAssetConfig, 'Preset', 'png')
  const dynamicAssetZoomPreset = get(dynamicAssetConfig, 'zoomPreset', 'pngZoom')

  if (
    !isString(src) ||
    !isBoolean(isZoom) ||
    !isString(dynamicAssetPreset) ||
    !isString(dynamicAssetZoomPreset)
  ) {
    return null
  }

  const dynamicAssetUrl = new URL(src)
  const suffix = isZoom ? dynamicAssetZoomPreset : dynamicAssetPreset

  if (isZoom) {
    // Clear regular image preset before applying zoom image preset
    dynamicAssetUrl.searchParams.delete(`$${dynamicAssetPreset}$`)

    dynamicAssetUrl.searchParams.set(`size`, '1600,2000')
  }

  dynamicAssetUrl.searchParams.set(`$${suffix}$`, '')

  return decodeURIComponent(dynamicAssetUrl.toString())
}
