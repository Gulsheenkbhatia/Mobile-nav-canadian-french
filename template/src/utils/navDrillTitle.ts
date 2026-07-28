import { formatNavLabel } from './toNavHeadlineCase'

/** Max visible drill headline characters before ellipsis (375px mobile nav). */
export const NAV_DRILL_TITLE_MAX_CHARS = 34

export function formatDrillTitle(title: string): string {
  const formatted = formatNavLabel(title)

  if (formatted.length <= NAV_DRILL_TITLE_MAX_CHARS) {
    return formatted
  }

  return `${formatted.slice(0, NAV_DRILL_TITLE_MAX_CHARS - 1).trimEnd()}…`
}
