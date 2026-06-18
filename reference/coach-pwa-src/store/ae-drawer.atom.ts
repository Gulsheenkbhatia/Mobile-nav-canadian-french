import { atom } from 'jotai'
import isEqual from 'lodash/isEqual'
import { atomWithReset, RESET } from 'jotai/utils'
import _get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'

export type AEDrawerProduct = {
  firstThumbnailSrc?: string
  itemId?: string
  name?: string
  vgId?: string
}

type AEDrawerConfigAtomType = {
  showDrawer: boolean
  activeProduct: AEDrawerProduct
  recommenders?: string[]
  eventLocation?: string
  shouldClearSchemeData?: boolean
}

export const aeDrawerConfigAtom = atomWithReset<AEDrawerConfigAtomType>({
  showDrawer: false,
  activeProduct: {},
  recommenders: [],
  eventLocation: '',
  shouldClearSchemeData: true,
})
export const setAEDrawerConfigAtom = atom(
  null,
  (get, set, nextConfig: AEDrawerConfigAtomType | typeof RESET) => {
    const currentConfig = get(aeDrawerConfigAtom)

    if (nextConfig === RESET) {
      set(aeDrawerConfigAtom, nextConfig)
      return
    }

    if (isEqual(currentConfig, nextConfig)) {
      return
    }

    const productData = nextConfig.activeProduct
    if (isEmpty(productData)) {
      return
    }

    const firstThumbnailSrc =
      _get(productData, 'media.thumbnails[0].src') ||
      _get(productData, 'defaultColor.media.thumbnails[0].src')
    const isBundleProduct = _get(productData, 'isBundleProduct')
    const itemId = isBundleProduct
      ? _get(productData, 'bundleProductData[0].id')
      : _get(productData, 'id') || _get(productData, 'master.defaultVariantID')
    const vgId = _get(productData, 'defaultColor.vgId')
    const name = _get(productData, 'name')

    const activeProduct = {
      firstThumbnailSrc,
      itemId,
      vgId,
      name,
    }

    set(aeDrawerConfigAtom, {
      showDrawer: nextConfig.showDrawer,
      activeProduct,
      recommenders: nextConfig.recommenders,
      eventLocation: nextConfig.eventLocation,
      shouldClearSchemeData: nextConfig.shouldClearSchemeData,
    })
  }
)
