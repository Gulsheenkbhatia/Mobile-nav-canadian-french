import React from 'react'
import { render } from 'test-utils/react'
import TabsButton from './index'

jest.mock('react-intl', () => {
  const actual = jest.requireActual('react-intl')
  return {
    ...actual,
    useIntl: jest.fn().mockReturnValue({
      formatMessage: jest.fn(),
    }),
  }
})

describe('TabsButton', () => {
  const mockTabsData = ['US', 'EU']
  const mockStyles = {
    countryTabs: jest.fn(),
  }
  const mockTranslationGroup = 'pdp.country'
  const mockActiveTabIndex = 0
  const mockOnTabChange = jest.fn()

  it('renders without errors', () => {
    render(
      <TabsButton
        tabsData={mockTabsData}
        styles={mockStyles}
        translationGroup={mockTranslationGroup}
        activeTabIndex={mockActiveTabIndex}
        onTabChange={mockOnTabChange}
      />
    )
  })

  it('renders the correct number of tabs', () => {
    const { getAllByRole } = render(
      <TabsButton
        tabsData={mockTabsData}
        styles={mockStyles}
        translationGroup={mockTranslationGroup}
        activeTabIndex={mockActiveTabIndex}
        onTabChange={mockOnTabChange}
      />
    )
    const tabs = getAllByRole('tab')
    expect(tabs.length).toBe(mockTabsData.length)
  })

  it('calls setTabIndex when a tab is clicked', async () => {
    const { user, getAllByRole } = render(
      <TabsButton
        tabsData={mockTabsData}
        styles={mockStyles}
        translationGroup={mockTranslationGroup}
        activeTabIndex={mockActiveTabIndex}
        onTabChange={mockOnTabChange}
      />
    )
    const tabs = getAllByRole('tab')
    await user.click(tabs[1])
    expect(mockOnTabChange).toHaveBeenCalledWith(1)
  })
})
