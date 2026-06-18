import { useEffect, RefObject } from 'react'

interface UseSearchKeyboardNavigationParams {
  drawerRef: RefObject<HTMLElement>
  onClose?: () => void
}

export const useSearchKeyboardNavigation = ({
  drawerRef,
  onClose,
}: UseSearchKeyboardNavigationParams): void => {
  useEffect(() => {
    const drawer = drawerRef.current
    const searchInput = document.querySelector<HTMLInputElement>('#SearchInput')
    const searchWrapper = document.querySelector<HTMLElement>('[data-qa="d_hdr_search_wrapper"]')
    const closeBtn = document.querySelector<HTMLElement>('[data-qa="cm_icon_search_reset"]')

    if (!drawer || !searchWrapper || !searchInput) return

    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ]

    const getFocusableElements = (): HTMLElement[] => {
      const elements = Array.from(
        drawer.querySelectorAll<HTMLElement>(focusableSelectors.join(','))
      ).filter((el) => el.offsetParent !== null)
      return elements
    }

    searchWrapper.tabIndex = 0

    const handleKeyDown = (e: KeyboardEvent): void => {
      const focusableEls = getFocusableElements()
      if (!focusableEls.length) return

      const firstEl = focusableEls[0]
      const lastEl = focusableEls[focusableEls.length - 1]
      const active = document.activeElement
      const activeIndex = focusableEls.indexOf(active as HTMLElement)

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          if (active === searchInput) {
            firstEl.focus()
          } else if (activeIndex > -1 && activeIndex < focusableEls.length - 1) {
            focusableEls[activeIndex + 1].focus()
          } else if (active === lastEl) {
            searchWrapper.focus()
            onClose?.()
          }
          break

        case 'ArrowUp':
          e.preventDefault()
          if (activeIndex > 0) {
            focusableEls[activeIndex - 1].focus()
          } else if (active === firstEl) {
            searchInput.focus()
          } else if (active === searchWrapper) {
            lastEl.focus()
          }
          break

        case 'Tab':
          if (e.shiftKey && active === firstEl) {
            e.preventDefault()
            lastEl.focus()
          } else if (!e.shiftKey && active === lastEl) {
            e.preventDefault()
            searchWrapper.focus()
            onClose?.()
          }
          break

        case 'Escape':
          e.preventDefault()
          onClose?.()
          searchWrapper.focus()
          break

        default:
          break
      }
    }

    const handleWrapperKeyDown = (e: KeyboardEvent): void => {
      if (e.key === 'Enter' || e.key === ' ') {
        searchInput?.focus()
      }
    }

    const handleCloseKeyDown = (e: KeyboardEvent): void => {
      if (e.key === 'Enter' || e.key === ' ') {
        onClose?.()
        searchWrapper.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    searchWrapper.addEventListener('keydown', handleWrapperKeyDown)
    if (closeBtn) closeBtn.addEventListener('keydown', handleCloseKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      searchWrapper.removeEventListener('keydown', handleWrapperKeyDown)
      if (closeBtn) closeBtn.removeEventListener('keydown', handleCloseKeyDown)
    }
  }, [drawerRef, onClose])
}
