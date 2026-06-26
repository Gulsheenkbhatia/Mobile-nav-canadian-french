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

export function shouldShowNavLinkChevron(label: string, id?: string): boolean {
  return !isViewAllNavLink(label, id)
}

export function shouldDrillNavLink(label: string, id?: string): boolean {
  return !isViewAllNavLink(label, id)
}
