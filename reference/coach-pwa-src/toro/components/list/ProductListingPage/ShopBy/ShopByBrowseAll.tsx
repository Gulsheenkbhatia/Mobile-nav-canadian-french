import { useMultiStyleConfig } from '@chakra-ui/react'
import { useAtomValue } from 'jotai/utils'
import get from 'lodash/get'
import { isCompletePlpV3DesktopAtom, isPlpV3Atom } from 'store/plp.atom'
import { searchResultPageAtom, searchResultsReloadingAtom } from 'store/search-results.atom'
import ProductsListSkeleton from 'toro/components/list/ProductsListSkeleton'
import ProductsListing from 'toro/components/list/ProductsListing'
import CircularProgress from 'toro/components/CircularProgress'
import Flex from 'toro/components/Flex'
import getPriceType from 'toro/helpers/getPriceType'
import usePreference from 'toro/hooks/usePreference_new'

export default function ShopByBrowseAll({
  pageData,
  loading,
}: {
  pageData: any
  loading: boolean
}) {
  const isPlpV3 = useAtomValue(isPlpV3Atom)
  const isCompletePlpV3Desktop = useAtomValue(isCompletePlpV3DesktopAtom)
  const styles = useMultiStyleConfig('ProductListCSS', {
    variant: isCompletePlpV3Desktop ? 'completePlpV3Desktop' : isPlpV3 ? 'plpV3' : '',
  })

  const page = useAtomValue(searchResultPageAtom)
  const reloading = useAtomValue(searchResultsReloadingAtom)

  const {
    priceSitePreferences: { isComparablePriceValue },
  } = usePreference({
    priceSitePreferences: ['isComparablePriceValue'],
  })

  if (loading || (reloading && page === 1)) {
    return <ProductsListSkeleton hidden={false} />
  }

  return (
    <>
      <ProductsListing
        key={`shop-by-view-all`}
        products={get(pageData, 'products', [])}
        priceType={getPriceType(pageData)}
        inlinePromoTileSlotsContent={get(pageData, 'contentInlinePromoAssetsSlotData')}
        suppressMaterial={get(pageData, 'c_suppressMaterial', false)}
        pageType={pageData?.pageType}
        pageSize={get(pageData, 'pageSize')}
        isSPC={pageData.isSPC}
        isFPC={pageData.isFPC}
        enableAddToBag={get(pageData, 'enableAddToBag', false)}
        isComparablePriceEnabledCategory={get(pageData, 'isComparablePriceEnabledCategory', false)}
        isCertonaTileEnabled={get(pageData, 'isCertonaTileEnabled', false)}
        matchExperienceConfig={get(pageData, 'matchExperienceConfig', {})}
        categoryID={get(pageData, 'id')}
        categoryImageSequence={get(pageData, 'categoryImageSequence')}
        bottomSlots={get(pageData, 'bottomSlots')}
        isComparablePriceValue={isComparablePriceValue}
        styles={styles}
      />
      {reloading && page > 1 && (
        <Flex sx={styles.circularProgressStyles}>
          <CircularProgress isIndeterminate color="var(--color-black-base)" />
        </Flex>
      )}
    </>
  )
}
