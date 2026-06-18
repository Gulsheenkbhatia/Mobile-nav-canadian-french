import PWAContext from 'components/common/PWAContext'
import { mapBreadcrumbDataToBreadcrumbs } from 'helpers/getBreadcrumbData'
import { useAtomValue } from 'jotai/utils'
import get from 'lodash/get'
import startsWith from 'lodash/startsWith'
import { useContext } from 'react'
import { categoryUrlsAtom } from 'store/menu-data.atom'

import { SCHEMA_TYPES, PAGE_TYPES, SCHEMA_URLS } from 'toro/constants/seo'

const { LIST_ITEM, BREADCRUMB } = SCHEMA_TYPES
const { HOME_PAGE } = PAGE_TYPES
const { BASE_URL } = SCHEMA_URLS

export default function BreadcrumbsSchema({ pageData, canonical, isSubBrandHomePage }) {
  const { appData } = useContext(PWAContext)
  const pageType = get(pageData, 'pageType', '')
  const categoryUrls = useAtomValue(categoryUrlsAtom)
  const backendDomain = 'https://' + get(appData, 'backendDomain')
  const breadcrumbs = get(pageData, 'breadcrumbs', [])

  const getBreadcrumbLink = (breadcrumb, index) => {
    const productUrl = get(pageData, 'defaultColor.url')
    const bcUrl = get(breadcrumb, 'url', pageType === 'PDP' ? productUrl : canonical)
    const anchorLink = get(categoryUrls[breadcrumb?.categoryID], 'url', bcUrl)
    const linkRegex = new RegExp(/.*\/shop(\/[a-zA-Z0-9_ -]+){1,4}$/g)

    if (anchorLink?.match?.(linkRegex)) {
      try {
        const domain = new URL(anchorLink)
        return anchorLink?.split(domain?.origin)[1]
      } catch {
        return anchorLink
      }
    } else {
      const lastLeafUrlRequired = breadcrumbs?.length - 1 === index
      const productUrl = lastLeafUrlRequired ? get(pageData, 'url') : ''
      const breadcrumbData = mapBreadcrumbDataToBreadcrumbs(
        categoryUrls,
        [breadcrumb],
        lastLeafUrlRequired,
        productUrl
      )
      return breadcrumbData[0]?.url
    }
  }

  if (pageType === HOME_PAGE || isSubBrandHomePage) {
    const json = {
      '@context': BASE_URL,
      '@type': BREADCRUMB,
      itemListElement: [{ '@type': LIST_ITEM, position: 1, name: 'Home', item: canonical }],
    }

    return (
      <script
        type="application/ld+json"
        data-key="BreadcrumbList"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
      ></script>
    )
  }

  const json = {
    '@context': BASE_URL,
    '@type': BREADCRUMB,
    itemListElement: breadcrumbs
      .map((breadcrumb, index) => {
        let breadcrumbLink = getBreadcrumbLink(breadcrumb, index)

        if (!startsWith(breadcrumbLink, 'http')) {
          breadcrumbLink = backendDomain + breadcrumbLink
        }

        return {
          '@type': LIST_ITEM,
          position: (index + 1).toString(),
          name: get(breadcrumb, 'htmlValue') || get(breadcrumb, 'name'),
          item: breadcrumbLink && decodeURI(breadcrumbLink),
        }
      })
      .filter((breadcrumb) => breadcrumb.item !== null),
  }

  return (
    <script
      type="application/ld+json"
      data-key="BreadcrumbList"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    ></script>
  )
}
