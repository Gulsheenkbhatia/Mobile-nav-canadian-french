import React, { useContext, useEffect, useMemo, useState } from 'react'
import get from 'lodash/get'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { useAtomValue } from 'jotai/utils'

import StaticSeoSchema from 'toro/components/AppMetaTags/StaticSeoSchema'
import BreadcrumbsSchema from 'toro/components/AppMetaTags/Breadcrumbs'
import ProductSchema from 'toro/components/AppMetaTags/ProductSchema'
import OrganizationSchema from 'toro/components/AppMetaTags/OrganizationSchema'
import WebPageSchema from 'toro/components/AppMetaTags/WebPageSchema'
import { HomeImageObjectSchema } from 'toro/components/AppMetaTags/HomePageMediaSchema'
import SiteNavigationElementSchema from 'toro/components/AppMetaTags/SiteNavigationElementSchema'
import HrefLangs from 'toro/components/HrefLangs'

import { isJapan } from 'toro/helpers/localization'
import { isEncodedURL } from 'toro/helpers/url'
import {
  getRobotTag,
  getCanonicalUrl,
  getPageTitleWithFilters,
  getPageDescriptionWithFilters,
} from 'toro/helpers/metaTags'
import usePreference from 'toro/hooks/usePreference_new'

import PWAContext from 'components/common/PWAContext'
import menuDataAtom from 'store/menu-data.atom'
import { isOutletHPAtom, isSubHPAtom } from 'store/navigation.atom'

import { PAGE_TYPES } from 'toro/constants/seo'

function safeParseJson(value, fallback = []) {
  try {
    if (!value) return fallback
    return JSON.parse(value)
  } catch {
    return fallback
  }
}

