import { useEffect, useState } from 'react'
import debounce from 'lodash/debounce'

const DROPDOWN_TAB_SELECTOR = '[data-dropdown-label]'
const DROPDOWN_TRIGGER_SELECTOR = '[data-dropdown-trigger]'
const DROPDOWN_MENU_SELECTOR = '[dropdown-menu]'
const DROPDOWN_SELECTOR = '[data-dropdown]'
const DROPDOWN_HOVER_AREA_SELECTOR = '[data-dropdown-hover-area]'

const toggleDropdownVisibility = (
  dropdownMenu: HTMLElement,
  dropdownContainer: HTMLElement,
  show?: boolean
) => {
  const isHidden = dropdownMenu.classList.contains('d-none')
  if (show === true && isHidden) {
    dropdownMenu.classList.remove('d-none')
    dropdownContainer.classList.add('dropdown-open')
  } else if (show === false && !isHidden) {
    dropdownMenu.classList.add('d-none')
    dropdownContainer.classList.remove('dropdown-open')
  } else if (show === undefined) {
    dropdownMenu.classList.toggle('d-none')
    dropdownContainer.classList.toggle('dropdown-open', isHidden)
  }
}

const closeOtherDropdowns = (
  parentNode: ParentNode,
  currentDropdownContainer: HTMLElement | null = null
) => {
  const openDropdowns = Array.from(
    parentNode.querySelectorAll(`${DROPDOWN_SELECTOR}.dropdown-open`)
  ) as HTMLElement[]

  openDropdowns.forEach((openContainer) => {
    if (openContainer !== currentDropdownContainer) {
      const openMenu = openContainer.querySelector(DROPDOWN_MENU_SELECTOR)
      if (openMenu instanceof HTMLElement) {
        toggleDropdownVisibility(openMenu, openContainer, false)
      }
    }
  })
}

