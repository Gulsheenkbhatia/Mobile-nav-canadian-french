import { PreferencesAtomGroupType } from 'store/preferences.atom'

type IsSWOutletParams = {
  isOneCoachNAEnabled: PreferencesAtomGroupType['OneSite']['enableOneSite']
  pathname: string
  breadcrumbs?: { url?: string; categoryID?: string }[]
}

export const isSWOutletHelper = ({
  isOneCoachNAEnabled,
  pathname,
  breadcrumbs,
}: IsSWOutletParams): boolean => {
  if (isOneCoachNAEnabled) {
    return false
  }

  return (
    /sw-outlet/.test(pathname) ||
    /sw-outlet/.test(breadcrumbs?.[0]?.url || '') ||
    breadcrumbs?.[0]?.categoryID === 'outlet'
  )
}
