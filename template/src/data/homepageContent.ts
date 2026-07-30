import liveContent from './homepageContent.live.json'
import { localizeHomepageContent, NAV_LOCALE } from '../locales'
import type { NavLocale } from '../locales/types'

export type HomepageMasthead = {
  id: string
  title: string
  body: string
  primaryCta: string
  primaryHref: string
  secondaryCta?: string
  secondaryHref?: string
  logoUrl?: string
  imageUrl?: string
  syncedAt?: string
}

export type HomepageShowcaseCard = {
  id: string
  kind: 'product' | 'editorial'
  isVideo?: boolean
  imageUrl: string
  posterUrl?: string
  videoUrl?: string
  ctaLabel?: string
  ctaHref?: string
}

export type HomepageLink = {
  label: string
  href: string
}

export type HomepageCategoryGroup = {
  title: string
  links: HomepageLink[]
}

export type HomepageShoulderBags = {
  title: string
  links: HomepageLink[]
  images: { src: string; alt: string }[]
}

export type HomepageContent = {
  masthead: HomepageMasthead
  cards: HomepageShowcaseCard[]
  primarySubnav: HomepageLink[]
  shoulderBags: HomepageShoulderBags
  shopByCategory: HomepageCategoryGroup[]
  storiesSectionTitle: string
  syncedAt?: string
  source?: string
}

/** Live homepage content — synced from coach-nav.vercel.app via npm run sync:homepage */
const homepageContentEn = liveContent as HomepageContent

export function getHomepageContent(locale: NavLocale = NAV_LOCALE): HomepageContent {
  return localizeHomepageContent(homepageContentEn, locale)
}

/** Localized homepage for the default prototype locale (fr-CA). */
export const homepageContent = getHomepageContent()

export function getShowcaseColumns(cards: HomepageShowcaseCard[]) {
  return {
    left: cards.filter((_, index) => index % 2 === 0),
    right: cards.filter((_, index) => index % 2 === 1),
  }
}
