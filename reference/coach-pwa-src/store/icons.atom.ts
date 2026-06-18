import { atom } from 'jotai'
import { iconIdsMap } from 'toro/icons'

export const usedIconsAtom = atom<IconId[]>([
  'form-error-outline',
  'close-large',
  'nav-chevron-left',
  'nav-chevron-right',
  'nav-chevron-bold-right',
  'nav-chevron-bold-left',
  'review-star-filled',
  'review-star-half',
  'graphic-arrow-left',
  'graphic-arrow-right',
  'plus',
  'minus',
])
export const addIconsAtom = atom(null, (get, set, id: IconId | IconId[]) => {
  const usedIcons = get(usedIconsAtom)
  if (
    Array.isArray(id) ? !id.every((iconId) => usedIcons.includes(iconId)) : !usedIcons.includes(id)
  ) {
    const addedIcons = usedIcons.concat(id).filter((id) => iconIdsMap.has(id))
    set(usedIconsAtom, Array.from(new Set(addedIcons)).sort())
  }
})
