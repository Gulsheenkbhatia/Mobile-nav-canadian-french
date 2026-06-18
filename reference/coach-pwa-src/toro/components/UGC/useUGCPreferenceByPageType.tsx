import { useState, useEffect } from 'react'
import get from 'lodash/get'
import getAPIURL from 'helpers/getAPIURL'
import fetch from 'toro/helpers/fetch'
import usePreference from 'toro/hooks/usePreference_new'

interface UGCOptions {
  enabled: boolean
  id: { [key: string]: string | number }
}

interface PixleeOptions {
  enabled?: boolean
  id: { [key: string]: string | number }
}

export interface UseUGCPreferenceProps {
  pageType: 'home' | 'plp' | 'pdp' | 'social-gallery'
  externalId?: string
  categoryWyngFilterUUID?: string
  pageSize?: number
  images?: any[]
  imagesCount?: number
  enabled?: boolean
  emplifiVPC?: string
  pixleeAlbumID?: string
  next?: boolean
}

const constructUrl = (url: string, isEnable: boolean, params: Record<string, any> = {}): string => {
  if (isEnable) {
    const searchParams = new URLSearchParams()

    Object.keys(params).forEach((key) => searchParams.append(key, params[key]))
    const stringifyParams = searchParams.toString()
    const apiUrl = stringifyParams ? `${url}?${stringifyParams}` : url
    return getAPIURL(apiUrl)
  }
  return ''
}

