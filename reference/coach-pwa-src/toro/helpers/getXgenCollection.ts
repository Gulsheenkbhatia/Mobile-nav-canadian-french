import type { CurrentLocale } from 'lib/vendorProductsAdapter/search/types/module'

const DEFAULT_XGEN_COLLECTION = 'default'

function normalizeLocaleTag(raw: string): string {
  return raw.trim().replace(/_/g, '-').toLowerCase()
}

export function getXgenCollection(currentLocale: CurrentLocale): string {
  const fromLocale = normalizeLocaleTag(currentLocale.locale || '')
  if (fromLocale) {
    return fromLocale
  }

  const lang = (currentLocale.lang || '').trim()
  const region = (currentLocale.region || '').trim()
  if (lang && region) {
    return normalizeLocaleTag(`${lang}-${region}`)
  }

  return DEFAULT_XGEN_COLLECTION
}
