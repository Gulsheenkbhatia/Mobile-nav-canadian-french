import { atom } from 'jotai'
import { mergeContentSlots } from 'toro/helpers/badges'
import isArray from 'lodash/isArray'

export const badgesAtom = atom([])
export const addBadgesAtom = atom(null, (get, set, badges: any[]) => {
  if (!isArray(badges) || badges.length === 0) {
    return
  }
  set(badgesAtom, mergeContentSlots(get(badgesAtom), badges))
})
