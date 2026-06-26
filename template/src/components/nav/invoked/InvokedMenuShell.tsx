import { useEffect, useRef, useState, type ReactNode, type RefObject } from 'react'
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

export function InvokedMenuShell({
  open,
  onClose,
  showSearch = false,
  panelClassName = '',
  'aria-label': ariaLabel = 'Shop navigation',
  children,
}: InvokedMenuShellProps) {
  const { activeBrand } = useNavBrand()
  const [menuBrand, setMenuBrand] = useState<BrandId>('coach')
  const menuBodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    setMenuBrand(activeBrand)
  }, [open, activeBrand])

  const handleMenuBrandChange = (brand: BrandId) => {
    setMenuBrand(brand)
  }

  const handleClose = () => {
    setMenuBrand(activeBrand)
    onClose()
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
            activeBrand={menuBrand}
            onBrandChange={handleMenuBrandChange}
            onClose={handleClose}
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
                  placeholder="Search"
                  aria-label="Search"
                  readOnly
                />
              </label>
            </div>
          )}
        </div>

        {children({ menuBrand, menuBodyRef })}
      </div>
    </nav>
  )
}
