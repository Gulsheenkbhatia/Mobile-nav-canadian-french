import localeSettings from '../../../config/localeSettings'

export type LocaleSettings = typeof localeSettings
export type SupportedLocale = keyof LocaleSettings
export type LocaleConfig = LocaleSettings[SupportedLocale]
export type SupportedCurrency = LocaleConfig['currency']
export type SupportedLanguage = LocaleConfig['lang']
export type SupportedRegion = LocaleConfig['region']
