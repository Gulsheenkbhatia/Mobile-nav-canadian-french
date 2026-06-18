import { useEffect, useRef } from 'react'
import get from 'lodash/get'
import Box from 'toro/components/Box'
import HtmlContent from 'toro/components/HtmlContent'
import Center from 'toro/components/Center'
import Head from 'next/head'
import BreadCrumb from 'toro/components/BreadcrumbPage'
import SEOMarkup from 'toro/components/list/SEOMarkup'
import ContentSlot from 'toro/cms/components/ContentSlot'
import CategoryTopContentSlot from 'toro/components/list/CategoryTopContentSlot'
import CustomSlot from 'toro/cms/components/CustomSlot'
import CatContent from 'toro/components/list/CatContent'
import ClpBody from 'toro/components/list/ClpBody'
import GiftCLPContent from 'toro/components/list/GiftClpContent'
import UGCContainer from 'toro/components/UGC/UGCContainer'
import { useCertonaOnMount } from 'toro/hooks/useCertonaRequest'
import useCmsAnalytics from 'toro/analytics/useCmsAnalytics'
import BackToTopButton from '../BackToTopButton'
import RVRecommendationsCarouselContainer from 'toro/components/RecentlyViewedCarousel/RVRecommendationsCarouselContainer'
import usePageTitle from 'toro/hooks/usePageTitle'
import dynamic from 'next/dynamic'
import { useAtomValue } from 'jotai/utils'
import useViewportType from 'toro/hooks/useViewportType'
import withFeatureFlag from 'toro/hocs/withFeatureFlag'
import { subBrandCategoriesAtom } from 'store/menu-data.atom'
import { isOutletHPAtom, isSubHPAtom } from 'store/navigation.atom'

const DynamicSubNavigation = withFeatureFlag(
  dynamic(() => import('toro/components/DynamicSubNavigation')),
  { ToggleSiteFeatures: ['enableDynamicSubNavOnHP'] }
)

const CLP_TYPE_COMPONENT = {
  'clp-body': ClpBody,
  'cat-landing': CatContent,
  'gift-slots': GiftCLPContent,
}

function CategoryLandingPage({ pageData }) {
  useCertonaOnMount({ pagetype: 'category', recommendations: false })
  const {
    topContentSlot,
    contentSlots,
    pageTitle,
    name,
    breadcrumbs,
    clpType,
    preloadImageSrc,
    bottomContentSlotData = {},
  } = pageData || {}
  const wyngFilterUUID = get(pageData, 'wyngFilterUUID', '')
  const pixleeAlbumID = get(pageData, 'pixleeAlbumID', '')
  const title = pageTitle || (name && name.toLowerCase())
  const clpPageTitle = usePageTitle(title)
  const isComparablePriceEnabledCategory = get(pageData, 'isComparablePriceEnabledCategory', false)

  const { isMobile } = useViewportType()
  const subBrandNavigationData = useAtomValue(subBrandCategoriesAtom)

  const rootNode = useRef(null)
  const { contentUpdated, onClick } = useCmsAnalytics(rootNode)

  const isOutletHP = useAtomValue(isOutletHPAtom)
  const isSubHP = useAtomValue(isSubHPAtom)
  const isHomePage = isOutletHP || isSubHP

  const seoContent = get(pageData, 'seoContent')
  const { assetMarkup = '' } = bottomContentSlotData
  const ugcMarkup = get(pageData, 'ugcContentSlotData')

  const wyngId = get(pageData, 'wyngId', '')
  const wyngToken = get(pageData, 'wyngToken', '')

  const wyngContent =
    wyngId && wyngToken
      ? `<div class="wyng-experience" data-wyng-id="${wyngId}" data-wyng-token="${wyngToken}"></div>`
      : ''

  useEffect(() => {
    contentUpdated()
  }, [])

  return (
    <>
      <Head>
        <title>{clpPageTitle}</title>
        {preloadImageSrc && (
          <link rel="preload" as="image" fetchPriority="high" href={preloadImageSrc} />
        )}
      </Head>
      {isHomePage && isMobile && !!subBrandNavigationData?.length && (
        <DynamicSubNavigation
          categories={subBrandNavigationData}
          variant="homeT2"
          location="home2"
          applyDynamicStyles
        />
      )}
      <Box className="mw-clp">
        {isHomePage && <RVRecommendationsCarouselContainer currentPage="HP" />}
        {!isHomePage && !!breadcrumbs && (
          <Box id="breadcrumb-container" px="m" pt="m">
            <Box overflowX="auto" w="100%" mb="m">
              <BreadCrumb breadcrumbData={breadcrumbs} />
            </Box>
          </Box>
        )}
        {!!topContentSlot?.content?.content && (
          <CustomSlot
            content={topContentSlot}
            Component={CategoryTopContentSlot}
            ignoreHidden={true}
          />
        )}
        {clpType && (
          <Box w="100%" ref={rootNode} onClick={onClick}>
            <CustomSlot
              content={get(contentSlots, `${[clpType]}`)}
              Component={CLP_TYPE_COMPONENT[clpType]}
              onClickCmsAnalytics={onClick}
              isComparablePriceEnabledCategory={isComparablePriceEnabledCategory}
            />
          </Box>
        )}
        <Box>
          <HtmlContent content={assetMarkup} />
        </Box>
        <UGCContainer
          pageType={isHomePage ? 'home' : 'plp'}
          content={ugcMarkup || wyngContent}
          categoryWyngFilterUUID={wyngFilterUUID}
          pixleeAlbumID={pixleeAlbumID}
        />
        <Box w="100%">
          <Center>
            <ContentSlot content={seoContent} Component={SEOMarkup} />
          </Center>
        </Box>
      </Box>
      <BackToTopButton />
    </>
  )
}

export default CategoryLandingPage
