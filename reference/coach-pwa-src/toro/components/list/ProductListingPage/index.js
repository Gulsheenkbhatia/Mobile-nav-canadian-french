import get from 'lodash/get'
import Head from 'next/head'
import { useAtom } from 'jotai'
import dynamic from 'next/dynamic'
import isEmpty from 'lodash/isEmpty'
import { useIntl } from 'react-intl'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import { useState, useEffect, useMemo, useContext, useRef, useCallback } from 'react'
import { useRouter } from 'next/router'

import isSW from 'toro/helpers/isSW'
import useCmsAnalytics from 'toro/analytics/useCmsAnalytics'

import { fetchProductDataFromClient } from 'toro/helpers/fetchProductDataFromClient'

import PWAContext from 'components/common/PWAContext'
import { PLP_V3_BREADCRUMB_DEFAULT_HEIGHT } from 'toro/constants/productList'

import Box from 'toro/components/Box'
import Text from 'toro/components/Text'
import Lazy from 'toro/components/Lazy'
import Hidden from 'toro/components/Hidden'
import Center from 'toro/components/Center'
import HtmlContent from 'toro/components/HtmlContent'
import SEOMarkup from 'toro/components/list/SEOMarkup'
import BreadCrumb from 'toro/components/BreadcrumbPage'
import MainContainer from 'toro/components/MainContainer'
import BackToTopButton from 'toro/components/BackToTopButton'
import SeoItemLists from 'toro/components/AppMetaTags/ItemLists'
import SearchResultsText from 'toro/components/SearchResultsText'
import ProductsResults from 'toro/components/list/ProductsResults'
import ZeroProductsPage from 'toro/components/list/ZeroProductsPage'
import CategoryTopContentSlot from 'toro/components/list/CategoryTopContentSlot'
import CategoryBottomContentSlot from 'toro/components/list/CategoryBottomContentSlot'
import SeoPaginationLinkTags from 'toro/components/list/SeoPaginationLinkTags'

import CustomSlot from 'toro/cms/components/CustomSlot'
import ContentSlot from 'toro/cms/components/ContentSlot'

import useWithLoading from 'toro/hooks/useWithLoading'
import useViewportType from 'toro/hooks/useViewportType'
import usePreference from 'toro/hooks/usePreference_new'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import { useCertonaOnMount } from 'toro/hooks/useCertonaRequest'
import useVerticalScrollDirection from 'toro/hooks/useVerticalScrollDirection'
import useHeaderPositionPref from 'toro/hooks/useHeaderPositionPref'
import useHeadroomAtom from 'toro/hooks/useHeadroomAtom'

import {
  pageTitleAtom,
  productsAtom,
  seoDataAtom,
  totalProductsAtom,
} from 'store/search-results.atom'
import menuDataAtom from 'store/menu-data.atom'
import { setFullscreenLoadingAtom } from 'store/fullscreen-loading.atom'
import {
  isCompletePlpV3DesktopAtom,
  isPlpV3Atom,
  whitelistedLastVisitedPlpAtom,
} from 'store/plp.atom'
import { isSizeGuidePopUpOpenAtom, quickViewedProductAtom } from 'store/pdp.atom'
import withFeatureFlag from 'toro/hocs/withFeatureFlag'
import TotalCount from 'toro/components/listing/TotalCount'
import { getPageTitleWithFilters } from 'toro/helpers/metaTags'
import usePageTitle from 'toro/hooks/usePageTitle'

import CategoryHeader from 'toro/components/listing/CategoryHeader'
import MobileTopArea from 'toro/components/list/MobileTopArea'
import useExperiment from 'toro/hooks/useExperiment'
import { EXPERIMENTS } from 'toro/constants/experiments'
import { addToBagButtonOnEventAtom, isSubBrandActiveAtom } from 'store/global.atom'
import PurchaseMissionSurvey from 'toro/components/PurchaseMissionSurvey'
import NotifyMePopUp from 'toro/components/product/NotifyMeWidget'
import CoachtopiaLogoButton from 'toro/components/CoachtopiaLogoButton'
import { createLazyImporter, scheduleIdleLazyLoad } from 'toro/helpers/dynamicImportUtils'
import UGCSkeleton from 'toro/components/UGC/UGCSkeleton'
import useMediaAssetContent from 'toro/hooks/useMediaAssetContent'

const lazyUGCImporter = createLazyImporter(() => import('toro/components/UGC/UGCContainer'))

const UGCContainer = dynamic(lazyUGCImporter, {
  ssr: false,
  loading: () => <UGCSkeleton initialFetch />,
})

