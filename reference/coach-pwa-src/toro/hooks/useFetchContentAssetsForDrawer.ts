import { useCallback, useMemo } from 'react'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import {
  drawerContentAssetsAtom,
  drawerContentAssetsLoadingAtom,
  fetchDrawerContentAssetsAtom,
  getLocaleCacheKey,
} from 'store/drawer-content-assets.atom'
import { getLocalePathPrefix } from 'toro/helpers/fetchOcapiContentAssetsFromClient'
import type { FetchedContentAssetsState } from 'toro/types/contentAsset'

interface UseFetchContentAssetsForDrawerReturn {
  contentAssets: FetchedContentAssetsState
  isLoadingAssets: boolean
  handleContentAssetRequest: (assetId: string) => void
  getCacheKey: (assetId: string) => string
}

const useFetchContentAssetsForDrawer = (): UseFetchContentAssetsForDrawerReturn => {
  const contentAssets = useAtomValue(drawerContentAssetsAtom)
  const isLoadingAssets = useAtomValue(drawerContentAssetsLoadingAtom)
  const fetchContentAssets = useUpdateAtom(fetchDrawerContentAssetsAtom)

  const locale = useMemo(() => getLocalePathPrefix().replace('/', ''), [])

  const getCacheKey = useCallback(
    (assetId: string): string => getLocaleCacheKey(assetId, locale),
    [locale]
  )

  const handleContentAssetRequest = useCallback(
    (assetId: string): void => {
      if (!assetId) return

      const cacheKey = getLocaleCacheKey(assetId, locale)

      if (contentAssets[cacheKey]) {
        return
      }

      fetchContentAssets([assetId])
    },
    [fetchContentAssets, contentAssets, locale]
  )

  return {
    contentAssets,
    isLoadingAssets,
    handleContentAssetRequest,
    getCacheKey,
  }
}

export default useFetchContentAssetsForDrawer