function dropdownToggle(parentNode: ParentNode | null, isDesktop: boolean): (() => void) | void {
  if (!parentNode) return

  const handleDropdownClick = (e: MouseEvent) => {
    if (isDesktop) return

    const currentElement = e.currentTarget
    if (!(currentElement instanceof HTMLElement)) return

    const dropdownContainer = currentElement.closest(DROPDOWN_SELECTOR)
    if (!(dropdownContainer instanceof HTMLElement)) return

    const dropdownMenu = dropdownContainer.querySelector(DROPDOWN_MENU_SELECTOR)
    if (!(dropdownMenu instanceof HTMLElement)) return

    e.stopPropagation()
    closeOtherDropdowns(parentNode, dropdownContainer)

    if (!dropdownMenu.classList.contains('d-none')) {
      toggleDropdownVisibility(dropdownMenu, dropdownContainer, false)
    } else {
      toggleDropdownVisibility(dropdownMenu, dropdownContainer, true)
    }
  }

  const handleMouseEnter = (e: MouseEvent) => {
    if (!isDesktop) return
    const dropdownContainer = (e.currentTarget as HTMLElement).closest(DROPDOWN_SELECTOR)
    if (!(dropdownContainer instanceof HTMLElement)) return

    const dropdownMenu = dropdownContainer.querySelector(DROPDOWN_MENU_SELECTOR)
    if (!(dropdownMenu instanceof HTMLElement)) return
    toggleDropdownVisibility(dropdownMenu, dropdownContainer, true)
  }

  const handleMouseLeave = (e: MouseEvent) => {
    if (!isDesktop) return

    const relatedTarget = e.relatedTarget as Node | null
    if (relatedTarget && (e.currentTarget as HTMLElement).contains(relatedTarget)) {
      return
    }

    const dropdownContainer = (e.currentTarget as HTMLElement).closest(DROPDOWN_SELECTOR)
    if (!(dropdownContainer instanceof HTMLElement)) return

    const dropdownMenu = dropdownContainer.querySelector(DROPDOWN_MENU_SELECTOR)
    if (!(dropdownMenu instanceof HTMLElement)) return
    toggleDropdownVisibility(dropdownMenu, dropdownContainer, false)
  }

  const handleDocumentClick = debounce((e: MouseEvent) => {
    const target = e.target as HTMLElement
    if (!target.closest(DROPDOWN_TRIGGER_SELECTOR)) {
      closeOtherDropdowns(parentNode)
    }
  }, 300)

  const handleMenuItemClick = (e: MouseEvent) => {
    const menuItem = e.currentTarget as HTMLElement
    if (!menuItem) return

    const dropdownContainer = menuItem.closest(DROPDOWN_SELECTOR)
    if (!(dropdownContainer instanceof HTMLElement)) return

    const dropdownMenu = dropdownContainer.querySelector(DROPDOWN_MENU_SELECTOR)
    if (!(dropdownMenu instanceof HTMLElement)) return

    const dropdownLabel = dropdownContainer.querySelector(DROPDOWN_TAB_SELECTOR)

    if (dropdownLabel) {
      dropdownLabel.textContent = menuItem.textContent?.trim() || ''
    }

    const targetId = menuItem.getAttribute('data-target')
    if (targetId) {
      const tabbedComponent = dropdownContainer.closest('.mol-tabbed-content')
      if (!tabbedComponent) return

      const tabPane = tabbedComponent.querySelector(targetId)
      if (tabPane instanceof HTMLElement) {
        tabbedComponent.querySelectorAll('.tab-content .tab-pane').forEach((pane) => {
          pane.classList.remove('active', 'show')
        })
        tabbedComponent.querySelectorAll('.nav-link').forEach((link) => {
          link.classList.remove('active')
        })
        tabPane.classList.add('active', 'show')
        menuItem.classList.add('active')
      }
    }
    toggleDropdownVisibility(dropdownMenu, dropdownContainer, false)
  }

  const triggers = Array.from(parentNode.querySelectorAll(DROPDOWN_TRIGGER_SELECTOR)).filter(
    (el): el is HTMLElement => el instanceof HTMLElement
  )
  triggers.forEach((trigger) => {
    trigger.addEventListener('click', handleDropdownClick)
  })

  const dropdownHoverArea = Array.from(
    parentNode.querySelectorAll(DROPDOWN_HOVER_AREA_SELECTOR)
  ).filter((el): el is HTMLElement => el instanceof HTMLElement)

  if (isDesktop) {
    dropdownHoverArea.forEach((area) => {
      area.addEventListener('mouseenter', handleMouseEnter)
      area.addEventListener('mouseleave', handleMouseLeave)
    })
  }

  const menuItems = Array.from(
    parentNode.querySelectorAll(`${DROPDOWN_SELECTOR} .nav-link, ${DROPDOWN_SELECTOR} a`)
  ).filter((el): el is HTMLElement => el instanceof HTMLElement)

  menuItems.forEach((item) => {
    item.addEventListener('click', handleMenuItemClick)
  })

  document.addEventListener('click', handleDocumentClick)

  return () => {
    triggers.forEach((trigger) => {
      trigger.removeEventListener('click', handleDropdownClick)
    })
    if (isDesktop) {
      dropdownHoverArea.forEach((area) => {
        area.removeEventListener('mouseenter', handleMouseEnter)
        area.removeEventListener('mouseleave', handleMouseLeave)
      })
    }
    menuItems.forEach((item) => {
      item.removeEventListener('click', handleMenuItemClick)
    })
    document.removeEventListener('click', handleDocumentClick)
    handleDocumentClick.cancel()
  }
}

const useDropdownToggle = (
  isDesktop: boolean
): {
  initializeDropdownToggle: (node: ParentNode | null) => void
} => {
  const [node, setNode] = useState<ParentNode | null>(null)

  useEffect(() => {
    if (!node) return
    const cleanup = dropdownToggle(node, isDesktop)
    return () => {
      if (cleanup) cleanup()
    }
  }, [node, isDesktop])

  return {
    initializeDropdownToggle: setNode,
  }
}

export { useDropdownToggle }
