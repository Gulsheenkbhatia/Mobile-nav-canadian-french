import { useCallback, useMemo, useContext, useState, useEffect } from 'react'
import ProductsListing from 'toro/components/list/ProductsListing'
import Flex from 'toro/components/Flex'
import get from 'lodash/get'
import CategoryHeader from 'toro/components/listing/CategoryHeader'
import useViewportType from 'toro/hooks/useViewportType'
import useMonetateTrack from 'toro/hooks/useMonetateTrack'
import Box from 'toro/components/Box'
import ProductsListSkeleton from 'toro/components/list/ProductsListSkeleton'
import CircularProgress from 'toro/components/CircularProgress'
import Hidden from 'toro/components/Hidden'
import PWAContext from 'components/common/PWAContext'
import Link from 'toro/components/Link'
import {
  searchResultPageAtom,
  searchResultsReloadingAtom,
  adjacentPageUrlsAtom,
  searchResultsUrlAtom,
  focusedFilteringAtom,
} from 'store/search-results.atom'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import useStickyHeaderHeight from 'toro/hooks/useStickyHeaderHeight'
import useTheme from 'toro/hooks/useTheme'
import { getMasterIdForProductWithoutVariants } from 'toro/helpers/productVariations'
import { isPageDataPrefetched, updateProductDataForQuickView } from 'toro/helpers/plp'
import usePreferenceNew from 'toro/hooks/usePreference_new'
import dynamic from 'next/dynamic'
import getPriceType from 'toro/helpers/getPriceType'
import { isPlpV3Atom, isCompletePlpV3DesktopAtom } from 'store/plp.atom'
import { setNewProductDataAtom, isQuickViewAtom } from 'store/pdp.atom'
import HorizontalFiltersBar from 'toro/components/list/HorizontalFiltersBar'
import useExperiment from 'toro/hooks/useExperiment'
import { EXPERIMENTS } from 'toro/constants/experiments'
import { useClearInteractions } from 'toro/components/Certona/TabbedRecommendation/helpers'

const Filters = dynamic(() => import('toro/components/list/Filters'))

