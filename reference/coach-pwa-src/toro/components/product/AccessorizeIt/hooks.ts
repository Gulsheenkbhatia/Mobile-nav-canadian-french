import { useMemo } from 'react'
import { getProductImageSrc } from 'toro/helpers/productImages'
import useSelectedColorData from 'toro/hooks/useSelectedColorData'
import { accessorizeItSelectedProductAtom } from 'store/accessorizeIt.atom'
import { useAtomValue } from 'jotai/utils'
import useTemplate from 'toro/hooks/useTemplate'
import { TemplateName } from 'toro/constants/templates'
import { ACCESSORIZED_IMAGE_ANGLE } from 'toro/helpers/getAccessorizedImageUrl'
import usePreference from 'toro/hooks/usePreference_new'
import useIsKS from 'toro/helpers/isKS'
import uniq from 'lodash/uniq'
import { isSpecificAssetTypeSrc } from 'toro/components/product/ProductMediaArea/helpers'

const COACH_DEFAULT_ASSET_TYPES = ['a88']

/**
 * Returns the accessorized image URL for product with accessory, otherwise returns the default image
 * Uses the URL from server-side data (constructed and validated on the server)
 *
 * @param angle - The angle suffix, defaults to ACCESSORIZED_IMAGE_ANGLE constant
 * @returns The accessorized image URL or default product image
 *
 */
export function useAccessorizedImageUrl(angle: string = ACCESSORIZED_IMAGE_ANGLE): string {
  const [baseProductColor, media, productDefaultImage] = useSelectedColorData([
    'baseProductColor',
    'media',
    'media.thumbnails.0.src',
  ])

  const productImage = useMemo(() => media?.full?.find((img) => !img.isLookBook)?.src, [media])

  const isPdpV6 = useTemplate([TemplateName.pdpv6])
  const isPdpV5_1 = useTemplate([TemplateName.pdpv5_1])
  const defaultProductImage =
    (isPdpV6 || isPdpV5_1) && baseProductColor ? productDefaultImage : productImage
  const imageViewport = isPdpV5_1 ? 'desktop' : 'mobile'
  const imagePageOwner = isPdpV6 || isPdpV5_1 ? 'pdp' : 'plp'
  const imageFlags = { isPdpV6, isPdpV5: isPdpV5_1 }

  const defaultImage = getProductImageSrc(
    defaultProductImage,
    imageViewport,
    imagePageOwner,
    imageFlags
  )
  const selectedProduct = useAtomValue(accessorizeItSelectedProductAtom)

  // If no accessory is selected, return default product image
  if (!selectedProduct) {
    return defaultImage
  }

  return selectedProduct.accessorizedImageUrl || defaultImage
}

export function useAccessorizedPrice(): string | null {
  const selectedProduct = useAtomValue(accessorizeItSelectedProductAtom)
  return selectedProduct?.priceFormatted || null
}

type MediaWithSrc = { src?: string; [key: string]: any }

const findAccessorizeItSlideIndex = (
  candidateSuffixes: string[],
  fullMedias: MediaWithSrc[]
): number | null => {
  if (candidateSuffixes.length === 0) {
    return null
  }

  const matchIdx = candidateSuffixes
    .map((suffix) => fullMedias.findIndex((media) => isSpecificAssetTypeSrc(media?.src, suffix)))
    .find((idx) => idx !== -1)

  return matchIdx !== undefined ? matchIdx : null
}

/**
 * Determines which carousel slide index should display the AccessorizeIt CTA.
 *
 * Resolution order:
 * 1. Parse configured asset types from BM preference addACharmCTAImageSuffix (comma-separated).
 * 2. Append brand default suffixes not already in the list (Coach: a88).
 * 3. Remove candidate suffixes that exactly match a Tangiblee key (same BM token).
 * 4. For each remaining suffix in order, scan fullMedias left-to-right for the
 *    first image matching that suffix that does NOT also match a Tangiblee CTA key
 *    via isSpecificAssetTypeSrc (covers endsWith overlap not visible in list difference).
 * 5. Returns the matched index, or null if no valid slide is found.
 */
export function useAccessorizeItCtaTarget(fullMedias: MediaWithSrc[]): number | null {
  const preferences = usePreference({
    AccessorizeIt: ['addACharmCTAImageSuffix'],
  })

  const isKateSpade = useIsKS()

  const { addACharmCTAImageSuffix } = preferences.accessorizeIt ?? {}

  return useMemo(() => {
    const configuredTypes =
      typeof addACharmCTAImageSuffix === 'string'
        ? addACharmCTAImageSuffix
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
        : []

    const brandDefaults = isKateSpade ? [] : COACH_DEFAULT_ASSET_TYPES
    const candidateSuffixes = uniq([...configuredTypes, ...brandDefaults])

    if (candidateSuffixes.length === 0) {
      return null
    }

    return findAccessorizeItSlideIndex(candidateSuffixes, fullMedias)
  }, [fullMedias, addACharmCTAImageSuffix, isKateSpade])
}
