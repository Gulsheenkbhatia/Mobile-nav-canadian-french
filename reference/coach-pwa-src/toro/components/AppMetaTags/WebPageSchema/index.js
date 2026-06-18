import get from 'lodash/get'

import { getPageTitleWithFilters } from 'toro/helpers/metaTags'

import { PAGE_TYPES, SCHEMA_TYPES, SCHEMA_URLS } from 'toro/constants/seo'

const WebPageSchema = ({ pageData, appData }) => {
  const { WEBPAGE, WEBSITE, SEARCH_ACTION } = SCHEMA_TYPES
  const { PLP, PDP } = PAGE_TYPES

  const pageType = get(pageData, 'pageType')
  const brand = get(appData, 'brand', '')
  const baseDomain = get(appData, 'backendDomain', '')

  const brandName =
    typeof brand === 'string' && brand.trim()
      ? brand
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
      : ''

  let json = {
    '@context': SCHEMA_URLS.BASE_URL,
    '@type': WEBPAGE,

    isPartOf: {
      '@type': WEBSITE,
      name: brandName,
      url: `https://${baseDomain}`,
    },

    potentialAction: {
      '@type': SEARCH_ACTION,
      target: `https://${baseDomain}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }

  if (pageType === PLP) {
    const seoFacetH1 = get(pageData, 'seoFacetMetaTags.h1tags')
    const alternateH1Tag = get(pageData, 'alternateH1Tag', '')

    const pageTitle = alternateH1Tag
      ? getPageTitleWithFilters(alternateH1Tag, pageData?.filters?.length)
      : pageData?.name && pageData?.name.toLowerCase()

    const name = (seoFacetH1 ? seoFacetH1 : pageTitle?.replace?.('<facet-placeholder> ', '')) || ''

    json = {
      ...json,
      name,
      url: get(pageData, 'canonicalUrl'),
      description: get(pageData, 'currentPageDescription') || get(pageData, 'pageDescription'),
    }
  }

  if (pageType === PDP) {
    json = {
      ...json,
      url: get(pageData, 'canonicals.default'),
      description: get(pageData, 'longDescription'),
    }
  }

  return (
    <script
      type="application/ld+json"
      data-key="WebPage"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    ></script>
  )
}

export default WebPageSchema