const SearchWidget = dynamic(() => import('toro/components/SearchWidget'), {
  ssr: false,
})

const QuickViewContent = dynamic(() => import('toro/components/list/QuickView/QuickViewContent'), {
  ssr: false,
})

const QuickViewModal = dynamic(() => import('toro/components/list/QuickView/QuickViewModal'), {
  ssr: false,
})

const DynamicSubNavigation = withFeatureFlag(
  dynamic(() => import('toro/components/DynamicSubNavigation')),
  {
    plpTemplateConfigurations: ['SiteLevelDisplayPLPSubNAV'],
  }
)

const getPageTitle = ({ pageData, pageTitle = '', title = '', brand = '', formatMessage }) => {
  const seoFacetPageTitle = get(pageData, 'seoFacetMetaTags.metaTitle', '')
  if (seoFacetPageTitle) return seoFacetPageTitle
  const currentPageTitle = get(pageData, 'currentPageTitle', '')
  if (currentPageTitle) return currentPageTitle

  const modifiedBrand = /®$/.test(brand) ? brand.toUpperCase() : `${brand}®`.toUpperCase()

  return pageData.filters?.length > 2 || pageData.filters?.length === 0
    ? pageTitle.replace('<facet-placeholder> ', '')
    : formatMessage(
        { id: 'plp.seo.facetPageTitle', defaultMessage: '{title} | {brand}' },
        { title, brand: modifiedBrand }
      )
}