const AppMetaTags = ({ lazyProps }) => {
  const { appData } = useContext(PWAContext)
  const menuData = useAtomValue(menuDataAtom)
  const [pageData, setPageData] = useState(lazyProps?.pageData)
  const title = get(pageData, 'pageTitle', '')
  const currentPageTitle = get(pageData, 'currentPageTitle', '')
  const description = get(pageData, 'pageDescription', '')
  const router = useRouter()
  const backendDomain = get(appData, 'backendDomain')
  const brand = get(appData, 'brand')
  const keywords = get(pageData, 'pageKeywords', '')
  const pdpDescription = get(pageData, 'custom.c_editorsNoteDescription')
  const googleSiteVerification = get(appData, 'googleSiteVerification')
  const alternateH1Tag = get(pageData, 'alternateH1Tag', '')
  const pageType = get(pageData, 'pageType', '')
  const isFeatured = get(pageData, 'isFeatured')
  const filters = get(pageData, 'filters', [])
  const category = get(pageData, 'name')
  const seoFacetMetaTags = get(pageData, 'seoFacetMetaTags', {})
  const siteId = get(appData, 'siteId')
  const isOutletHP = useAtomValue(isOutletHPAtom)
  const isSubHP = useAtomValue(isSubHPAtom)
  const isSubBrandHomePage = isOutletHP || isSubHP
  const localeInPath = get(appData, 'localeInPath', '')
  const localePath = localeInPath ? `/${localeInPath}` : ''
  const { formatMessage } = useIntl()
  const searchTerm = get(pageData, 'searchTerm', '')
  const defaultDescription = formatMessage(
    {
      id: 'header.metaDefaultDescription',
      defaultMessage:
        'Shop the curated collection of {category} from {brand} - where fashion meets function. Complimentary shipping & returns.',
    },
    { category, brand }
  )
  const searchResultsMetaDescription = formatMessage(
    {
      id: isFeatured ? 'search.metaFeaturedDescription' : 'search.metaSearchDescription',
      defaultMessage: defaultDescription,
    },
    { searchKeyword: searchTerm }
  )

  const {
    seoSitePreferences: {
      minProductsForIndex = 5,
      nonIndexableURLParameters = [],
      indexableFeaturedQueries = [],
      enableSEONavigation = false,
    },
  } = usePreference({
    SEOSitePreferences: [
      'minProductsForIndex',
      'nonIndexableURLParameters',
      'indexableFeaturedQueries',
      'enableSEONavigation',
    ],
  })

  const { HOME_PAGE, PLP, CLP, SEARCH, PDP } = PAGE_TYPES

  useEffect(() => {
    const handleLazyPromise = async () => {
      const state = await lazyProps.lazy
      setPageData(state.pageData)
    }
    if (lazyProps.pageData) {
      setPageData(lazyProps.pageData)
    } else if (lazyProps.lazy) {
      handleLazyPromise()
    }
  }, [lazyProps])

  const robots = useMemo(
    () =>
      getRobotTag({
        pageData,
        router,
        minProductsForIndex,
        nonIndexableURLParameters,
        indexableFeaturedQueries,
        searchTerm,
      }),
    [pageData, router, minProductsForIndex, nonIndexableURLParameters, searchTerm]
  )

  const metaDescription = useMemo(() => {
    let result = description
    const descriptionFacet = getPageDescriptionWithFilters(pageData?.filters)
    switch (pageType) {
      default:
      case PLP:
        if (seoFacetMetaTags?.metaDescription) {
          result = seoFacetMetaTags.metaDescription
        } else if (description?.includes('<facet-placeholder> ')) {
          result = description.replace('<facet-placeholder> ', descriptionFacet)
        } else {
          result = descriptionFacet + description
        }
        break
      case PDP:
        result = description || pdpDescription
        break
      case SEARCH:
        result = isFeatured
          ? seoFacetMetaTags?.metaDescription || searchResultsMetaDescription
          : description || searchResultsMetaDescription
        break
    }
    return isJapan(siteId)
      ? result || defaultDescription
      : (result || defaultDescription)
          .replace(/&amp/g, '&')
          .replace(/[^a-zA-Z0-9 $&,.!'/äöüÄÖÜß"]/g, '')
  }, [pageData])

  const arr = []
  filters.forEach((item) => {
    arr.push(item.id)
  })

  const pageTitle = useMemo(() => {
    if (seoFacetMetaTags?.metaTitle) return seoFacetMetaTags?.metaTitle
    if (currentPageTitle)
      return getPageTitleWithFilters(currentPageTitle, pageData?.filters?.length)
    switch (pageType) {
      case PLP: {
        if (pageData?.filters?.length > 2 || pageData?.filters?.length === 0) {
          return title?.replace('<facet-placeholder> ', '')
        }
        return title || alternateH1Tag
      }
      default: {
        return title
      }
    }
  }, [pageType, pageData?.filters])

  const showBreadCrumbSchema = useMemo(
    () => [HOME_PAGE, PLP, PDP].includes(pageType) || isSubBrandHomePage,
    [pageType, isSubBrandHomePage]
  )
  const showAiSeoSchema = useMemo(() => [HOME_PAGE, PLP, CLP, PDP].includes(pageType), [pageType])
  const showHomePageMediaSchema = useMemo(
    () => pageType === HOME_PAGE || isSubBrandHomePage,
    [pageType, isSubBrandHomePage]
  )

  const canonicalUrl = useMemo(
    () => getCanonicalUrl({ pageData, router, backendDomain, localePath }),
    [pageData, router, backendDomain, localePath]
  )
  const encodedCanonicalValue = isEncodedURL(canonicalUrl) ? canonicalUrl : encodeURI(canonicalUrl)
  const metaTitlePrefix = searchTerm ? `${searchTerm} | ` : ''

  const organizationSchemaContent = get(
    appData,
    'schema.contentSlots.organization_schema_asset.content.json' // TODO add functionality for other languages
  )

  const schemaArray = safeParseJson(organizationSchemaContent, [])

  let socialImageUrl = schemaArray?.[0]?.logo

  if (pageType === PDP) {
    const preloadSrc = get(pageData, 'preloadSrc')
    if (preloadSrc) socialImageUrl = preloadSrc
  } else if (pageType === PLP && pageData?.seoProductsMetaData) {
    const parsed = safeParseJson(pageData.seoProductsMetaData, {})
    if (parsed?.image) socialImageUrl = parsed.image
  }
  const canonicalUrlDecoded = decodeURI(encodedCanonicalValue)

  return (
    <>
      <Head>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={keywords} />
        <meta name="title" content={`${metaTitlePrefix}${pageTitle}`} />
        <meta name="robots" content={robots} />
        <link rel="canonical" href={canonicalUrlDecoded} />

        {/* Open Graph Meta Tags*/}
        <meta property="og:title" content={`${metaTitlePrefix}${pageTitle}`} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={socialImageUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrlDecoded} />

        {/* Twitter / X Meta Tags*/}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${metaTitlePrefix}${pageTitle}`} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={socialImageUrl} />
        <meta name="twitter:url" content={canonicalUrlDecoded} />
      </Head>

      {showAiSeoSchema && <StaticSeoSchema content={pageData?.aiSeoSchema} pageType={pageType} />}

      {organizationSchemaContent && (
        <OrganizationSchema
          content={organizationSchemaContent}
          pageType={pageType}
          isSubBrandHomePage={isSubBrandHomePage}
        />
      )}

      {pageType === HOME_PAGE && googleSiteVerification && (
        <Head>
          <meta name="google-site-verification" content={googleSiteVerification} />
        </Head>
      )}

      {showBreadCrumbSchema && (
        <BreadcrumbsSchema
          pageData={pageData}
          canonical={encodedCanonicalValue}
          isSubBrandHomePage={isSubBrandHomePage}
        />
      )}

      <WebPageSchema pageData={pageData} appData={appData} />

      {showHomePageMediaSchema && <HomeImageObjectSchema pageData={pageData} appData={appData} />}

      {pageType === PDP && <ProductSchema pageData={pageData} />}

      <HrefLangs pageData={pageData} />

      {enableSEONavigation && menuData?.topCategories && (
        <SiteNavigationElementSchema menuData={menuData} backendDomain={backendDomain} />
      )}
    </>
  )
}

export default AppMetaTags
