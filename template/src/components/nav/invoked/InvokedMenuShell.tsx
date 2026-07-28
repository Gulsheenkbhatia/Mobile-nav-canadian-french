import { useRef, type ReactNode, type RefObject } from 'react'
import { MobileMenuTabs } from '../MobileMenuTabs'
import { useNavBrand } from '../NavBrandContext'
import { SearchIcon16 } from '../HeaderIcons'
import type { BrandId } from '../NavSearchExposed'

export type InvokedMenuShellRenderProps = {
  menuBrand: BrandId
  menuBodyRef: RefObject<HTMLDivElement>
}

export type InvokedMenuShellProps = {
  open: boolean
  onClose: () => void
  showSearch?: boolean
  panelClassName?: string
  'aria-label'?: string
  children: (props: InvokedMenuShellRenderProps) => ReactNode
}

import { navMessages } from '../../../locales'

export function InvokedMenuShell({
  open,
  onClose,
  showSearch = false,
  panelClassName = '',
  'aria-label': ariaLabel = navMessages.shopNavigation,
  children,
}: InvokedMenuShellProps) {
  const { activeBrand, setActiveBrand } = useNavBrand()
  const menuBodyRef = useRef<HTMLDivElement>(null)

  const handleMenuBrandChange = (brand: BrandId) => {
    if (brand === activeBrand) return
    setActiveBrand(brand)
  }

  return (
    <nav
      aria-label={ariaLabel}
      aria-hidden={!open}
      className={`invoked-menu ${open ? 'invoked-menu--open' : 'invoked-menu--closed'} ${panelClassName}`.trim()}
    >
      <div ref={menuBodyRef} className="invoked-menu__body">
        <div className="invoked-menu__header">
          <MobileMenuTabs
            activeBrand={activeBrand}
            onBrandChange={handleMenuBrandChange}
            onClose={onClose}
          />

          {showSearch && (
            <div className="invoked-menu__search-wrap">
              <label className="invoked-menu__search">
                <span className="invoked-menu__search-icon">
                  <SearchIcon16 />
                </span>
                <input
                  type="search"
                  className="invoked-menu__search-input"
                  placeholder={navMessages.search}
                  aria-label={navMessages.searchAria}
                  readOnly
                />
              </label>
            </div>
          )}
        </div>

        {children({ menuBrand: activeBrand, menuBodyRef })}
      </div>
    </nav>
  )
}
