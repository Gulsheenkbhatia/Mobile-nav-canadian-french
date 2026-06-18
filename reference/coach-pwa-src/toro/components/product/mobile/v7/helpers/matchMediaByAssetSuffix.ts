export const ASSET_SUFFIX_MAIN_IMAGE = 'NA'

export function normalizeAssetSuffix(assetSuffix: string): string {
  return assetSuffix.trim().replace(/,$/, '').trim()
}

/** Extracts trailing pattern like `_2` from a file path stem. */
export function getTrailingNumericSuffixFromPath(path: string): string | null {
  const fileName = path.split('/').pop() || ''
  const fileStem = fileName.includes('.') ? fileName.replace(/\.[^.]+$/, '') : fileName
  const suffixMatch = fileStem.match(/(_\d+)$/)
  return suffixMatch?.[1] ?? null
}

function getMediaSrc(mediaItem: unknown): string {
  if (mediaItem === null || typeof mediaItem !== 'object' || !('src' in mediaItem)) return ''
  const srcValue = (mediaItem as { src?: unknown }).src
  return typeof srcValue === 'string' ? srcValue : ''
}

const isVideoMedia = (mediaItem: unknown) =>
  mediaItem !== null &&
  typeof mediaItem === 'object' &&
  (mediaItem as { type?: string }).type === 'video'

function getMediaPathWithoutQuery(mediaItem: unknown): string {
  return getMediaSrc(mediaItem).split('?')[0]
}

function getMediaAssetSuffix(mediaItem: unknown): string | null {
  return getTrailingNumericSuffixFromPath(getMediaPathWithoutQuery(mediaItem))
}

export function findMediaIndexByVideoAssetKey(
  medias: readonly unknown[],
  assetUrlKey: string
): number {
  const key = assetUrlKey.trim()
  if (!key) return -1

  return medias.findIndex((mediaItem) => {
    if (!isVideoMedia(mediaItem)) return false
    const src = getMediaSrc(mediaItem)
    return src.includes(key)
  })
}

export function findMediaIndexByAssetSuffix(
  medias: readonly unknown[],
  assetSuffix: string
): number {
  const suffix = normalizeAssetSuffix(assetSuffix)
  if (!suffix) return -1

  if (suffix.toUpperCase() === ASSET_SUFFIX_MAIN_IMAGE) {
    // Main image: first non-video image whose filename has no trailing "_<number>" suffix.
    const mainImageIndex = medias.findIndex(
      (mediaItem) => !isVideoMedia(mediaItem) && getMediaAssetSuffix(mediaItem) === null
    )
    if (mainImageIndex >= 0) return mainImageIndex

    // Fallback: first non-video asset.
    const firstNonVideoIndex = medias.findIndex((mediaItem) => !isVideoMedia(mediaItem))
    if (firstNonVideoIndex >= 0) return firstNonVideoIndex

    return medias.length > 0 ? 0 : -1
  }

  return medias.findIndex((mediaItem) => getMediaAssetSuffix(mediaItem) === suffix)
}
