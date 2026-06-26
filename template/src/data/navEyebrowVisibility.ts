import type { MenuLinkSection } from './mobileMenuData'

export const GENERIC_SECTION_EYEBROW = 'Shop by Category'

export type NavEyebrowContext = {
  depth: 'l2' | 'l3'
  screenTitle: string
  sectionCount: number
}

function normalizeLabel(value: string): string {
  return value.trim().toLowerCase()
}

function hasEyebrowText(section: MenuLinkSection): boolean {
  return Boolean(section.eyebrow?.trim())
}

/**
 * Whether to render a section eyebrow label on L2/L3 link lists.
 *
 * L1 collage spots use a separate content-spot eyebrow system — not this helper.
 */
export function shouldShowSectionEyebrow(
  section: MenuLinkSection,
  ctx: NavEyebrowContext,
): boolean {
  if (ctx.depth === 'l3') return false

  if (section.showEyebrow === false) return false

  if (section.showEyebrow === true) return hasEyebrowText(section)

  if (ctx.sectionCount > 1) return hasEyebrowText(section)

  const eyebrow = section.eyebrow?.trim() ?? ''
  if (!eyebrow) return false
  if (normalizeLabel(eyebrow) === normalizeLabel(ctx.screenTitle)) return false
  if (normalizeLabel(eyebrow) === normalizeLabel(GENERIC_SECTION_EYEBROW)) {
    return false
  }

  return true
}
