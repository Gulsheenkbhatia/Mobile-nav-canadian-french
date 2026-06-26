import { BrandTabList } from './BrandTabList'
import { CloseMenuIconWhite } from './HeaderIcons'
import type { BrandId } from './NavSearchExposed'

type MobileMenuTabsProps = {
  activeBrand: BrandId
  onBrandChange: (brand: BrandId) => void
  onClose: () => void
}

/** Flyout menu header — brand toggles + close X. */
export function MobileMenuTabs({
  activeBrand,
  onBrandChange,
  onClose,
}: MobileMenuTabsProps) {
  return (
    <div className="mobile-menu-tabs" data-qa="mobile_menu_tabs">
      <BrandTabList
        activeBrand={activeBrand}
        onBrandChange={onBrandChange}
        className="mobile-menu-tabs__tab-list nav-exposed__tabs"
      />
      <button
        type="button"
        className="mobile-menu-tabs__close"
        aria-label="Close menu"
        data-qa="m_btn_hamburger_close_x"
        onClick={onClose}
      >
        <CloseMenuIconWhite />
      </button>
    </div>
  )
}
