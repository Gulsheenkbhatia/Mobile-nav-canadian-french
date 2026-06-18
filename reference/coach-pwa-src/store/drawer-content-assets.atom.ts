import { atom } from 'jotai'
import fetchOcapiContentAssetsFromClient, {
  getLocalePathPrefix,
} from 'toro/helpers/fetchOcapiContentAssetsFromClient'
import type { FetchedContentAssetsState } from 'toro/types/contentAsset'

export const drawerContentAssetsAtom = atom<FetchedContentAssetsState>({})

export const drawerContentAssetsLoadingAtom = atom(false)

const getLocaleCacheKey = (assetId: string, locale: string): string => {
  return locale ? `${locale}_${assetId}` : assetId
}

export { getLocaleCacheKey }

export const fetchDrawerContentAssetsAtom = atom(null, async (get, set, assetIds: string[]) => {
  if (!assetIds.length) return

  const locale = getLocalePathPrefix().replace('/', '')
  const existingAssets = get(drawerContentAssetsAtom)

  const filteredIds = assetIds.filter((id) => !existingAssets[getLocaleCacheKey(id, locale)])

  if (!filteredIds.length) return

  set(drawerContentAssetsLoadingAtom, true)

  try {
    const newAssetsArray = await fetchOcapiContentAssetsFromClient(filteredIds, {
      localePathPrefix: locale ? `/${locale}` : '',
    })

    if (newAssetsArray && newAssetsArray.length > 0) {
      const newAssetsObj = newAssetsArray.reduce<FetchedContentAssetsState>((acc, asset) => {
        if (asset.status === '404') {
          console.error(`Content Asset ${asset.id} can not be found`)
        }
        const cacheKey = getLocaleCacheKey(asset.id, locale)
        acc[cacheKey] = asset
        return acc
      }, {})

      set(drawerContentAssetsAtom, {
        ...existingAssets,
        ...newAssetsObj,
      })
    } else {
      const notFoundAssets = filteredIds.reduce<FetchedContentAssetsState>((acc, assetId) => {
        console.error(`Content Asset ${assetId} can not be found`)
        const cacheKey = getLocaleCacheKey(assetId, locale)
        acc[cacheKey] = { id: assetId, status: '404' }
        return acc
      }, {})

      set(drawerContentAssetsAtom, {
        ...existingAssets,
        ...notFoundAssets,
      })
    }
  } catch (error) {
    console.error('Error fetching drawer content assets:', error)

    const errorAssets = filteredIds.reduce<FetchedContentAssetsState>((acc, assetId) => {
      console.error(`Content Asset ${assetId} can not be found`)
      const cacheKey = getLocaleCacheKey(assetId, locale)
      acc[cacheKey] = { id: assetId, status: '404' }
      return acc
    }, {})

    set(drawerContentAssetsAtom, {
      ...existingAssets,
      ...errorAssets,
    })
  } finally {
    set(drawerContentAssetsLoadingAtom, false)
  }
})
