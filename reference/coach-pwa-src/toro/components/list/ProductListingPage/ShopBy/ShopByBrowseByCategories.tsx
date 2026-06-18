import { useEffect } from 'react'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import { searchResultsReloadingAtom } from 'store/search-results.atom'
import { setFullscreenLoadingAtom } from 'store/fullscreen-loading.atom'
import ShopByCategorySection from 'toro/components/list/ProductListingPage/ShopBy/ShopByCategorySection'

const PRODUCT_TILE_COUNT = 6

function ShopByBrowseByCategories({ sections, pageData }) {
  const setFullscreenLoading = useUpdateAtom(setFullscreenLoadingAtom)
  const reloading = useAtomValue(searchResultsReloadingAtom)

  useEffect(() => {
    setFullscreenLoading(reloading)

    return () => {
      setFullscreenLoading(false)
    }
  }, [reloading, setFullscreenLoading])

  return sections.map((section, index) => (
    <ShopByCategorySection
      key={section.alternateH1Tag}
      sectionData={section}
      cellStartIndex={index * PRODUCT_TILE_COUNT}
      onModelPlpSequence={pageData.onModelPlpSequence}
    />
  ))
}

export default ShopByBrowseByCategories
