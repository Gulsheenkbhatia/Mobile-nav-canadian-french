import type { MenuLinkSection, MenuSubCategorySection } from './mobileMenuData'

export type NavEyebrowSection = Pick<
  MenuLinkSection | MenuSubCategorySection,
  'eyebrow' | 'showEyebrow'
>

export type NavEyebrowContext = {
  depth: 'l2' | 'l3'
  screenTitle: string
  sectionCount: number
}

function hasEyebrowText(section: NavEyebrowSection): boolean {
  return Boolean(section.eyebrow?.trim())
}

/**
 * Whether to render a section eyebrow on L2/L3 drill link lists.
 *
 * Prototype rule: multiple sections → show group eyebrows; a single section is
 * a flat list with no eyebrow. L1 content spots use a separate eyebrow system.
 *
 * Production can override per section via `showEyebrow` from CMS/sync.
 */
export function shouldShowSectionEyebrow(
  section: NavEyebrowSection,
  ctx: NavEyebrowContext,
): boolean {
  if (section.showEyebrow === false) return false
  if (!hasEyebrowText(section)) return false
  if (ctx.sectionCount <= 1) return false
  return true
}

/** L2 content-spot eyebrow injected above the first sub-category section. */
export function shouldShowDrillLeadingEyebrow(
  ctx: NavEyebrowContext,
  leadingEyebrow?: string,
): boolean {
  return ctx.sectionCount > 1 && Boolean(leadingEyebrow?.trim())
}
