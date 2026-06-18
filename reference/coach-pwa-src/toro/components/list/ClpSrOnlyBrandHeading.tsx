import { useAtomValue } from 'jotai/utils'

import { getBrandDisplayName } from 'helpers/getBrandDisplayName'
import Box from 'toro/components/Box'
import { isOneCoachInOutletCategoryAtom } from 'store/menu-data.atom'
import { isSubBrandActiveAtom, brandAtom, subBrandAtom } from 'store/global.atom'
import { isOutletHPAtom, isSubHPAtom } from 'store/navigation.atom'

export default function ClpSrOnlyBrandHeading() {
  const isOutletHP = useAtomValue(isOutletHPAtom)
  const isSubHP = useAtomValue(isSubHPAtom)
  const isSubBrandActive = useAtomValue(isSubBrandActiveAtom)
  const isOneCoachInOutletCategory = useAtomValue(isOneCoachInOutletCategoryAtom)
  const brand = useAtomValue(brandAtom)
  const subBrand = useAtomValue(subBrandAtom)

  const isHomePage = isOutletHP || isSubHP
  const brandName = getBrandDisplayName(
    isSubBrandActive,
    brand,
    subBrand,
    isOneCoachInOutletCategory
  )

  if (!isHomePage || !brandName) {
    return null
  }

  return (
    <Box as="h1" className="sr-only">
      {brandName}
    </Box>
  )
}
