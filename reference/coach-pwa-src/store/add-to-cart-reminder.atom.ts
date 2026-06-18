import { atom } from 'jotai'
import { atomWithReset, RESET } from 'jotai/utils'
import _get from 'lodash/get'
import { preferencesAtom } from 'store/preferences.atom'

const createReminderInCartAtom = () => {
  const baseAtom = atomWithReset(0)
  return atom(
    (get) => get(baseAtom),
    (get, set, reset: typeof RESET) => {
      const reminderInCartPref = get(preferencesAtom).ReminderInCart
      const reminderStorageName = _get(reminderInCartPref, 'RICSettingsJSON.RICLocalStorageName')
      const totalNumberVisitedPage = _get(reminderInCartPref, 'RICSettingsJSON.RICNumberOfPages')

      if (!reminderStorageName) {
        return
      }

      if (reset === RESET) {
        set(baseAtom, 0)
        set(reminderInCartIsBubbleOnAtom, false)
        localStorage.setItem(reminderStorageName, JSON.stringify(0))
        return
      }

      const numberFromStorage = +localStorage.getItem(reminderStorageName) || get(baseAtom)
      const didOverflow = numberFromStorage + 1 >= totalNumberVisitedPage
      const value = (numberFromStorage + 1) % totalNumberVisitedPage

      set(baseAtom, value)
      set(reminderInCartIsBubbleOnAtom, didOverflow)
      localStorage.setItem(reminderStorageName, JSON.stringify(value))
    }
  )
}

export const reminderInCartIsBubbleOnAtom = atom(false)

export const reminderInCartAtom = createReminderInCartAtom()

export const reminderInCartBubbleColorAtom = atom((get) => {
  const reminderInCartPref = get(preferencesAtom).ReminderInCart
  const colorOff = _get(reminderInCartPref, 'RICSettingsJSON.RICBubbleHexCodeOff')
  const colorOn = _get(reminderInCartPref, 'RICSettingsJSON.RICBubbleHexCodeOn')
  const isOn = get(reminderInCartIsBubbleOnAtom)
  return isOn ? colorOn : colorOff
})