const ProductsResults = ({
  fetchProductDataWithLoad,
  products,
  setQuickViewedProduct,
  pageData = {},
  loading,
  styles,
}) => {
  const theme = useTheme()
  const { appData } = useContext(PWAContext)
  const reloading = useAtomValue(searchResultsReloadingAtom)
  const isHeaderHeight = useStickyHeaderHeight()
  const { isDesktop, isMobile } = useViewportType()
  const isFocusedFilteringExperimentEnabled = useExperiment(EXPERIMENTS.FOCUSED_FILTERING)
  const isPlpV3 = useAtomValue(isPlpV3Atom)
  const isCompletePlpV3Desktop = useAtomValue(isCompletePlpV3DesktopAtom)
  const pageType = get(pageData, 'pageType')
  const suppressMaterial = get(pageData, 'c_suppressMaterial', false)
  const isComparablePriceEnabledCategory = get(pageData, 'isComparablePriceEnabledCategory', false)
  const matchExperienceConfig = get(pageData, 'matchExperienceConfig', {})
  const page = useAtomValue(searchResultPageAtom)
  const showSkeleton = loading || (reloading && page === 1)
  const inlinePromoTileSlotsContent = get(pageData, 'contentInlinePromoAssetsSlotData')
  const { urlToFetch } = useAtomValue(searchResultsUrlAtom)

  const setProductData = useUpdateAtom(setNewProductDataAtom)
  const setIsQuickView = useUpdateAtom(isQuickViewAtom)
  const { nextUrl, prevUrl } = useAtomValue(adjacentPageUrlsAtom)
  const setFocusedFiltering = useUpdateAtom(focusedFilteringAtom)
  const focusedFiltering = useAtomValue(focusedFilteringAtom)
  const { absNextUrl, absPrevUrl } = useMemo(() => {
    const domain = get(appData, 'backendDomain', '')
    return {
      absNextUrl: nextUrl ? encodeURI(`https://${domain}${nextUrl}`) : '',
      absPrevUrl: prevUrl ? encodeURI(`https://${domain}${prevUrl}`) : '',
    }
  }, [nextUrl, prevUrl])
  const [shouldShowPaginationSpinner, setShouldShowPaginationSpinner] = useState(false)

  useMonetateTrack({
    isEnabled: !loading && !reloading,
    pageType,
    products: products
      .filter((product) => product.masterId)
      .map((product) => ({ productId: product.masterId })),
  })

  useEffect(() => {
    const isFilterEnabled =
      isMobile && isFocusedFilteringExperimentEnabled && get(pageData, 'enableFocusFilter')
    const ffCategoryID = focusedFiltering?.categoryID
    const pageDataID = get(pageData, 'id')

    // Prevents resetting focused filters when visiting the same PLP
    const isVisitingPreviousPLP = !!ffCategoryID && ffCategoryID === pageDataID
    if (isFocusedFilteringExperimentEnabled && (loading || isVisitingPreviousPLP)) return

    if (!isFilterEnabled) {
      if (ffCategoryID) {
        setFocusedFiltering({ categoryID: null, value: null })
      }
      return
    }

    if (!ffCategoryID) {
      setFocusedFiltering({
        categoryID: pageDataID,
        value: null,
      })
    } else if (ffCategoryID && ffCategoryID !== pageDataID) {
      setFocusedFiltering({ categoryID: null, value: null })
    }
  }, [
    pageData?.id,
    focusedFiltering,
    isMobile,
    isFocusedFilteringExperimentEnabled,
    pageData?.enableFocusFilter,
    loading,
  ])

  useClearInteractions(pageData?.id)

  useEffect(() => {
    const updateSpinnerState = async (url) => {
      const isPrefetched = await isPageDataPrefetched(url)
      setShouldShowPaginationSpinner(!isPrefetched)
    }

    if (reloading && page > 1 && urlToFetch) {
      updateSpinnerState(urlToFetch)
    } else {
      setShouldShowPaginationSpinner(false)
    }
  }, [reloading, page, urlToFetch])

  /*
  We set 'isComparablePriceValue' to 'true' by default because we have to make sure we only render
  the list price when we are allowed to.
  The list price and comparable value are mutually exclusive.
  */
  const {
    priceSitePreferences: { isComparablePriceValue },
    storefrontConfigs: { showQuickView },
  } = usePreferenceNew({
    priceSitePreferences: ['isComparablePriceValue'],
    'Storefront Configs': ['showQuickView'],
  })

  const quickViewEnabled = useMemo(() => isDesktop && showQuickView, [showQuickView, isDesktop])

  const onQuickViewClick = useCallback(
    async (url, id, masterId, variants, colorId) => {
      if (quickViewEnabled) {
        const productData = await fetchProductDataWithLoad({
          url,
          cached: false,
          id,
          masterId: getMasterIdForProductWithoutVariants(masterId, variants),
          variants,
          colorId,
          locale: appData?.localeInPath,
          include: 'klarna,sizeGuide',
        })
        const updatedProductData = updateProductDataForQuickView({ id, productData, products })

        setProductData({
          productType: { variant: true },
          ...updatedProductData,
        })
        setIsQuickView(true)
        setQuickViewedProduct(updatedProductData)
      }
    },
    [fetchProductDataWithLoad, quickViewEnabled, appData?.localeInPath, products]
  )

  // used to style badges from override content asset depending on template
  function getWrapperClassnameSufix() {
    if (isPlpV3) return 'product-search-results-plpv3'
    return
  }

  return (
    <Flex
      id="product-search-results"
      sx={styles.productResultsWrapper}
      data-qa="plp-search-result-wrapper"
      className={getWrapperClassnameSufix()}
    >
      {absPrevUrl && <Link href={absPrevUrl} variant="unstyled" w="0" h="0" />}
      {absNextUrl && <Link href={absNextUrl} variant="unstyled" w="0" h="0" />}
      {!isCompletePlpV3Desktop && (
        <Hidden
          onNonDesktop
          sx={styles.filtersWrapper(isHeaderHeight)}
          className="custom-scrollbar"
        >
          <Filters disableScroll sx={styles.filters} data-qa="d_plpfltr_sctn_fltr_panel" />
        </Hidden>
      )}
      <Box sx={styles.tilesWrapper} data-qa="plp-search-result-wrapper">
        {isCompletePlpV3Desktop ? (
          <HorizontalFiltersBar />
        ) : (
          <Hidden onNonDesktop w="100%">
            <CategoryHeader sx={styles.tedbarWrapper} loading={loading} />
          </Hidden>
        )}
        {showSkeleton ? (
          <ProductsListSkeleton />
        ) : (
          <ProductsListing
            products={products}
            onQuickViewClick={onQuickViewClick}
            priceType={getPriceType(pageData)}
            inlinePromoTileSlotsContent={inlinePromoTileSlotsContent}
            isComparablePriceValue={isComparablePriceValue}
            suppressMaterial={suppressMaterial}
            pageType={pageType}
            pageSize={get(pageData, 'pageSize')}
            isSPC={pageData.isSPC}
            isFPC={pageData.isFPC}
            enableAddToBag={get(pageData, 'enableAddToBag', false)}
            isComparablePriceEnabledCategory={isComparablePriceEnabledCategory}
            isCertonaTileEnabled={get(pageData, 'isCertonaTileEnabled', false)}
            matchExperienceConfig={matchExperienceConfig}
            categoryID={get(pageData, 'id')}
            categoryImageSequence={get(pageData, 'categoryImageSequence')}
            bottomSlots={get(pageData, 'bottomSlots')}
            styles={styles}
          />
        )}

        <Flex sx={styles.circularProgressStyles}>
          {shouldShowPaginationSpinner && (
            <CircularProgress isIndeterminate color={theme.colors.main.black} />
          )}
        </Flex>
      </Box>
    </Flex>
  )
}

export default ProductsResults
