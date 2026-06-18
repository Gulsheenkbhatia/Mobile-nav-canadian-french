import { atom } from 'jotai'
import isEqual from 'lodash/isEqual'

export type FlyoutConfigAtomType = {
  type: FlyoutType
  options?: FlyoutOptions
}

type FlyoutType = 'register' | 'forgot-password' | 'login'

type FlyoutOptions = {
  referrer?: string
  registerFlyout?: boolean
  resetPasswordFlyout?: boolean
}

export const flyoutConfigAtom = atom(null as FlyoutConfigAtomType | null)
export const setFlyoutConfigAtom = atom<null, FlyoutConfigAtomType | null>(
  null,
  (get, set, nextConfig) => {
    const currentConfig = get(flyoutConfigAtom)
    if (isEqual(currentConfig, nextConfig)) {
      return
    }
    set(flyoutConfigAtom, nextConfig)
  }
)
export const flyoutVisibleAtom = atom((get) => !!get(flyoutConfigAtom))
