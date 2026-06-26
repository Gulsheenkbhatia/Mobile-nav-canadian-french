import { toNavHeadlineCase } from './toNavHeadlineCase'

function normalizeNavLabel(label: string): string {
  return toNavHeadlineCase(label).trim().toLowerCase()
}

/** True when a link row repeats the drill headline (L2/L3). */
export function isDuplicateNavLinkLabel(
  linkLabel: string,
  screenTitle: string,
): boolean {
  return normalizeNavLabel(linkLabel) === normalizeNavLabel(screenTitle)
}

export function filterDuplicateNavLinks<T extends { label: string }>(
  links: T[],
  screenTitle: string,
): T[] {
  return links.filter(
    (link) => !isDuplicateNavLinkLabel(link.label, screenTitle),
  )
}
