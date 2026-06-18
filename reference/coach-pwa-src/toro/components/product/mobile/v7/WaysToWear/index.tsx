import React from 'react'
import Flex from 'toro/components/Flex'
import HtmlContent from 'toro/components/HtmlContent'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import useProductData from 'toro/hooks/useProductData'

export const WAYS_TO_WEAR_MARKUP_PATH = 'waysToWearContent.c_body.default.markup'
export const WAYS_TO_WEAR_ONLINE_PATH = 'waysToWearContent.online.default'
export const WAYS_TO_WEAR_ASSET_ID_PATH = 'waysToWearContent.id'

export function hasWaysToWearProductContent(
  markup: string | undefined,
  isOnline: boolean | undefined
): boolean {
  return Boolean(isOnline && markup?.trim())
}

function toDomId(value: unknown): string | undefined {
  if (typeof value === 'string' && value.trim()) return value.trim()
  if (typeof value === 'number' && Number.isFinite(value)) return String(value)
  return undefined
}

const WaysToWear = () => {
  const styles = useMultiStyleConfig('WaysToWear')
  const [markup, isOnline, assetId] = useProductData([
    WAYS_TO_WEAR_MARKUP_PATH,
    WAYS_TO_WEAR_ONLINE_PATH,
    WAYS_TO_WEAR_ASSET_ID_PATH,
  ])

  if (!hasWaysToWearProductContent(markup, isOnline)) {
    return null
  }

  const rootId = toDomId(assetId)

  return (
    <Flex
      id={rootId}
      className="ways-to-wear-container"
      sx={styles.WaysToWear}
      data-qa="ways-to-wear-container"
    >
      <HtmlContent
        content={markup}
        data-qa="ways-to-wear-container-asset"
        lazyLoadImages
        lazyLoadVideos
      />
    </Flex>
  )
}

export default WaysToWear
