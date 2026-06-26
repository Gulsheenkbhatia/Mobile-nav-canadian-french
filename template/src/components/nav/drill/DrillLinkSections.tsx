import type { MenuLinkSection } from '../../../data/mobileMenuData'
import {
  shouldShowSectionEyebrow,
  type NavEyebrowContext,
} from '../../../data/navEyebrowVisibility'
import { filterDuplicateNavLinks } from '../../../utils/navLinkDedup'
import { isViewAllNavLink } from '../../../utils/navLinkChevron'
import { toNavHeadlineCase } from '../../../utils/toNavHeadlineCase'
import {
  NavEnterGroup,
  getNavLinkEnterPreset,
  type NavAnimDirection,
} from '../v3/NavEnter'

type DrillLinkSectionsProps = {
  sections: MenuLinkSection[]
  className?: string
  depth: NavEyebrowContext['depth']
  screenTitle: string
  animDirection: NavAnimDirection
  mountKey: string
}

/** L2/L3 flat link lists — one or more sections with 32px between groups. */
export function DrillLinkSections({
  sections,
  className = 'v3-l2__sections',
  depth,
  screenTitle,
  animDirection,
  mountKey,
}: DrillLinkSectionsProps) {
  const ctx: NavEyebrowContext = {
    depth,
    screenTitle,
    sectionCount: sections.length,
  }

  const sectionBlocks = sections
    .map((section) => {
      const showEyebrow =
        shouldShowSectionEyebrow(section, ctx) && section.eyebrow
      const visibleLinks = filterDuplicateNavLinks(section.links, screenTitle)
      if (visibleLinks.length === 0) return null

      const rows: Array<
        | { type: 'eyebrow'; key: string; label: string }
        | { type: 'link'; key: string; link: (typeof visibleLinks)[number] }
      > = []

      if (showEyebrow && section.eyebrow) {
        rows.push({
          type: 'eyebrow',
          key: `eyebrow-${section.id}`,
          label: section.eyebrow,
        })
      }

      visibleLinks.forEach((link) => {
        rows.push({ type: 'link', key: link.id, link })
      })

      return { section, rows }
    })
    .filter((block): block is NonNullable<typeof block> => block !== null)

  if (sectionBlocks.length === 0) return null

  const phase = animDirection === 'exit' ? 'exit' : 'enter'
  const preset = getNavLinkEnterPreset('drill', phase)
  let staggerOffset = 0

  return (
    <div className={className}>
      {sectionBlocks.map(({ section, rows }) => {
        const animatedCount = rows.filter((row) => row.type === 'link').length
        const delay = preset.delay + staggerOffset * preset.stagger
        staggerOffset += phase === 'exit' ? animatedCount : rows.length

        return (
          <NavEnterGroup
            key={`${mountKey}-${section.id}`}
            as="ul"
            list
            delay={delay}
            stagger={preset.stagger}
            variant={preset.variant}
            direction={animDirection}
            className="v3-l2__section v3-l2__links"
          >
            {rows.map((row) => {
              if (row.type === 'eyebrow') {
                return (
                  <li
                    key={row.key}
                    className="v3-l2__eyebrow-item nav-enter-group__item--static"
                  >
                    <p className="v3-l2__eyebrow">{toNavHeadlineCase(row.label)}</p>
                  </li>
                )
              }

              return (
                <li key={row.key}>
                  <button
                    type="button"
                    onClick={(e) => {
                      if (
                        row.link.href ||
                        isViewAllNavLink(row.link.label, row.link.id)
                      ) {
                        e.preventDefault()
                        return
                      }
                      e.preventDefault()
                    }}
                    className="v1-nav-link block w-full text-left font-extended text-[20px] leading-[1.2] tracking-[0.4px] text-coach-black"
                  >
                    <span>{toNavHeadlineCase(row.link.label)}</span>
                  </button>
                </li>
              )
            })}
          </NavEnterGroup>
        )
      })}
    </div>
  )
}
