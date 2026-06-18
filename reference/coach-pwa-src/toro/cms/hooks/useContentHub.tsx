import { useCallback, useEffect, useRef } from 'react'

export const CONTENT_HUB_HTML_IDENTIFIER = '.mol-content-hub, .mol-content-hub-v2'

export function initContentHub(contentHubElement: HTMLElement, isDesktop: boolean): () => void {
  if (!contentHubElement || contentHubElement.dataset.init === 'true') {
    return () => {}
  }

  const seeMoreButtons: HTMLButtonElement[] = Array.from(
    contentHubElement.querySelectorAll<HTMLButtonElement>('.content-hub-v2__see-more-trigger')
  )
  const seeMoreClickHandlers: Array<{ button: HTMLButtonElement; handler: (ev: Event) => void }> =
    []

  seeMoreButtons.forEach((button) => {
    const handler = (ev: Event): void => {
      ev.preventDefault()
      const cardsSection = button.closest('.content-hub-v2__article-cards-section')
      if (!cardsSection) return

      const perClickAttr = isDesktop
        ? 'data-cards-per-click-desktop'
        : 'data-cards-per-click-mobile'
      const perClickValue = cardsSection.getAttribute(perClickAttr)
      let increment = parseInt(perClickValue || '3', 10)
      if (Number.isNaN(increment) || increment < 1) {
        increment = 3
      }

      const hiddenCards: HTMLElement[] = Array.from(
        cardsSection.querySelectorAll<HTMLElement>(
          '.content-hub-v2__article-card[data-hidden="true"]'
        )
      )

      const cardsToReveal = hiddenCards.slice(0, increment)
      cardsToReveal.forEach((card) => {
        card.removeAttribute('data-hidden')
      })

      if (cardsToReveal.length > 0) {
        const first = cardsToReveal[0]
        const focusable = first.querySelector<HTMLElement>(
          'a, button, [tabindex]:not([tabindex="-1"])'
        )
        if (focusable) {
          focusable.focus()
        } else {
          if (!first.hasAttribute('tabindex')) {
            first.setAttribute('tabindex', '-1')
          }
          first.focus()
        }
      }

      const remainingHidden: HTMLElement[] = Array.from(
        cardsSection.querySelectorAll<HTMLElement>(
          '.content-hub-v2__article-card[data-hidden="true"]'
        )
      )

      if (remainingHidden.length === 0) {
        const btnWrapper = button.closest('.content-hub-v2__see-more-btn')
        btnWrapper?.classList.add('see-more--hidden')
      }
    }

    button.addEventListener('click', handler)
    seeMoreClickHandlers.push({ button, handler })
  })

  const navigationLinks: HTMLButtonElement[] = Array.from(
    contentHubElement.querySelectorAll('.nav-link')
  )

  if (!navigationLinks.length) {
    contentHubElement.dataset.init = 'true'
    return (): void => {
      seeMoreClickHandlers.forEach(({ button, handler }) => {
        button.removeEventListener('click', handler)
      })
      delete contentHubElement.dataset.init
    }
  }

  let currentIndex: number = navigationLinks.findIndex((link) => link.classList.contains('active'))
  if (currentIndex === -1) {
    currentIndex = 0
    const firstLink = navigationLinks[0]
    const targetId = firstLink.getAttribute('data-bs-target')
    if (targetId) {
      const target = contentHubElement.querySelector(targetId)
      firstLink.classList.add('active')
      firstLink.setAttribute('aria-selected', 'true')
      target?.classList.add('active', 'show')
      firstLink.closest('.nav-item')?.classList.add('active')

      const mobileDropdown = contentHubElement.querySelector('.mobile-dropdown')
      const selectedValue = mobileDropdown?.querySelector('.selected-value')

      if (selectedValue && !selectedValue.textContent?.trim()) {
        selectedValue.textContent = firstLink.textContent?.trim() || ''
      }

      const dropdownOptions = contentHubElement.querySelectorAll('.dropdown-option')
      const hasSelectedOption = Array.from(dropdownOptions).some((opt) =>
        opt.classList.contains('selected')
      )

      if (!hasSelectedOption && dropdownOptions.length > 0) {
        const matchingOption = Array.from(dropdownOptions).find(
          (option) => option.getAttribute('data-target') === targetId
        )
        if (matchingOption) {
          matchingOption.classList.add('selected')
        }
      }
    }
  }

  const updateStickyPosition = (): void => {
    const headerBar = document.querySelector('.headroom')
    const stickyElements = contentHubElement.querySelectorAll(
      '.desktop-tab-nav, .mobile-tab-dropdown, .content-hub-v2__desktop-tabs, .content-hub-v2__mobile-dropdown'
    )

    if (headerBar && stickyElements.length > 0) {
      const isPinned = headerBar.classList.contains('headroom--pinned')
      const stickyTop = isPinned ? (isDesktop ? '144px' : '48px') : '0px'

      stickyElements.forEach((element: Element) => {
        const htmlElement = element as HTMLElement
        htmlElement.style.transition = '0.2s ease-in-out'
        htmlElement.style.transform = 'translate3d(0px, 0px, 0px)'
        htmlElement.style.top = stickyTop
      })
    }
  }

  let handleStickyUpdate: (() => void) | null = null
  let mutationObserver: MutationObserver | null = null

  const initializeStickyBehavior = (): void => {
    handleStickyUpdate = (): void => {
      updateStickyPosition()
    }
    updateStickyPosition()
    window.addEventListener('scroll', handleStickyUpdate, { passive: true })
    window.addEventListener('resize', handleStickyUpdate, { passive: true })

    const headerBar = document.querySelector('.headroom')
    if (headerBar) {
      mutationObserver = new MutationObserver(handleStickyUpdate)
      mutationObserver.observe(headerBar, {
        attributes: true,
        attributeFilter: ['class'],
      })
    }
  }

  const cleanUpActiveElements = (): void => {
    navigationLinks.forEach((link) => {
      link.classList.remove('active')
      link.setAttribute('aria-selected', 'false')
    })

    const navItems = contentHubElement.querySelectorAll('.nav-item')
    navItems.forEach((item) => item.classList.remove('active'))

    const tabPanes = contentHubElement.querySelectorAll('.tab-pane')
    tabPanes.forEach((pane) => pane.classList.remove('active', 'show'))
  }

  const handleTabSwitch = (tabLinkEl: HTMLButtonElement): void => {
    const isActive = tabLinkEl.classList.contains('active')
    if (isActive) return

    const targetElementId = tabLinkEl.getAttribute('data-bs-target')
    if (!targetElementId) return

    const targetElement = contentHubElement.querySelector(targetElementId)
    if (!targetElement) return

    cleanUpActiveElements()

    targetElement.classList.add('active', 'show')
    tabLinkEl.classList.add('active')
    tabLinkEl.setAttribute('aria-selected', 'true')
    tabLinkEl.closest('.nav-item')?.classList.add('active')
    const newIndex = navigationLinks.indexOf(tabLinkEl)
    if (newIndex !== -1) {
      currentIndex = newIndex
    }
    const mobileDropdown = contentHubElement.querySelector('.mobile-dropdown')
    const selectedValue = mobileDropdown?.querySelector('.selected-value')
    if (selectedValue) {
      selectedValue.textContent = tabLinkEl.textContent?.trim() || ''
    }
    const dropdownOptions = contentHubElement.querySelectorAll('.dropdown-option')
    dropdownOptions.forEach((option) => {
      option.classList.remove('selected')
      if (option.getAttribute('data-target') === targetElementId) {
        option.classList.add('selected')
      }
    })
  }

  const handleDesktopTabClick = (ev: Event): void => {
    const link = (ev.target as HTMLElement).closest<HTMLButtonElement>('.nav-link')
    if (!link) return
    ev.preventDefault()
    handleTabSwitch(link)
  }

  let handleDropdownClick: ((ev: Event) => void) | null = null
  let handleOptionClick: ((ev: Event) => void) | null = null
  let handleOutsideClick: (() => void) | null = null

  const mobileDropdown = contentHubElement.querySelector('.mobile-dropdown')
  const dropdownButton = contentHubElement.querySelector('.dropdown-button')
  const dropdownMenu = contentHubElement.querySelector('.dropdown-menu')

  if (mobileDropdown && dropdownButton && dropdownMenu) {
    handleDropdownClick = (ev: Event): void => {
      ev.stopPropagation()
      mobileDropdown.classList.toggle('open')
    }

    handleOptionClick = (ev: Event): void => {
      const option = ev.target as HTMLElement
      if (!option.classList.contains('dropdown-option')) return
      const targetId = option.getAttribute('data-target')
      const text = option.textContent?.trim()
      if (!targetId) return
      const selectedValue = dropdownButton.querySelector('.selected-value')
      if (selectedValue && text) selectedValue.textContent = text
      dropdownMenu
        .querySelectorAll('.dropdown-option')
        .forEach((opt) => opt.classList.remove('selected'))
      option.classList.add('selected')
      const correspondingTab = navigationLinks.find(
        (link: HTMLButtonElement) => link.getAttribute('data-bs-target') === targetId
      )
      if (correspondingTab) handleTabSwitch(correspondingTab)
      mobileDropdown.classList.remove('open')
    }

    handleOutsideClick = (): void => {
      mobileDropdown.classList.remove('open')
    }

    dropdownButton.addEventListener('click', handleDropdownClick)
    dropdownMenu.addEventListener('click', handleOptionClick)
    document.addEventListener('click', handleOutsideClick)
  }

  const nav = contentHubElement.querySelector('.nav')
  nav?.addEventListener('click', handleDesktopTabClick)

  initializeStickyBehavior()

  contentHubElement.dataset.init = 'true'

  return (): void => {
    nav?.removeEventListener('click', handleDesktopTabClick)
    if (handleDropdownClick && dropdownButton) {
      dropdownButton.removeEventListener('click', handleDropdownClick)
    }
    if (handleOptionClick && dropdownMenu) {
      dropdownMenu.removeEventListener('click', handleOptionClick)
    }
    if (handleOutsideClick) {
      document.removeEventListener('click', handleOutsideClick)
    }

    if (handleStickyUpdate) {
      window.removeEventListener('scroll', handleStickyUpdate)
      window.removeEventListener('resize', handleStickyUpdate)
    }

    if (mutationObserver) {
      mutationObserver.disconnect()
    }

    seeMoreClickHandlers.forEach(({ button, handler }) => {
      button.removeEventListener('click', handler)
    })

    const stickyElements = contentHubElement.querySelectorAll(
      '.desktop-tab-nav, .mobile-tab-dropdown, .content-hub-v2__desktop-tabs, .content-hub-v2__mobile-dropdown'
    )
    stickyElements.forEach((element: Element) => {
      const htmlElement = element as HTMLElement
      htmlElement.style.top = '0px'
    })

    delete contentHubElement.dataset.init
  }
}

export const useContentHub = (isDesktop: boolean) => {
  const cleanupsRef = useRef<Array<() => void>>([])
  const initializeNode = useCallback(
    (node: HTMLElement) => {
      if (!node) return
      const contentHubs: HTMLElement[] = Array.from(
        node.querySelectorAll<HTMLElement>(CONTENT_HUB_HTML_IDENTIFIER)
      )
      if (node.matches(CONTENT_HUB_HTML_IDENTIFIER)) {
        contentHubs.push(node)
      }
      const uniqueContentHubs = Array.from(new Set(contentHubs))
      const newCleanups = uniqueContentHubs.map((el) => initContentHub(el, isDesktop))
      cleanupsRef.current.push(...newCleanups)
    },
    [isDesktop]
  )

  useEffect(() => {
    const allCleanups = cleanupsRef.current
    return () => {
      allCleanups.forEach((clean) => clean?.())
      cleanupsRef.current = []
    }
  }, [])

  return initializeNode
}