function useUGCPreferenceByPageType({
  pageType,
  externalId,
  categoryWyngFilterUUID,
  pageSize = 10,
  images = [],
  imagesCount = 0,
  enabled = true,
  emplifiVPC,
  pixleeAlbumID,
  next,
}: UseUGCPreferenceProps) {
  const [loading, setLoading] = useState(false)
  const [gridLoading, setGridLoading] = useState(false)
  const [showImages, setShowImages] = useState<any[]>(images)
  const [currentPage, setCurrentPage] = useState(1)
  const [UGCItemCount, setUGCItemCount] = useState(imagesCount)
  const [isFetchNextEnable, setFetchNextEnable] = useState(false)
  const [hasNext, setHasNext] = useState(next)

  const {
    wyng: {
      isEnableWyngOnHomePage,
      enableWyng,
      isEnableWyngOnPdpPage,
      isEnableWyngOnPlpPage,
      wyngFilterUUID,
      isEnableViewGalleryCTA,
    },
    pixleeUgc: {
      enablePixleeUGC,
      pixleeUGCAlbumID,
      enablePixleeUGCHome,
      enableViewGalleryCTA,
      enablePixleeUGCPlp,
      enablePixleeUGCPdp,
    },
  } = usePreference({ wyng: '*', pixleeUGC: '*' })

  const inputUgcCategoryID = enablePixleeUGC ? pixleeAlbumID : categoryWyngFilterUUID
  const [ugcCategoryID, setUgcCategoryID] = useState(inputUgcCategoryID)

  const wyngOptionsByPageType: Record<string, UGCOptions> = {
    home: {
      enabled: enableWyng && isEnableWyngOnHomePage && !!(categoryWyngFilterUUID || wyngFilterUUID),
      id: { wyngFilterUUID: categoryWyngFilterUUID || wyngFilterUUID },
    },
    plp: {
      enabled: enableWyng && isEnableWyngOnPlpPage && !!categoryWyngFilterUUID,
      id: { wyngFilterUUID: categoryWyngFilterUUID },
    },
    pdp: {
      enabled: enableWyng && isEnableWyngOnPdpPage && !!externalId,
      id: { ids: externalId },
    },
    'social-gallery': {
      enabled: true,
      id: { wyngFilterUUID: ugcCategoryID || wyngFilterUUID },
    },
  }

  const pixleeOptionsByPageType: Record<string, PixleeOptions> = {
    home: {
      enabled: !!(enablePixleeUGCHome && (pixleeAlbumID || pixleeUGCAlbumID)),
      id: { ids: pixleeAlbumID || pixleeUGCAlbumID },
    },
    plp: {
      enabled: !!(enablePixleeUGCPlp && pixleeAlbumID),
      id: { ids: pixleeAlbumID },
    },
    pdp: {
      enabled: !!(enablePixleeUGCPdp && emplifiVPC),
      id: { skuid: emplifiVPC },
    },
    'social-gallery': {
      enabled: true,
      id: { ids: pixleeUGCAlbumID },
    },
  }

  const url = enablePixleeUGC
    ? '/get-pixlee-ugc'
    : pageType === 'pdp'
    ? '/wyng-pdp'
    : '/get-wyng-content'

  const isEnable = enablePixleeUGC
    ? !!pixleeOptionsByPageType[pageType].enabled
    : wyngOptionsByPageType[pageType].enabled

  const apiUrl = constructUrl(url, isEnable, {
    ...(enablePixleeUGC
      ? pixleeOptionsByPageType[pageType].id
      : wyngOptionsByPageType[pageType].id),
    ...(currentPage && { page: currentPage }),
    ...(pageSize && { pagesize: pageSize }),
    ...(enablePixleeUGC && { pageType }),
  })

  const fetchUGCContent = async (initialFetch = false) => {
    if (apiUrl && isEnable) {
      try {
        const isNewUgcCategoryID = ugcCategoryID !== inputUgcCategoryID
        if (initialFetch && isNewUgcCategoryID) {
          setLoading(true)
        } else if (pageType === 'social-gallery') {
          setGridLoading(true)
        } else {
          setLoading(true)
        }
        setUgcCategoryID(inputUgcCategoryID)
        const result = await fetch(apiUrl)
        let products = {}
        try {
          products = await result.json()
        } catch (jsonError) {
          console.error('Failed to parse JSON:', jsonError)
          setLoading(false)
          setGridLoading(false)
          return
        }
        const itemCount = get(products, 'total_results', 0)
        const ugcItem = get(products, "_embedded['ugc:item']", [])
        setHasNext(get(products, 'next', false))
        setLoading(false)
        setGridLoading(false)

        if (itemCount) {
          setUGCItemCount((prevCount) => (itemCount !== prevCount ? itemCount : prevCount))
        }
        if (ugcItem) {
          setShowImages((prevImages) =>
            isNewUgcCategoryID ? [...ugcItem] : [...prevImages, ...ugcItem]
          )
        }
      } catch (error) {
        setLoading(false)
        setGridLoading(false)
        console.error('UGCContainer', error.message)
      }
    }
  }

  const fetchNext = () => {
    if (!isFetchNextEnable) {
      setFetchNextEnable(true)
    }
    const totalPages = Math.ceil(UGCItemCount / pageSize)
    const incrementenCurrentPage = enablePixleeUGC ? hasNext : currentPage < totalPages
    if (incrementenCurrentPage) {
      setCurrentPage(currentPage + 1)
    }
  }

  useEffect(() => {
    const isNewUgcCategoryID = ugcCategoryID !== inputUgcCategoryID
    if ((isFetchNextEnable || isNewUgcCategoryID) && enabled) {
      fetchUGCContent(currentPage === 1 || isNewUgcCategoryID)
    }
  }, [currentPage, pixleeAlbumID, categoryWyngFilterUUID, enabled])

  useEffect(() => {
    if (!enabled) {
      return
    }
    if (!showImages.length) {
      fetchUGCContent(true)
    } else {
      setFetchNextEnable(true)
    }
  }, [enabled])

  return {
    isEnable,
    apiUrl,
    loading,
    showImages,
    fetchNext,
    UGCItemCount,
    gridLoading,
    isEnableViewGalleryCTA: enablePixleeUGC ? enableViewGalleryCTA : isEnableViewGalleryCTA,
    hasNext,
    displayShowMore: enablePixleeUGC ? hasNext : UGCItemCount !== showImages.length,
  }
}

export default useUGCPreferenceByPageType
