import type {
  MenuCategory,
  MenuCategoryDetail,
  MenuLink,
  MenuLinkSection,
  MenuSubCategory,
  MenuSubCategorySection,
} from '../data/mobileMenuData'
import { translateNavLabel } from './menuLabelTranslations'
import type { NavLocale, NavUiMessages } from './types'
import { frCAMessages } from './messages/fr-CA'
import { enUSMessages } from './messages/en-US'

/** Default locale for this Canadian French prototype branch. */
export const NAV_LOCALE: NavLocale = 'fr-CA'

const messagesByLocale: Record<NavLocale, NavUiMessages> = {
  'fr-CA': frCAMessages,
  'en-US': enUSMessages,
}

export function getNavMessages(locale: NavLocale = NAV_LOCALE): NavUiMessages {
  return messagesByLocale[locale]
}

export const navMessages = getNavMessages()

export function shouldApplyNavHeadlineCase(locale: NavLocale = NAV_LOCALE): boolean {
  return locale === 'en-US'
}

function localizeLink(link: MenuLink): MenuLink {
  return {
    ...link,
    label: translateNavLabel(link.label, {
      href: link.href,
      id: link.id,
      preferHref: true,
    }),
  }
}

function localizeSection(section: MenuLinkSection): MenuLinkSection {
  return {
    ...section,
    eyebrow: section.eyebrow ? translateNavLabel(section.eyebrow) : section.eyebrow,
    links: section.links.map(localizeLink),
  }
}

function localizeSubCategory(sub: MenuSubCategory): MenuSubCategory {
  return {
    ...sub,
    label: translateNavLabel(sub.label, { id: sub.id }),
    sections: sub.sections.map(localizeSection),
  }
}

function localizeSubCategorySection(
  section: MenuSubCategorySection,
): MenuSubCategorySection {
  return {
    ...section,
    eyebrow: section.eyebrow ? translateNavLabel(section.eyebrow) : section.eyebrow,
    subCategories: section.subCategories.map(localizeSubCategory),
  }
}

export function localizeMenuCategory(category: MenuCategory): MenuCategory {
  return {
    ...category,
    label: translateNavLabel(category.label, { id: category.id }),
  }
}

export function localizeMenuSubCategory(sub: MenuSubCategory): MenuSubCategory {
  return {
    ...sub,
    label: translateNavLabel(sub.label, { id: sub.id }),
    sections: sub.sections.map(localizeSection),
  }
}

export function localizeMenuCategoryDetail(
  detail: MenuCategoryDetail,
): MenuCategoryDetail {
  return {
    ...detail,
    label: translateNavLabel(detail.label, { id: detail.id }),
    subCategories: detail.subCategories?.map(localizeSubCategory),
    subCategorySections: detail.subCategorySections?.map(localizeSubCategorySection),
    sections: detail.sections?.map(localizeSection),
  }
}

import { localizeHomepageContent } from './localizeHomepageContent'

export { localizeHomepageContent }

export function localizeNavLabel(
  label: string,
  locale: NavLocale = NAV_LOCALE,
  id?: string,
): string {
  if (locale === 'en-US') return label
  return translateNavLabel(label, id ? { id } : undefined)
}
