/**
 * View All rows are terminal links — no drill chevron or L3 push (V3 + V1 nav).
 */
export function isViewAllNavLink(label: string, id?: string): boolean {
  if (id && /view-all|view_all|viewAll/i.test(id)) {
    return true
  }

  if (/\bview all\b/i.test(label.trim())) {
    return true
  }

  return false
}

/** L2 rows that link out directly on ca.coach.com/fr (no drill chevron). */
const TERMINAL_L2_SUBCATEGORY_IDS = new Set([
  'coach-women-view-all',
  'coach-women-new-arrivals-label',
  'coach-women-bag-straps-charms-label',
  'coach-women-luxury-accessories',
  'coach-women-sale',
  'coach-men-view-all',
  'coach-mens-new-arrivals-label',
  'coach-men-luxury-accessories',
  'coach-men-sale',
])

export function isTerminalL2SubCategory(id?: string): boolean {
  return id ? TERMINAL_L2_SUBCATEGORY_IDS.has(id) : false
}

export function shouldShowNavLinkChevron(label: string, id?: string): boolean {
  if (isTerminalL2SubCategory(id)) return false
  return !isViewAllNavLink(label, id)
}

export function shouldDrillNavLink(label: string, id?: string): boolean {
  if (isTerminalL2SubCategory(id)) return false
  return !isViewAllNavLink(label, id)
}
