import useLazyState from 'hooks/useLazyState'
import { useAtomValue, useResetAtom, useUpdateAtom } from 'jotai/utils'
import { useEffect, useState } from 'react'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import { retrieveFromXgenAtom, xgenClientAtom, xgenSearchEventPayloadAtom } from 'store/xgen.atom'
import {
  searchResultsUrlAtom,
  setSearchResultsReloadingAtom,
  setInitialRouteParamsAtom,
  busyFilterIdAtom,
  setAdjacentPageUrlsAtom,
  populatePageDataAtom,
  lastAppliedRefinementId,
  searchResultsReloadingAtom,
} from 'store/search-results.atom'
import { getURLForState } from 'toro/helpers/plp'
import useAnalytics from 'toro/analytics/useAnalytics'
import useToroEventsDispatch from 'toro/hooks/useToroEventDispatch'
import replaceState from 'helpers/replaceState'
import { useRouter } from 'next/router'
import { useSearchParams } from 'next/navigation'
import useViewportType from 'toro/hooks/useViewportType'
import { useAddRecentSearch } from 'toro/hooks/useRecentSearches'
import { oneSiteActiveBrandAtom } from 'store/menu-data.atom'

export default function useXgenSearchResults(props) {
  const xgenClient = useAtomValue(xgenClientAtom)

  const analytics = useAnalytics()
  const {
    query,
    asPath,
    locale: currentLocale,
    defaultLocale,
    replace: routerReplace,
  } = useRouter()
  const searchParams = useSearchParams()
  const { url } = useAtomValue(searchResultsUrlAtom)
  const resetBusyFilterId = useResetAtom(busyFilterIdAtom)
  const dispatchToroEvent = useToroEventsDispatch()
  const retrievePageData = useUpdateAtom(retrieveFromXgenAtom)
  const reloading = useAtomValue(searchResultsReloadingAtom)
  const setReloading = useUpdateAtom(setSearchResultsReloadingAtom)
  const setInitialRouteParams = useUpdateAtom(setInitialRouteParamsAtom)
  const setAdjacentPageUrls = useUpdateAtom(setAdjacentPageUrlsAtom)
  const populatePageData = useUpdateAtom(populatePageDataAtom)
  const resetLastAppliedRefinementId = useResetAtom(lastAppliedRefinementId)
  const searchEventPayload = useAtomValue(xgenSearchEventPayloadAtom)
  const resetSearchEventPayload = useResetAtom(xgenSearchEventPayloadAtom)
  const oneSiteActiveBrand = useAtomValue(oneSiteActiveBrandAtom)
  const searchTerm = searchParams.get('q') || ''
  const { isDesktop } = useViewportType()
  const addRecentSearch = useAddRecentSearch(isDesktop)
  const locale = currentLocale === defaultLocale ? '' : currentLocale

  const [state, updateState] = useLazyState(props, {}, (props) => {
    const normalizedAsPath = decodeURIComponent(asPath || '')
    const urlToCompare = `${locale ? `/${locale}` : ''}${normalizedAsPath}`
    const isRecovered =
      decodeURIComponent(get(props, 'pageData.actualUrl')) === urlToCompare ||
      decodeURIComponent(get(props, 'pageData.url')) === urlToCompare
    setInitialRouteParams({ query, asPath, locale })
    setAdjacentPageUrls(props?.pageData)
    populatePageData(props)
    xgenClient.setContext({ customerGroups: get(props, 'pageData.customerGroups', []) })
    resetLastAppliedRefinementId()
    setLoading(!isRecovered)
  })

  useEffect(() => {
    if (state.loading) {
      setLoading(true)
    }
  }, [state.loading])

  const initialLoadingState =
    !get(props, 'pageData.products.length', 0) || !!get(props, 'lazy', false)
  const [loading, setLoading] = useState(initialLoadingState)

  const fetchPageData = async () => {
    return await retrievePageData({
      searchTerm,
      query,
    })
  }

  const updatePageData = async () => {
    const pageData = await fetchPageData()
    if (pageData.aborted) {
      return
    }
    const redirectUrl = pageData?.urlRedirect
    if (!!redirectUrl) {
      try {
        const resultUrl = new URL(redirectUrl)
        resultUrl.searchParams.set('sdr', searchTerm)
        addRecentSearch(searchTerm)

        await routerReplace(resultUrl.pathname + resultUrl.search)

        analytics.send('search', {
          searchTermTyped: searchTerm,
          searchTermUsed: searchTerm,
          searchType: 'redirect',
        })

        return await new Promise(() => {})
      } catch (error) {
        console.error(`[XGEN logs]: Unable to parse redirect url ${redirectUrl}`, error)
      }
    }

    updateState((prevStore) => {
      const newStoredState = {
        ...prevStore,
        ...(pageData.error ? { xgenSearchError: pageData.error } : {}),
        pageData: {
          ...prevStore.pageData,
          ...pageData,
          url,
          actualUrl: getURLForState(query, asPath, locale),
          // For OneCoach we want to also store last active brand on SRP
          // to be able to switch to it on navigating back in history
          oneSiteActiveBrand,
        },
      }
      return newStoredState
    })

    if (pageData.page === 1) {
      analytics.send('uiInteractive', { loadType: 'dynamic' })
    }

    dispatchToroEvent({ type: 'on-listing-lazy-load', page: pageData.page })
    if (!isEmpty(searchEventPayload)) {
      analytics.send('search', {
        ...searchEventPayload,
        searchTotal: pageData.total,
      })
      resetSearchEventPayload()
    }
    resetBusyFilterId()
    setReloading(false)
    setLoading(false)
  }

  useEffect(() => {
    if (state.loading) return
    const isRecovered = get(props, 'pageData.url') === url
    if (/search|featured/.test(url) && !isRecovered) {
      updatePageData()
    }
  }, [url, state.loading])

  useEffect(() => {
    if (!loading && reloading) {
      replaceState(null, null, url)
    }
  }, [url, loading, reloading])

  return { ...state, loading }
}
