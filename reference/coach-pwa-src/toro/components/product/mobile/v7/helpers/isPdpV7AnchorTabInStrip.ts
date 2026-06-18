import type { PdpV7AnchorStripTabVisibility } from 'toro/components/product/mobile/v7/hooks/usePdpV7AnchorNavTabVisibility'

export function isPdpV7AnchorTabInStrip(
  tabId: string,
  stripVisibility: PdpV7AnchorStripTabVisibility
): boolean {
  switch (tabId) {
    case 'compare':
      return stripVisibility.compare
    case 'features':
      return stripVisibility.features
    case 'makeItYours':
      return stripVisibility.makeItYours
    case 'specs':
      return stripVisibility.specs
    case 'ugc':
      return stripVisibility.ugc
    case 'waysToWear':
      return stripVisibility.waysToWear
    case 'ymal':
      return stripVisibility.ymal
    default:
      return true
  }
}
