import get from 'lodash/get'
import { parseProductId } from 'toro/helpers/productVariations'

export const ACCESSORIZED_IMAGE_ANGLE = 'c0'

/**
 * Generates the accessorized image URL for a product with an accessory
 * This constructs a Scene7 composite image URL showing the base product with the accessory
 *
 * @param accessoryId - The product ID of the accessory (e.g., "12345-67890")
 * @param vgId - The variant group ID of the base product
 * @param imageDomain - The Scene7 image domain (e.g., "https://scene7.example.com")
 * @param scene7Prefix - The Scene7 prefix path (e.g., "is/image/coach")
 * @param angle - The image angle suffix, defaults to ACCESSORIZED_IMAGE_ANGLE constant
 * @returns The accessorized image URL or null if the accessory ID cannot be parsed
 */
export function getAccessorizedImageUrl(
  accessoryId: string,
  vgId: string,
  imageDomain: string,
  scene7Prefix: string,
  angle: string = ACCESSORIZED_IMAGE_ANGLE
): string | null {
  if (!accessoryId || !vgId || !imageDomain || !scene7Prefix) {
    return null
  }

  try {
    const parsedId = parseProductId(accessoryId)
    const accessoryMasterId = get(parsedId, 'masterId')
    const accessoryColorId = get(parsedId, 'colorId')

    if (!accessoryMasterId || !accessoryColorId) {
      return null
    }

    // Construct filename: vgId_accessoryMasterId_accessoryColorId_angle
    // Replace hyphens with underscores and convert to lowercase
    const fileName = `${vgId.replace(/-/g, '_')}_${accessoryMasterId}_${accessoryColorId}_${angle}`
      .toLowerCase()
      .replace(/\//g, '')

    // Construct full Scene7 URL
    const accessorizedImageUrl = `${imageDomain}/${scene7Prefix}/${fileName}`

    return accessorizedImageUrl
  } catch (error) {
    // Return null if product ID cannot be parsed
    return null
  }
}
