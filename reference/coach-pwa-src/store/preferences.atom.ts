import { atom } from 'jotai'

export type PreferenceType = {
  id: string
  value: any
  displayValue?: any
}

export type PreferenceGroupType = {
  [key: string | 'invalidJSONPreferences']: PreferenceType[] | string[]
}

export type PreferencesAtomGroupType = {
  [key: string]: any
}

export type PreferencesAtomType = {
  [key: string]: PreferencesAtomGroupType
}
export const preferencesAtom = atom<PreferencesAtomType>({})
