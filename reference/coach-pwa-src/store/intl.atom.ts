import { atom } from 'jotai'
import { createIntl, createIntlCache } from 'react-intl'

const cache = createIntlCache()

export const intlAtom = atom(
  createIntl({ locale: 'en', messages: {} }, cache),
  (get, set, newIntlProps: { locale: string; messages: any }) => {
    const { locale, messages } = newIntlProps
    const newIntl = createIntl({ locale, messages }, cache)
    set(intlAtom, newIntl)
  }
)
