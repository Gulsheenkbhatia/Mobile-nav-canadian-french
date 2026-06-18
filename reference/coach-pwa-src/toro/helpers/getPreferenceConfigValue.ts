import get from 'lodash/get'

type PrefValue = {
  [B in 'brand' | 'subBrand']: { [D in 'desktop' | 'mobile']: { [p: string]: boolean } | boolean }
}

export default function getPreferenceConfigValue(
  prefValue: PrefValue,
  isSubBrandActive: boolean,
  isDesktop: boolean
) {
  return get(
    prefValue,
    [isSubBrandActive ? 'subBrand' : 'brand', isDesktop ? 'desktop' : 'mobile'],
    {}
  )
}
