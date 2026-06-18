import { useAtomValue } from 'jotai/utils'
import { imageDomainAtom } from 'store/global.atom'
import usePreference from 'toro/hooks/usePreference_new'
import { getImageSuffixOptions } from 'toro/helpers/productImages'
/**
 * Constructs the Scene7 Flock swatch image URL using the pattern
 *
 * @param masterId - The master product ID
 * @param colorId - The color variation ID
 * @param angle - The angle suffix, defaults to "c"
 * @returns The Scene7 image URL or null if required parameters are missing
 *
 * URL Pattern: {imageDomain}/{scene7Prefix}/{masterId}_{colorId}_{angle}
 * Example: https://coach.scene7.com/is/image/Coach/cu068_b4mpl_c
 * Example: https://katespade.scene7.com/is/image/KateSpade/cu068_b4mpl_c
 */
export const useFlockSwatchImageUrl = (
  masterId: string | undefined,
  colorId: string | undefined,
  angle: string = 'c'
): string | null => {
  const imageDomain = useAtomValue(imageDomainAtom)
  const {
    sceneSeven: { placeholderAssetName = '' },
  } = usePreference({
    sceneSeven: ['placeholderAssetName'],
  })

  // Return null if required parameters are missing
  if (!colorId || !imageDomain || !placeholderAssetName || !masterId) {
    return null
  }

  // Extract scene7Prefix from placeholderAssetName (e.g., "/is/image/Coach")
  const scene7Prefix = placeholderAssetName.split('/').slice(0, -1).join('/')

  // Construct the Scene7 URL following the pattern
  const fileName = `${masterId}_${colorId}_${angle}`.toLowerCase().replace(/\//g, '')
  const imageTypeSuffix = getImageSuffixOptions('pdp', { isSwatchImageV3: true })['mobile']
  const scene7Url = `${imageDomain}${scene7Prefix}/${fileName}?${imageTypeSuffix}`

  return scene7Url
}
