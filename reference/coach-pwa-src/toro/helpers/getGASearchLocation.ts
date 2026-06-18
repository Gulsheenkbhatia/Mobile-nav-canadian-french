import { MOBILE_VARIANTS_TYPES } from 'toro/constants/mobileVariants'

export function getGASearchLocation(variant: string) {
  if (
    [
      MOBILE_VARIANTS_TYPES.MOBILE_EXPOSED,
      MOBILE_VARIANTS_TYPES.MOBILE_TRANSPARENT_EXPOSED,
      MOBILE_VARIANTS_TYPES.MOBILE_V2_REDESIGN_EXPOSED,
      'desktop',
    ].includes(variant)
  ) {
    return 'header search bar'
  }

  if (
    [MOBILE_VARIANTS_TYPES.MOBILE_V2, MOBILE_VARIANTS_TYPES.MOBILE_V2_REDESIGN, 'mobile'].includes(
      variant
    )
  ) {
    return 'hamburger menu search bar'
  }

  if (['footer', 'footerMobile'].includes(variant)) {
    return 'footer search bar'
  }

  return 'search bar'
}
