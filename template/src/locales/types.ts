export type NavLocale = 'fr-CA' | 'en-US'

export type NavUiMessages = {
  search: string
  searchAria: string
  trackOrder: string
  help: string
  currency: string
  login: string
  closeMenu: string
  menu: string
  bagItems: (count: number) => string
  back: string
  backToMainMenu: string
  accountAndSupport: string
  brand: string
  shopNavigation: string
  shopByCategory: string
  viewAll: string
  viewAllNamed: (name: string) => string
  copyGoesHere: string
}
