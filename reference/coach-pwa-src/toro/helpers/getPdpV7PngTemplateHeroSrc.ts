import get from 'lodash/get'
import isBoolean from 'lodash/isBoolean'
import isString from 'lodash/isString'

export type PdpV7PngTemplateConfig = {
  enable?: boolean
  Scene7Template?: string
  Preset?: string
  assetType?: string
  zoomPreset?: string
  offset?: string | number
}

export default function getPdpV7PngTemplateHeroSrc(
  src: string,
  isZoom: boolean,
  config?: PdpV7PngTemplateConfig | null
): string | null {
  const scene7Template = get(config, 'Scene7Template', 'pngTemplate')
  const preset = get(config, 'Preset', 'png')
  const zoomPreset = get(config, 'zoomPreset', 'pngZoom')
  const offset = get(config, 'offset', '0.035')

  if (
    !isString(src) ||
    !isBoolean(isZoom) ||
    !get(config, 'enable', false) ||
    !isString(scene7Template) ||
    !isString(preset) ||
    !isString(zoomPreset)
  ) {
    return null
  }

  try {
    const url = new URL(src)
    const pathParts = url.pathname.split('/').filter(Boolean)
    if (pathParts.length === 0) return null

    const sku = pathParts[pathParts.length - 1]
    if (!sku) return null

    pathParts[pathParts.length - 1] = scene7Template
    url.pathname = `/${pathParts.join('/')}`
    url.search = ''

    const suffix = preset

    url.searchParams.set(`$${suffix}$`, '')
    url.searchParams.set('$sku', sku)
    url.searchParams.set('$offset', String(offset))

    return decodeURIComponent(url.toString())
  } catch {
    return null
  }
}
