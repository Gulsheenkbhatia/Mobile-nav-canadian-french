import { useContext, useEffect, useRef } from 'react'
import useLazyState from 'hooks/useLazyState'
import replaceState from 'helpers/replaceState'
import get from 'lodash/get'
import abortableFetch from 'helpers/abortableFetch'
import useAnalytics from 'toro/analytics/useAnalytics'
import { useAtomValue, useResetAtom, useUpdateAtom } from 'jotai/utils'
import PWAContext from 'components/common/PWAContext'
import { useAtomSetter } from 'toro/helpers/jotai/useAtomSetter'
import {
  busyFilterIdAtom,
  productsAtom,
  searchResultPageAtom,
  searchResultsReloadingAtom,
  setProductsAtom,
  setSearchResultPageAtom,
  setSearchResultsReloadingAtom,
  totalPagesAtom,
  populatePageDataAtom,
  resetPageDataAtom,
  updatePageDataAtom,
  searchResultsUrlAtom,
  setAdjacentPageUrlsAtom,
  setInitialRouteParamsAtom,
  setThinkPLPAtom,
} from 'store/search-results.atom'
import { useRouter } from 'next/router'
import useToroEventsDispatch from 'toro/hooks/useToroEventDispatch'
import { trackIsolatedXgenSearchEventAtom } from 'store/xgen-tracking.atom'
import { xgenFeaturesAtom } from 'store/xgen-features.atom'
import { usePlpRecommendations } from 'toro/hooks/useRecommendationsPlp'

const isValidPageData = (pageData) => {
  const filtersLength = get(pageData, 'filters.length', 0)
  const productsLength = get(pageData, 'products.length', 0)
  if (filtersLength && !productsLength) {
    return true
  }
  return productsLength > 0
}

export default function useSearchResultsStore(props, overrideProps = {}) {
  const { appData } = useContext(PWAContext)
  const fetchAndStoreRecommendations = usePlpRecommendations()
  const populatePageData = useAtomSetter(populatePageDataAtom)
  const setAdjacentPageUrls = useAtomSetter(setAdjacentPageUrlsAtom)
  const setInitialRouteParams = useAtomSetter(setInitialRouteParamsAtom)
  const setThinkPLP = useAtomSetter(setThinkPLPAtom)
  const trackXgenSearchEvent = useUpdateAtom(trackIsolatedXgenSearchEventAtom)
  const { events, query, asPath, locale: currentLocale, defaultLocale } = useRouter()
  const [state, updateState] = useLazyState(props, {}, (props) => {
    const locale = currentLocale === defaultLocale ? '' : currentLocale
    const pageType = get(props, 'pageData.pageType', '')
    const isThinkPage = get(props, 'pageData.isThinkPage', false)
    setThinkPLP({
      isThinkPage: isThinkPage,
      PLPTabColor: get(props, 'pageData.PLPTabColor', null),
      enableTransparentHeader: get(props, 'pageData.enableTransparentHeader', false),
    })
    setInitialRouteParams({ query, asPath, locale })
    populatePageData(props)
    setAdjacentPageUrls(props?.pageData)
    trackXgenSearchEvent({ query: query.q, page: 0, pageType })
    fetchAndStoreRecommendations(props?.pageData.id)
  })
  const abortController = useRef(null)
  const loading = get(state, 'loading')
  const analytics = useAnalytics()
  const { url, urlToFetch } = useAtomValue(searchResultsUrlAtom)
  const page = useAtomValue(searchResultPageAtom)
  const reloading = useAtomValue(searchResultsReloadingAtom)
  const totalPages = useAtomValue(totalPagesAtom)
  const products = useAtomValue(productsAtom)
  const setProducts = useAtomSetter(setProductsAtom)
  const setPage = useAtomSetter(setSearchResultPageAtom)
  const setReloading = useAtomSetter(setSearchResultsReloadingAtom)
  const resetBusyFilterId = useResetAtom(busyFilterIdAtom)
  const updatePageDataAtoms = useAtomSetter(updatePageDataAtom)
  const resetPageData = useAtomSetter(resetPageDataAtom)
  const { search: isXgenSearch } = useAtomValue(xgenFeaturesAtom)
  const dispatchToroEvent = useToroEventsDispatch()

  useEffect(() => {
    const handleRouteChange = (url) => {
      abortController.current?.abort()
      resetBusyFilterId()
      setReloading(false)

      /*
       * Since the data for XGEN is fetched from the client-side, it doesn't follow the usual
       * PLP/SRP data flow where the `page` and page data are coming from the API and are used to
       * populate the atoms in the callback of `useLazyState()`. Consequently, when navigating from
       * PLP to XGEN SRP, the `page` value lags behind and `useXgenSearchResults()` sees the PLP
       * value of `page` for the first few renders and the initial request to XGEN. Therefore,
       * specifically for and when transitioning to XGEN SRP, we have to "reset" the page atom to 1.
       */
      if (isXgenSearch && url.startsWith('/search')) {
        resetPageData()
        setPage(1)
      }
    }

    events.on('routeChangeStart', handleRouteChange)

    return () => {
      resetPageData()

      /*
       * Same as above. We need to ensure the `page` atom is "reset" on unmount so XGEN SRP can
       * start paginating from page 1.
       */
      if (isXgenSearch) {
        setPage(1)
      }

      events.off('routeChangeStart', handleRouteChange)
    }
  }, [])

  useEffect(() => {
    if (reloading && !loading) {
      handlePageUpdate()
    }
  }, [urlToFetch])

  const updatePageData = (pageData, badgingContentSlots) => {
    analytics.handleUrlUpdate({ pageData: { ...pageData, ...overrideProps }, appData })
    if (page === 1) {
      // this events needs to be triggered again once PLP filters are applied (TORO-55658)
      analytics.send('uiInteractive', { loadType: 'dynamic' })
    }
    dispatchToroEvent({ type: 'on-listing-lazy-load', page })
    trackXgenSearchEvent({ query: query.q, page: page - 1, pageType: pageData?.pageType })
    const updatedProducts = page > 1 ? products.concat(pageData.products) : pageData.products
    setAdjacentPageUrls(pageData)
    setProducts(updatedProducts)
    updatePageDataAtoms({ pageData, badgingContentSlots })
    resetBusyFilterId()
    setReloading(false)
    fetchAndStoreRecommendations(pageData?.id)
    updateState((prevStore) => ({
      ...prevStore,
      pageData: {
        ...prevStore.pageData,
        ...pageData,
        ...overrideProps,
        products: updatedProducts,
      },
    }))
  }

  const handlePageUpdate = async () => {
    abortController.current?.abort()
    if (!urlToFetch) {
      return
    }
    replaceState(null, null, url)
    const { controller, fetchLatest } = abortableFetch(urlToFetch)
    abortController.current = controller

    let response
    try {
      const latest = await fetchLatest
      response = await latest?.json()
    } catch (e) {
      if (!controller.signal.aborted) {
        console.error('Failed to fetch page data, reason:', e)
      }
      return
    }

    const { pageData, badgingContentSlots } = response || {}
    try {
      if (!isValidPageData(pageData)) {
        console.error(
          'Failed to apply page data, reason: page data is not valid',
          JSON.stringify(pageData)
        )
        setReloading(page < totalPages)
        setPage(Math.min(totalPages, page + 1))
        return
      }
      updatePageData(pageData, badgingContentSlots)
    } catch (e) {
      console.error('Failed to apply page data, reason:', e)
    }
  }

  return state
}
