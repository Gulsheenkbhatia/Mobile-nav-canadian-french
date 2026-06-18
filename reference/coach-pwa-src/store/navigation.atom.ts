import { atom } from 'jotai'
import { Router } from 'next/router'
import _get from 'lodash/get'
import findKey from 'lodash/findKey'
import { preferencesAtom } from 'store/preferences.atom'
import getPageTypeFlags from 'helpers/pageTypeFlags'
import { PageTypeFlags } from 'toro/types'
import { selectAtom } from 'jotai/utils'

export const basePathAtom = atom('/')
basePathAtom.onMount = (set) => {
  const callback = (nextUrl: string) => {
    set(nextUrl.replace(/\?.+/, ''))
  }
  Router.events.on('routeChangeComplete', callback)
  return () => {
    Router.events.off('routeChangeComplete', callback)
  }
}

export const isNavigatingAtom = atom(false)
isNavigatingAtom.onMount = (set) => {
  const onStart = () => set(true)
  const onComplete = () => set(false)

  Router.events.on('routeChangeStart', onStart)
  Router.events.on('routeChangeComplete', onComplete)

  return () => {
    Router.events.off('routeChangeStart', onStart)
    Router.events.off('routeChangeComplete', onComplete)
  }
}

export const pathAtom = atom((get) => get(basePathAtom))

export const pageTypeAtom = atom<PageTypeFlags>((get) => {
  const path = get(pathAtom)
  const preferences = get(preferencesAtom)
  const subBrandHomePageUrl = _get(preferences, 'coachtopia.coachtopiaHomeURL', '') as string

  return getPageTypeFlags(path, subBrandHomePageUrl)
})

export const pageTypeShorthandAtom = atom((get) => {
  const pageType = get(pageTypeAtom)
  return findKey(pageType, Boolean)?.replace('is', '')
})

const createSelectPageTypeAtom = (key: keyof PageTypeFlags) =>
  selectAtom(pageTypeAtom, (pageTypeFlags) => _get(pageTypeFlags, key))

export const isHpAtom = createSelectPageTypeAtom('isHP')
export const isPlpAtom = createSelectPageTypeAtom('isPLP')
export const isPdpAtom = createSelectPageTypeAtom('isPDP')
export const isContentPageAtom = createSelectPageTypeAtom('isContentPage')
export const isSrpAtom = createSelectPageTypeAtom('isSRP')
export const isProductPassportAtom = createSelectPageTypeAtom('isProductPassport')
export const isRetailHPAtom = createSelectPageTypeAtom('isRetailHP')
export const isSubHPAtom = createSelectPageTypeAtom('isSubHP')
export const isOutletHPAtom = createSelectPageTypeAtom('isOutletHP')
