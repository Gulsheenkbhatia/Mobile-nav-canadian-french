import { useUpdateAtom } from 'jotai/utils'
import { render } from 'test-utils/react'
import useViewportType from 'toro/hooks/useViewportType'
import useExperiment from 'toro/hooks/useExperiment'
import useAnalytics from 'toro/analytics/useAnalytics'

import TabControl from 'toro/components/product/ProductVariationControls/NewMegaPDP/TabControl'

jest.mock('toro/hooks/useViewportType')
jest.mocked(useViewportType).mockImplementation(() => ({ isDesktop: true, isMobile: false }))
jest.mock('toro/hooks/useExperiment')
jest.mocked(useExperiment).mockImplementation(() => false)

jest.mock('jotai/utils')
const componentPropsSelectedTab = {
  selectedTab: {
    name: 'Leather',
    url: '/',
  },
  item: {
    name: 'Leather',
    tabId: 'size',
    url: '/',
  },
}
const componentPropsNonSelectedTab = {
  selectedTab: {
    name: 'Leather',
    url: '/',
  },
  item: {
    name: 'Cotton',
    tabId: 'size',
    url: '/cotton',
  },
}

jest.mock('react-intl', () => {
  const reactIntl = jest.requireActual('react-intl')
  const intl = reactIntl.createIntl({
    locale: 'en',
  })

  return {
    ...reactIntl,
    useIntl: () => intl,
  }
})

jest.mock('toro/hooks/useMultiStyleConfig', () => {
  return jest.fn(() => ({
    sizeVariationButton: {},
  }))
})

jest.mock('toro/analytics/useAnalytics', () => {
  return jest.fn(() => ({
    send: () => {},
  }))
})

const makeSetup = (props = {}) => {
  return render(<TabControl {...props} />, {
    contexts: {
      PWAContext: {
        appData: {},
      },
    },
  })
}

describe('Product Tab Control Test', () => {
  beforeEach(() => {
    useAnalytics.mockReturnValue({ send: jest.fn() })
  })

  it('Should render Tab without error', () => {
    makeSetup(componentPropsNonSelectedTab)
  })

  it('should match the test-id for Non Selected Tab', () => {
    const { getByTestId } = makeSetup({ ...componentPropsNonSelectedTab, selected: false })

    const NonSelectedTab = getByTestId('cm_link_size_swatch_enbld')
    expect(NonSelectedTab).toBeInTheDocument()
  })

  it('should match the test-id for Selected Tab', () => {
    const { getByTestId } = makeSetup({ ...componentPropsSelectedTab, selected: true })

    const SelectedTab = getByTestId('cm_link_size_swatch_slctd')
    expect(SelectedTab).toBeInTheDocument()
  })

  it('Calls setSelectedTab when a non-selected-tab is clicked it should click without error', async () => {
    const setSelectedTabsDataMock = jest.fn()
    useUpdateAtom.mockReturnValue(setSelectedTabsDataMock)
    const { user, getByText } = makeSetup({ ...componentPropsNonSelectedTab, selected: false })

    const NonSelectedTab = getByText('Cotton')
    await user.click(NonSelectedTab)
    expect(setSelectedTabsDataMock).toHaveBeenCalledWith(expect.any(Function))
  })

  it('should update correct tab data when tabId matches', async () => {
    const mockSetSelectedTabsData = jest.fn()
    useUpdateAtom.mockReturnValueOnce(jest.fn())
    useUpdateAtom.mockReturnValueOnce(mockSetSelectedTabsData)
    const { user, getByRole } = makeSetup({ ...componentPropsNonSelectedTab, selected: false })

    const button = getByRole('button', { name: 'Cotton' })
    await user.click(button)

    const prevSelectedTabsData = [
      { tabId: 'size', name: 'Tab one' },
      { tabId: 'def', name: 'Tab two' },
    ]

    const updatedTabs = mockSetSelectedTabsData.mock.calls[0][0](prevSelectedTabsData)
    expect(updatedTabs).toEqual([
      { tabId: 'size', name: 'Cotton' },
      { tabId: 'def', name: 'Tab two' },
    ])
  })

  it('should handle undefined tabId and name correctly in analytics event', async () => {
    const mockSetSelectedTabsData = jest.fn()
    useUpdateAtom.mockReturnValueOnce(jest.fn())
    useUpdateAtom.mockReturnValueOnce(mockSetSelectedTabsData)
    const { user, getByRole } = makeSetup({
      ...componentPropsNonSelectedTab,
      item: { tabId: undefined, name: undefined, url: '/cotton' },
      selected: false,
    })

    const button = getByRole('button')
    await user.click(button)

    expect(useAnalytics().send).toHaveBeenCalledWith('swatchInteraction', {
      eventAction: 'swatch click',
      eventLabel: undefined,
      eventLocation: 'mega product',
      swatchType: 'undefined',
      swatchValue: 'undefined',
      swatchVariant: 'undefined',
    })
  })
})