function ProductListingPage({ pageData = {}, loading }) {
  const isPlpV3 = useAtomValue(isPlpV3Atom)
  const isCompletePlpV3Desktop = useAtomValue(isCompletePlpV3DesktopAtom)
  const styles = useMultiStyleConfig('ProductListCSS', {
    variant: isCompletePlpV3Desktop ? 'completePlpV3Desktop' : isPlpV3 ? 'plpV3' : '',
  })
  const { formatMessage } = useIntl()
  const { appData } = useContext(PWAContext)
  const { isDesktop, isMobile } = useViewportType()
  const total = useAtomValue(totalProductsAtom)
  const [, setFullscreenLoading] = useAtom(setFullscreenLoadingAtom)
  const [fetchProductDataWithLoad, quickViewLoading] = useWithLoading(fetchProductDataFromClient)
  const [quickViewedProduct, setQuickViewedProduct] = useAtom(quickViewedProductAtom)
  const isShowSizeGuidePopUp = useAtomValue(isSizeGuidePopUpOpenAtom)
  const { hasTopDirectionScroll } = useVerticalScrollDirection()
  const [stickyHeight, setStickyHeight] = useState(0)
  const [subNavHeight, setSubNavHeight] = useState(0)
  const [bannerHeight, setBannerHeight] = useState(0)
  const [rvHeight, setRVHeight] = useState(0)
  const headingTextRef = useRef(null)
  const topBannerNodeRef = useRef(null)
  const topBannerNode = useCallback((node) => {
    if (node) {
      topBannerNodeRef.current = node
    }
    const height = node?.getBoundingClientRect()?.height
    height && setBannerHeight(height)
  }, [])
  const breadCrumbNode = useRef(null)
  const subNavRef = useCallback((node) => {
    const height = node?.getBoundingClientRect()?.height
    subNavigationData?.length && setSubNavHeight(height ?? 40)
  }, [])
  const rvCarouselNodeSetter = (node) => {
    if (node?.getHeight) {
      setRVHeight(node.getHeight() || 0)
    }
  }
  const addToBagButtonOnEvent = useAtomValue(addToBagButtonOnEventAtom)

  const { contentUpdated, onClick: onCmsClick } = useCmsAnalytics(topBannerNodeRef)
  const siteId = useMemo(() => get(appData, 'siteId'), [appData])
  const filters = get(pageData, 'filters', [])
  const brand = get(appData, 'brand', '')
  const categoryId = get(pageData, 'id', '')
  const menuData = useAtomValue(menuDataAtom)
  const isPlpV3desktop = isPlpV3 && isDesktop

  const setWhitelistedLastVisitedPlp = useUpdateAtom(whitelistedLastVisitedPlpAtom)

  const brandSW = isSW()
  const router = useRouter()

  useEffect(() => {
    contentUpdated()
  }, [])

  const wyngFilterUUID = get(pageData, 'wyngFilterUUID', '')
  const ugcContentSlotData = get(pageData, 'ugcContentSlotData', '')
  const pixleeAlbumID = get(pageData, 'pixleeAlbumID')

  const {
    breadcrumbs,
    name,
    topContentSlot,
    suggestionPhrase,
    preloadImageSrc,
    bottomContentSlotData = {},
  } = pageData
  const pageTitle = useAtomValue(pageTitleAtom)
  const products = useAtomValue(productsAtom)
  const seoContent = useAtomValue(seoDataAtom)
  const alternateH1Tag = get(pageData, 'alternateH1Tag', '') // from SAPI, not SFCC category data
  const wyngId = get(pageData, 'wyngId', '')
  const wyngToken = get(pageData, 'wyngToken', '')

  // TODO: this is should be a separate component
  const wyngContent =
    wyngId && wyngToken
      ? `<div class="wyng-experience" data-wyng-id="${wyngId}" data-wyng-token="${wyngToken}"></div>`
      : ''

  const { assetMarkup = '', bottomContentSlot = {} } = bottomContentSlotData
  const bottomContentHasVideo = bottomContentSlot?.content?.hasVideo || false
  const showTopBanner = !!topContentSlot?.content?.content && !loading
  const title = useMemo(() => {
    const seoFacetH1 = get(pageData, 'seoFacetMetaTags.h1tags')
    if (seoFacetH1) return seoFacetH1
    const pageTitle = alternateH1Tag
      ? getPageTitleWithFilters(alternateH1Tag, pageData?.filters?.length)
      : name && name.toLowerCase()
    return pageTitle?.replace?.('<facet-placeholder> ', '')
  }, [alternateH1Tag, name])

  useEffect(() => {
    const hasUGCContent = !isEmpty(ugcContentSlotData) || !isEmpty(wyngContent)
    const cleanupIdleUGCLazyLoad = hasUGCContent ? scheduleIdleLazyLoad(lazyUGCImporter) : () => {}

    return () => {
      cleanupIdleUGCLazyLoad()
    }
  }, [ugcContentSlotData, wyngContent])

  const isCertonaTileEnabled = get(pageData, 'isCertonaTileEnabled')

  let titledBreadcrumbs
  let breadcrumbData = breadcrumbs
  if (pageData?.filters?.length > 0) {
    titledBreadcrumbs = breadcrumbs
    titledBreadcrumbs[titledBreadcrumbs.length - 1]['htmlValue'] = title
    breadcrumbData = titledBreadcrumbs
  }

  const pageTitleModified = useMemo(
    () =>
      getPageTitleWithFilters(
        getPageTitle({ pageData, pageTitle, title, brand, formatMessage }),
        pageData?.filters?.length
      ),
    [pageData?.currentPageTitle, pageData?.filters, pageTitle, title, brand]
  )
  const plpPageTitle = usePageTitle(pageTitleModified)

  const isSubcategory = useMemo(
    () => !menuData?.topCategories?.includes(categoryId),
    [categoryId, menuData]
  )

  useCertonaOnMount({
    pagetype: isSubcategory ? 'subcategory' : 'category',
    recommendations: false,
    dependencies: [categoryId],
    categoryID: categoryId,
    enabled: !isCertonaTileEnabled,
  })

  useEffect(() => {
    if (quickViewLoading !== undefined) {
      setFullscreenLoading(quickViewLoading)
    }
  }, [quickViewLoading])

  const closeQuickView = useCallback(() => {
    setQuickViewedProduct(null)
  }, [])

  const renderCategoryHeader = useMemo(() => {
    if (Boolean(filters?.length) && !products?.length) {
      return null
    }

    return <CategoryHeader sx={styles.categoryHeader} loading={loading} />
  }, [filters?.length, products?.length, loading])

  const {
    toggleSiteFeatures: { enableSitckyFilterSortOnPLP: isStickyFilterEnabled },
    generalConfiguration: { enableNewGlobalHeader },
    adaptiveExperience: { dealRecommendations },
  } = usePreference({
    generalConfiguration: ['enableNewGlobalHeader'],
    ToggleSiteFeatures: ['enableSitckyFilterSortOnPLP'],
    adaptiveExperience: ['dealRecommendations'],
  })

  const isSubBrandActive = useAtomValue(isSubBrandActiveAtom)

  const isMessagingCarryoverEnabled =
    useExperiment(EXPERIMENTS.MESSAGING_CARRYOVER) &&
    get(dealRecommendations, isSubBrandActive ? 'subBrand' : 'brand', false)

  useEffect(() => {
    if (
      isMobile &&
      categoryId &&
      isMessagingCarryoverEnabled &&
      dealRecommendations?.categories?.includes(categoryId)
    ) {
      setWhitelistedLastVisitedPlp(categoryId)
    }
  }, [categoryId, dealRecommendations, isMessagingCarryoverEnabled, isMobile])

  const { stickyHeaderHeight, isStickyOrSlidingHeader } = useHeaderPositionPref()
  const { isHeaderHeight: headerHeight } = useHeadroomAtom()

  useEffect(() => {
    if (!isDesktop && isStickyFilterEnabled) {
      const breadCrumbPosition = breadCrumbNode?.current?.getBoundingClientRect()?.bottom
      const headerTextPosition = headingTextRef?.current?.getBoundingClientRect()?.bottom
      const breadcrumbHeight = !isPlpV3
        ? breadCrumbNode?.current?.getBoundingClientRect()?.height ?? 0
        : PLP_V3_BREADCRUMB_DEFAULT_HEIGHT
      const plpHeaderHight = enableNewGlobalHeader ? headerTextPosition - breadCrumbPosition : 0
      let totalHeight = Math.floor(
        breadcrumbHeight - bannerHeight - rvHeight - subNavHeight - plpHeaderHight - headerHeight
      )
      if (isStickyOrSlidingHeader) {
        totalHeight = totalHeight + stickyHeaderHeight
      }
      setStickyHeight(totalHeight)
    }
  }, [
    categoryId,
    headerHeight,
    stickyHeaderHeight,
    hasTopDirectionScroll,
    isStickyFilterEnabled,
    subNavHeight,
    bannerHeight,
    rvHeight,
  ])
  useMediaAssetContent()

  const subNavigationData = get(pageData, 'subNavigationData')

  return (
    <Box
      sx={styles.wrapper}
      className={isCompletePlpV3Desktop ? 'plp-v3-1' : ''}
      data-qa="plp_pageColor"
    >
      <Head>
        <title>{plpPageTitle}</title>
        {preloadImageSrc && (
          <link
            key="plp-preload-lcp-image"
            rel="preload"
            as="image"
            fetchPriority="high"
            href={preloadImageSrc}
          />
        )}
      </Head>
      <SeoPaginationLinkTags
        currentPageNum={pageData.page}
        totalPagesNum={pageData.totalPages}
        currentUrl={router.asPath}
      />
      <SeoItemLists seoProductsMetaData={pageData?.seoProductsMetaData} />
      <Hidden onDesktop sx={styles.stickyNav(stickyHeight, stickyHeight && isStickyFilterEnabled)}>
        {isSubBrandActive && <CoachtopiaLogoButton divider="horizontal" variant="plp" />}
        <MobileTopArea
          topContentSlot={topContentSlot}
          showTopBanner={showTopBanner}
          onCmsClick={onCmsClick}
          rvCarouselNodeSetter={rvCarouselNodeSetter}
          quickViewedProduct={quickViewedProduct}
          topBannerNode={topBannerNode}
        >
          <Box sx={styles.mobileBreadcrumbWrapper} ref={isPlpV3 ? breadCrumbNode : null}>
            {!isPlpV3 && (
              <Box
                sx={styles.mobileBreadcrumbContainer}
                id="breadcrumb-container"
                ref={breadCrumbNode}
              >
                <BreadCrumb sx={styles.mobileBreadcrumbText} breadcrumbData={breadcrumbData} />
              </Box>
            )}
            <Text
              hidden={brandSW && showTopBanner}
              ref={headingTextRef}
              sx={styles.mobilePlpHeading}
              as="h1"
              data-qa="d_plp_txt_hdng"
            >
              {title}
            </Text>
            {isPlpV3 && <TotalCount variant="plpV3" totalCount={total} />}
          </Box>
        </MobileTopArea>
        {subNavigationData && !loading && (
          <Box ref={subNavRef} sx={styles.dynamicSubNavStyles}>
            <DynamicSubNavigation
              categories={subNavigationData}
              variant={isPlpV3 ? 'plpV3' : undefined}
              location={isPlpV3 ? 'plp' : undefined}
              dataQa="SubNav_on_PLP"
            />
          </Box>
        )}
        {renderCategoryHeader}
      </Hidden>
      <MainContainer
        sx={{
          ...styles.mainContainerWrapper,
          ...styles.searchResultCSS,
        }}
        fullWidth={isCompletePlpV3Desktop}
      >
        <Hidden onNonDesktop w="100%">
          <>
            {!isPlpV3 && (
              <Box sx={styles.breadCrumbWrapper}>
                <BreadCrumb breadcrumbData={breadcrumbData} />
              </Box>
            )}
            {showTopBanner && isCompletePlpV3Desktop && (
              <Box ref={isDesktop ? topBannerNode : null}>
                <CustomSlot
                  content={topContentSlot}
                  Component={CategoryTopContentSlot}
                  ignoreHidden={true}
                  quickViewOpened={!!quickViewedProduct}
                />
              </Box>
            )}
            <Box sx={styles.plpHeadingWrapper} className={isCompletePlpV3Desktop ? 'plp-v3-1' : ''}>
              <Text
                hidden={brandSW && showTopBanner}
                className={isCompletePlpV3Desktop ? 'plp-v3-1' : ''}
                sx={styles.plpHeading(isDesktop)}
                as="h1"
                minWidth={0}
                data-qa="d_plp_txt_hdng"
              >
                {title}
              </Text>
              {isPlpV3 && (
                <TotalCount variant="plpV3" sx={styles.totalProductsCount} totalCount={total} />
              )}
            </Box>
            {showTopBanner && !isCompletePlpV3Desktop && (
              <Box ref={isDesktop ? topBannerNode : null}>
                <CustomSlot
                  content={topContentSlot}
                  Component={CategoryTopContentSlot}
                  ignoreHidden={true}
                  quickViewOpened={!!quickViewedProduct}
                />
              </Box>
            )}
          </>
        </Hidden>
        {Boolean(filters?.length) && !products?.length ? (
          <ZeroProductsPage />
        ) : total === 0 && !products?.length && !isEmpty(pageData) ? (
          <Box width="100%">
            <SearchResultsText
              pageData={pageData}
              loading={loading}
              suggestionPhrase={suggestionPhrase}
            />
          </Box>
        ) : (
          <ProductsResults
            products={products}
            fetchProductDataWithLoad={fetchProductDataWithLoad}
            setQuickViewedProduct={setQuickViewedProduct}
            pageData={pageData}
            loading={loading}
            styles={styles}
          />
        )}
        <BackToTopButton />
        {Boolean(filters?.length) && !products?.length && (
          <Hidden onDesktop width="100%">
            <Lazy style={{ width: '100%' }}>
              <SearchWidget width="100%" variant="footer" siteId={siteId} />
            </Lazy>
          </Hidden>
        )}
      </MainContainer>
      {isPlpV3 && (
        <Box sx={styles.mobileBottomBreadcrumbWrapper}>
          <Box sx={styles.mobileBreadcrumbContainer} id="breadcrumb-container">
            <BreadCrumb
              sx={styles.mobileBreadcrumbText}
              breadcrumbData={breadcrumbData}
              variant={isPlpV3 && 'plpV3'}
            />
          </Box>
        </Box>
      )}
      {quickViewedProduct && (
        <QuickViewModal onClose={closeQuickView} isShowSizeGuidePopUp={isShowSizeGuidePopUp}>
          <QuickViewContent productData={quickViewedProduct} />
        </QuickViewModal>
      )}
      <NotifyMePopUp />
      {Boolean(products?.length) && (
        <>
          {isPlpV3desktop && !isEmpty(seoContent) && (
            <MainContainer w="100%" fullWidth={isCompletePlpV3Desktop}>
              <Center w="100%">
                <ContentSlot content={seoContent} Component={SEOMarkup} variant="plpV3" />
              </Center>
            </MainContainer>
          )}
          {bottomContentSlot?.content?.content && (
            <CategoryBottomContentSlot
              content={bottomContentSlot?.content?.content}
              styles={styles}
              hasVideo={bottomContentHasVideo}
            />
          )}
          {assetMarkup && (
            <Lazy>
              <MainContainer w="100%" fullWidth={isCompletePlpV3Desktop}>
                <HtmlContent content={assetMarkup} w="100%" />
              </MainContainer>
            </Lazy>
          )}
          {(!isEmpty(ugcContentSlotData) || !isEmpty(wyngContent)) && (
            <UGCContainer
              pageType="plp"
              content={ugcContentSlotData || wyngContent}
              categoryWyngFilterUUID={wyngFilterUUID}
              pixleeAlbumID={pixleeAlbumID}
            />
          )}
          <PurchaseMissionSurvey />
          {!isPlpV3desktop && !isEmpty(seoContent) && (
            <MainContainer w="100%">
              <Center w="100%">
                <ContentSlot content={seoContent} Component={SEOMarkup} />
              </Center>
            </MainContainer>
          )}
        </>
      )}
      {addToBagButtonOnEvent}
    </Box>
  )
}

export default ProductListingPage
