import { useRef, useEffect, useContext, useState, useMemo } from 'react'
import Script from 'next/script'
import {
  sendViewProduct,
  trackPage,
  sendViewSearch,
  sendViewCategory,
} from 'toro/analytics/sfccAnalyticsHelpers'
import PWAContext from 'components/common/PWAContext'
import getCurrentLocale from 'toro/helpers/getCurrentLocale'
import usePageType from 'toro/hooks/usePageType'
import { useAtomValue } from 'jotai/utils'
import { productsAtom, searchResultsUrlAtom } from 'store/search-results.atom'
import usePreferenceNew from 'toro/hooks/usePreference_new'
import { ListingProduct } from 'toro/types/productTypes'
import isObject from 'lodash/isObject'
import isFunction from 'lodash/isFunction'
import get from 'lodash/get'

interface PageData {
  id: string
  category_id: string
  pageType: string
}

interface LazyProps {
  pageData?: PageData
  lazy?: Promise<{ pageData: PageData }>
}

interface SFCCAnalyticsScriptProps {
  lazyProps: LazyProps
}

const isPromise = (value: any): value is Promise<any> =>
  isObject(value) && isFunction((value as any)?.then)

const handleScriptError = (src: string, error: Event) => {
  console.error(`SFCC Analytics script failed to load: ${src}`, error)
}

const SFCCAnalyticsScript = ({ lazyProps }: SFCCAnalyticsScriptProps) => {
  const [pageData, setPageData] = useState<PageData>({
    id: get(lazyProps, 'pageData.id', ''),
    category_id: get(lazyProps, 'pageData.category_id', ''),
    pageType: get(lazyProps, 'pageData.pageType', ''),
  })
  const [headScriptLoaded, setHeadScriptLoaded] = useState<boolean>(false)

  const scriptsLoadedCount = useRef<number>(0)
  const scriptsLoaded = useRef<boolean>(false)
  const prevProductsLength = useRef<number>(0)

  const { appData } = useContext(PWAContext)
  const { siteId, locale, backendDomain } = appData
  const { locale: currentLocale, currency } = getCurrentLocale(locale)
  const { isPDP, isPLP, isSRP, isHP } = usePageType()
  const { id, category_id, pageType } = pageData

  const products = useAtomValue(productsAtom)
  const { url } = useAtomValue(searchResultsUrlAtom)

  const {
    sfccAnalytics: { sfccAnalyticsScripts = [] },
  } = usePreferenceNew({ SFCCAnalytics: ['sfccAnalyticsScripts'] })

  const triggerSFCCAnalytics = () => {
    trackPage(siteId, currentLocale, currency, backendDomain, isHP)
    if (isPDP && category_id && id) {
      sendViewProduct(category_id, id)
    }
  }

  const triggerPLPSRPAnalytics = (products: ListingProduct[]) => {
    if (!url || !products.length) return
    let queryParams: Record<string, string> = {}

    try {
      const params = new URLSearchParams(url?.split('?')?.[1])
      queryParams = Object.fromEntries(params.entries())
    } catch (e) {
      console.error('Failed to parse query params', e)
    }

    const currentProducts = products.slice(prevProductsLength.current)
    if (isPLP && id) {
      sendViewCategory(queryParams, id, { hits: currentProducts })
    } else if (isSRP) {
      sendViewSearch(queryParams, { hits: currentProducts })
    }
    prevProductsLength.current = products.length
  }

  const handleScriptLoad = () => {
    scriptsLoadedCount.current++
    if (scriptsLoadedCount.current === sfccAnalyticsScripts.length) {
      scriptsLoaded.current = true
      triggerSFCCAnalytics()
      triggerPLPSRPAnalytics(products)
    }
  }

  useEffect(() => {
    if (scriptsLoaded.current) {
      triggerSFCCAnalytics()
      prevProductsLength.current = 0
    }
  }, [pageType, id])

  useEffect(() => {
    if (scriptsLoaded.current) {
      triggerPLPSRPAnalytics(products)
    }
  }, [products])

  useEffect(() => {
    const updatePageData = async () => {
      const state = await lazyProps.lazy
      const { id, category_id, pageType } = state.pageData
      setPageData({ id, category_id, pageType })
    }

    if (lazyProps.pageData) {
      const { id, category_id, pageType } = lazyProps.pageData
      setPageData({ id, category_id, pageType })
    } else if (isPromise(lazyProps.lazy)) {
      updatePageData()
    }
  }, [lazyProps])

  const scriptsSrc = useMemo(() => {
    return sfccAnalyticsScripts.map((script: string) => {
      return `https://${backendDomain}/on/demandware.static/Sites-${siteId}-Site/-/${currentLocale}/internal/jscript/${script}.js`
    })
  }, [sfccAnalyticsScripts, backendDomain, siteId, currentLocale])

  if (!scriptsSrc.length) return null

  return (
    <>
      <Script
        src="/scripts/head-active-data.js"
        strategy="afterInteractive"
        onLoad={() => setHeadScriptLoaded(true)}
        onError={(error) => {
          handleScriptError('head-active-data.js', error)
        }}
      />
      {headScriptLoaded &&
        scriptsSrc.map((scriptSrc: string) => (
          <Script
            key={scriptSrc}
            src={scriptSrc}
            strategy="afterInteractive"
            onLoad={handleScriptLoad}
            onError={(error) => {
              handleScriptError(scriptSrc, error)
            }}
          />
        ))}
    </>
  )
}

export default SFCCAnalyticsScript
