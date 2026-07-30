import type {
  HomepageCategoryGroup,
  HomepageContent,
  HomepageLink,
  HomepageMasthead,
  HomepageShowcaseCard,
  HomepageShoulderBags,
} from '../data/homepageContent'
import type { NavLocale } from './types'
import { translateHomepageCopy } from './homepageCopyTranslations'
import { translateNavLabel } from './menuLabelTranslations'

function localizeLink(link: HomepageLink): HomepageLink {
  const fromNav = translateNavLabel(link.label, { href: link.href, preferHref: true })
  return {
    ...link,
    label: fromNav !== link.label ? fromNav : translateHomepageCopy(link.label),
  }
}

function localizeMasthead(masthead: HomepageMasthead): HomepageMasthead {
  return {
    ...masthead,
    title: translateHomepageCopy(masthead.title),
    body: translateHomepageCopy(masthead.body),
    primaryCta: localizeLink({
      label: masthead.primaryCta,
      href: masthead.primaryHref,
    }).label,
    secondaryCta: masthead.secondaryCta
      ? localizeLink({
          label: masthead.secondaryCta,
          href: masthead.secondaryHref ?? '#',
        }).label
      : masthead.secondaryCta,
  }
}

function localizeCard(card: HomepageShowcaseCard): HomepageShowcaseCard {
  if (!card.ctaLabel) return card
  return {
    ...card,
    ctaLabel: localizeLink({ label: card.ctaLabel, href: card.ctaHref ?? '#' }).label,
  }
}

function localizeShoulderBags(module: HomepageShoulderBags): HomepageShoulderBags {
  return {
    title: translateHomepageCopy(module.title),
    links: module.links.map(localizeLink),
    images: module.images.map((image) => ({
      ...image,
      alt: translateHomepageCopy(image.alt),
    })),
  }
}

function localizeCategoryGroup(group: HomepageCategoryGroup): HomepageCategoryGroup {
  const titleFromNav = translateNavLabel(group.title)
  return {
    title: titleFromNav !== group.title ? titleFromNav : translateHomepageCopy(group.title),
    links: group.links.map(localizeLink),
  }
}

export function localizeHomepageContent(
  content: HomepageContent,
  locale: NavLocale,
): HomepageContent {
  if (locale === 'en-US') return content

  return {
    ...content,
    masthead: localizeMasthead(content.masthead),
    cards: content.cards.map(localizeCard),
    primarySubnav: content.primarySubnav.map(localizeLink),
    shoulderBags: localizeShoulderBags(content.shoulderBags),
    shopByCategory: content.shopByCategory.map(localizeCategoryGroup),
    storiesSectionTitle: translateHomepageCopy(content.storiesSectionTitle),
  }
}
