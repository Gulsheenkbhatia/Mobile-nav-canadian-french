import { memo, useMemo } from 'react'
import { useRouter } from 'next/router'
import { useAtomValue } from 'jotai/utils'

import type { ProductItem } from 'toro/types'
import { currentLocaleAtom } from 'store/global.atom'
import getCurrentLocale from 'toro/helpers/getCurrentLocale'
import isBrowser from 'toro/helpers/isBrowser'

import { buildHomeFeaturedProductsJsonLd } from 'toro/components/RecommendationsContainer/buildHomeFeaturedProductsJsonLd'

type HomeFeaturedProductsJsonLdProps = {
  items: ProductItem[]
  sectionLabel: string
}

const HomeFeaturedProductsJsonLd = ({ items, sectionLabel }: HomeFeaturedProductsJsonLdProps) => {
  const router = useRouter()
  const localeKey = useAtomValue(currentLocaleAtom)
  const { currency: priceCurrency } = getCurrentLocale((localeKey || '').replace(/_/g, '-'))

  const jsonLd = useMemo(() => {
    if (!isBrowser() || !items.length) {
      return null
    }

    const listTitle = sectionLabel?.trim() || 'Featured products'

    let pageUrl: string
    try {
      const path =
        router.isReady && router.asPath
          ? router.asPath.split('#')[0]
          : (window.location.href || '').split('#')[0]
      pageUrl = new URL(path || '/', window.location.origin).href
    } catch {
      pageUrl = (window.location.href || '').split('#')[0]
    }

    return buildHomeFeaturedProductsJsonLd({
      pageUrl,
      collectionPageName: listTitle,
      itemListName: listTitle,
      items,
      priceCurrency: priceCurrency || 'USD',
    })
  }, [items, priceCurrency, router.asPath, router.isReady, sectionLabel])

  if (!jsonLd) {
    return null
  }

  return (
    <script
      id="jsonld-home-featured-products"
      type="application/ld+json"
      data-key="HomeFeaturedProducts-CollectionPage"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export default memo(HomeFeaturedProductsJsonLd)
