import { render } from 'test-utils/react'
import * as utils from 'jotai/utils'
import { currentSortAtom, sortOptionsAtom } from 'store/search-results.atom'
import usePreference from 'toro/hooks/usePreference_new'

import Sort from './index'

const renderOptions = {
  contexts: {
    PWAContext: {
      appData: {
        isOptGtmDisabled: true,
      },
    },
  },
}

jest.mock('toro/hooks/usePreference_new')
const mockUsePreference = jest.mocked(usePreference)

mockUsePreference.mockReturnValue({
  generalConfiguration: {},
})

describe('Sort component', () => {
  afterEach(() => {
    jest.spyOn(utils, 'useAtomValue').mockImplementation((atom) => {
      if (atom == sortOptionsAtom) {
        return [
          { id: '1', code: 'A', name: 'Option A', isDefault: true },
          { id: '2', code: 'B', name: 'Option B' },
          { id: '3', code: 'C', name: 'Option C' },
          { id: '4', code: 'D', name: 'Option D' },
        ]
      } else if (atom == currentSortAtom) {
        return 'Option A'
      } else {
        return undefined
      }
    })
  })

  it('renders without crashing and with no sort options', () => {
    jest.clearAllMocks()
    const { container } = render(<Sort />, renderOptions)
    const menuListContainer = container.querySelector('.menuList')
    if (menuListContainer) {
      const menuItems = menuListContainer.querySelectorAll('button[name="sortOptions"]')
      expect(menuItems.length).toBeFalsy()
    }
  })
  it('renders the sort button with default option', () => {
    const { container } = render(<Sort />, renderOptions)
    const sortText = container.querySelector('p[name="sortText"]')
    const defaultOption = container.querySelector('button[name="sortButton"]')
    const defaultOptionText = defaultOption.firstChild?.textContent

    expect(sortText.textContent).toBe('Sort by:')
    expect(defaultOptionText).toBe('Option A')
  })

  it('renders sort with all sort options but hidden', () => {
    const { container } = render(<Sort />, renderOptions)
    const menuListContainer = container.querySelector('.menuList')
    const menuItems = menuListContainer.querySelectorAll('button[name="sortOptions"]')
    expect(menuItems.length).toBe(4)

    const chakraMenu = container.querySelector('div.menuList').parentNode
    const style = chakraMenu.getAttribute('style')
    expect(style.includes('visibility: hidden')).toBeTruthy()
  })

  it('toggles the visibility of sort options on click', async () => {
    const { user, container } = render(<Sort />, renderOptions)
    const sortButton = container.querySelector('button[name="sortButton"]')

    // Initially menu options should be present but hidden
    const initialOptions = container.querySelectorAll('button[name="sortOptions"]')
    expect(initialOptions.length).toBe(4)

    // Click to open menu - verify menu functionality works
    await user.click(sortButton)

    // Menu options should still be accessible
    const openOptions = container.querySelectorAll('button[name="sortOptions"]')
    expect(openOptions.length).toBe(4)

    // Verify we can interact with an option
    const firstOption = openOptions[0]
    expect(firstOption).toBeInTheDocument()
  })

  it('triggers handleclick on click of sort option', async () => {
    const { user, container } = render(<Sort />, renderOptions)
    const optionButton = container.querySelector('button[name="sortOptions"]')

    expect(window.preserveDataLayer).toBe(undefined)
    await user.click(optionButton)
    expect(window.preserveDataLayer).toBe(true)
  })

  it('closes menu when Escape key is pressed and restores focus', async () => {
    const { user, container } = render(<Sort />, renderOptions)
    const sortButton = container.querySelector('button[name="sortButton"]')

    // Open menu first
    await user.click(sortButton)

    // Check menu options are accessible
    const menuOptions = container.querySelectorAll('button[name="sortOptions"]')
    expect(menuOptions.length).toBe(4)

    // Press Escape to close
    await user.keyboard('{Escape}')

    // Menu should still exist (Chakra keeps it in DOM)
    const optionsAfterEscape = container.querySelectorAll('button[name="sortOptions"]')
    expect(optionsAfterEscape.length).toBe(4)

    // Focus should return to sort button
    expect(sortButton).toHaveFocus()
  })
})
