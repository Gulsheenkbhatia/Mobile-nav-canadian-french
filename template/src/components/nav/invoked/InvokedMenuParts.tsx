import { CoachIconMask } from '../../CoachIconMask'
import { CoachtopiaLogo, isCoachtopiaCategory } from '../CoachLogos'
import type { MenuCategoryDetail } from '../../../data/mobileMenuData'
import { shouldShowSectionEyebrow } from '../../../data/navEyebrowVisibility'
import { formatDrillTitle } from '../../../utils/navDrillTitle'
import { formatNavLabel } from '../../../utils/toNavHeadlineCase'
import { navMessages } from '../../../locales'
import { shouldShowNavLinkChevron } from '../../../utils/navLinkChevron'

const ICONS = {
  chevronLeft: '/assets/icons/chevron-left.svg',
  chevronRight: '/assets/icons/chevron-right.svg',
}

export function MenuL1List({
  categories,
  onSelect,
  showChevron = true,
}: {
  categories: { id: string; label: string }[]
  onSelect?: (id: string) => void
  showChevron?: boolean
}) {
  return (
    <div className="invoked-menu__l1">
      <ul className="invoked-menu__l1-list">
        {categories.map((item) => (
          <li key={item.id} className="invoked-menu__l1-item">
            <button
              type="button"
              className={`v1-nav-link invoked-menu__l1-link invoked-menu__l1-link--compact invoked-menu__l1-link--row`}
              onClick={() => onSelect?.(item.id)}
            >
              <span>
                {isCoachtopiaCategory(item.id) ? (
                  <CoachtopiaLogo height={20} />
                ) : (
                  formatNavLabel(item.label)
                )}
              </span>
              {showChevron && shouldShowNavLinkChevron(item.label, item.id) && (
                <CoachIconMask src={ICONS.chevronRight} size={16} />
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function MenuL2Drilldown({
  category,
  onBack,
}: {
  category: MenuCategoryDetail
  onBack: () => void
}) {
  return (
    <div className="invoked-menu__l2">
      <div className="invoked-menu__l2-header">
        <button
          type="button"
          className="invoked-menu__l2-back"
          aria-label={navMessages.backToMainMenu}
          onClick={onBack}
        >
          <CoachIconMask src={ICONS.chevronLeft} size={20} />
        </button>
        <h2
          className="v1-nav-link invoked-menu__l2-title"
          title={formatNavLabel(category.label)}
        >
          {formatDrillTitle(category.label)}
        </h2>
        <button
          type="button"
          className="invoked-menu__l2-forward"
          aria-hidden
          tabIndex={-1}
        >
          <CoachIconMask src={ICONS.chevronRight} size={20} />
        </button>
      </div>

      {category.sections?.map((section) => {
        const ctx = {
          depth: 'l2' as const,
          screenTitle: category.label,
          sectionCount: category.sections?.length ?? 0,
        }

        return (
          <div key={section.id} className="invoked-menu__section">
            {shouldShowSectionEyebrow(section, ctx) && section.eyebrow && (
              <p className="invoked-menu__eyebrow type-eyebrow">
                {formatNavLabel(section.eyebrow)}
              </p>
            )}
            <ul className="invoked-menu__links">
              {section.links.map((link) => (
                <li key={link.id}>
                  <button type="button" className="v1-nav-link invoked-menu__link">
                    {formatNavLabel(link.label)}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )
      })}
    </div>
  )
}
