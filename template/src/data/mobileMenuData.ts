import type { BrandId } from '../components/nav/NavSearchExposed'
import liveMenu from './menuData.live.json'

export type MenuCategory = {
  id: string
  label: string
}

export type MenuLink = {
  id: string
  label: string
  href?: string
}

/**
 * Grouped link list on L2 flat-section views (and L3 data shape).
 *
 * - L1 collage uses content-spot eyebrows — not MenuLinkSection.
 * - L2 sub-category lists (chevron rows) do not render section eyebrows.
 * - L3 never renders section eyebrows; the drill header is the title.
 *
 * Visibility is resolved by `shouldShowSectionEyebrow` in navEyebrowVisibility.ts.
 * Sync may set `showEyebrow` explicitly; otherwise UI applies default L2 rules.
 */
export type MenuLinkSection = {
  id: string
  /** Group label — may be omitted when showEyebrow is false */
  eyebrow?: string
  /** Explicit override; when omitted, UI applies default rules */
  showEyebrow?: boolean
  links: MenuLink[]
}

export type MenuSubCategory = {
  id: string
  label: string
  sections: MenuLinkSection[]
}

export type MenuCategoryDetail = {
  id: string
  label: string
  subCategories?: MenuSubCategory[]
  sections?: MenuLinkSection[]
}

export type LiveMenuBrandData = {
  topCategories: MenuCategory[]
  categories: Record<string, MenuCategoryDetail>
}

export type LiveMenuData = {
  syncedAt: string
  source: string
  coach: LiveMenuBrandData
  outlet: LiveMenuBrandData
}

const menuData = liveMenu as LiveMenuData

const coachTopCategories = menuData.coach.topCategories
const outletTopCategories = menuData.outlet.topCategories
const coachCategoryDetails = menuData.coach.categories
const outletCategoryDetails = menuData.outlet.categories

/** Last sync timestamp from coach-pwa / SFCC (see npm run sync:menu). */
export const menuDataSyncedAt = menuData.syncedAt

export function getMenuTopCategories(brand: BrandId): MenuCategory[] {
  return brand === 'coach' ? coachTopCategories : outletTopCategories
}

/** @deprecated Use getMenuTopCategories(brand) */
export const menuTopCategories = coachTopCategories

const genericSections = (label: string): MenuLinkSection[] => [
  {
    id: 'shop',
    eyebrow: 'Shop by Category',
    links: [{ id: 'view-all', label: `View All ${label}` }],
  },
]

export function getDefaultCategoryId(_brand: BrandId): string {
  return 'bags'
}

export function getCategoryDetail(
  id: string,
  brand: BrandId = 'coach',
): MenuCategoryDetail {
  const details =
    brand === 'coach' ? coachCategoryDetails : outletCategoryDetails

  return (
    details[id] ?? {
      id,
      label: id,
      sections: genericSections(id),
    }
  )
}

export function getSubCategory(
  categoryId: string,
  subCategoryId: string,
  brand: BrandId = 'coach',
): MenuSubCategory | undefined {
  const detail = getCategoryDetail(categoryId, brand)
  return detail.subCategories?.find((sub) => sub.id === subCategoryId)
}
