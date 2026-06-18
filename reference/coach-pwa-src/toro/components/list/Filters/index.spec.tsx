import { render, fireEvent } from 'test-utils/react'
import { type NextRouter, useRouter } from 'next/router'
import Filters from './index'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import {
  expandedAccordionRefinementsAtom,
  filtersAtom,
  isAnyFilterActiveAtom,
  refinementsIdAtom,
  setExpandedAccordionRefinementsAtom,
  visibleRefinementsAtom,
} from 'store/search-results.atom'
import usePreference from 'toro/hooks/usePreference_new'

const mockRefinementsToRender = [
  {
    id: 1,
    name: 'Size',
    options: [
      { refvalue: 'XS', selectable: true, href: '' },
      { refvalue: 'S', selectable: true, href: '' },
      { refvalue: 'M', selectable: true, href: '' },
      { refvalue: 'L', selectable: true, href: '' },
      { refvalue: 'XL', selectable: true, href: '' },
    ],
    type: 'refinementDefaultStyle',
  },
  {
    id: 2,
    name: 'Color',
    options: [
      { refvalue: 'Beige', selectable: true, href: '' },
      { refvalue: 'Pink', selectable: true, href: '' },
    ],
    type: 'refinementDefaultStyle',
  },
  {
    id: 3,
    name: 'Categories',
    options: [
      { refvalue: 'Bags', selectable: true, href: '' },
      { refvalue: 'Wallets', selectable: true, href: '' },
      { refvalue: 'Wristlets', selectable: true, href: '' },
      { refvalue: 'Clothing', selectable: true, href: '' },
      { refvalue: 'Shoes', selectable: true, href: '' },
      { refvalue: 'Accessories', selectable: true, href: '' },
    ],
    type: '_price_',
  },
]

window.scrollTo = jest.fn()

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}))
const mockedUseRouter = jest.mocked(useRouter)
mockedUseRouter.mockImplementation(
  () =>
    ({
      locale: 'en',
      defaultLocale: 'en',
      events: { on: jest.fn(), off: jest.fn() },
      asPath: '/test-path',
      query: '',
    } as unknown as NextRouter)
)

jest.mock('toro/hooks/usePreference_new')
const mockedUsePreference = jest.mocked(usePreference)
mockedUsePreference.mockImplementation(() => {
  return {
    searchRefinements: {
      searchRefinementScrollSize: '769',
    },
  }
})

jest.mock('toro/analytics/useAnalytics', () =>
  jest.fn(() => ({
    send: jest.fn(),
  }))
)

jest.mock('toro/hooks/useFilterToggle', () =>
  jest.fn(() => ({
    clearFilters: jest.fn(),
  }))
)

jest.mock('jotai/utils')
const mockedUseAtomValue = jest.mocked(useAtomValue)
const mockedUseUpdateAtom = jest.mocked(useUpdateAtom)
mockedUseAtomValue.mockImplementation((atom) => {
  switch (atom) {
    case filtersAtom:
      return [{ id: 1, values: [{ option: { refvalue: '' } }] }]
    case refinementsIdAtom:
      return '1'
    case visibleRefinementsAtom:
      return mockRefinementsToRender
    case isAnyFilterActiveAtom:
      return true
    case expandedAccordionRefinementsAtom:
      return []
    default:
      return null
  }
})

mockedUseUpdateAtom.mockImplementation((atom) => {
  switch (atom) {
    case setExpandedAccordionRefinementsAtom:
      return jest.fn()
    default:
      return null
  }
})

const renderComponent = ({ isMobile = false } = {}, props = {}) => {
  return render(<Filters {...props} />, {
    contexts: {
      PWAContext: { appData: {} },
      ViewportContext: { isDesktop: true, isMobile },
    },
  })
}

describe('Filters Component', () => {
  it('should render Filters component with default props', () => {
    mockedUsePreference.mockImplementationOnce(() => {
      return {
        searchRefinements: {
          searchRefinementScrollSize: null,
        },
      }
    })
    const { container } = renderComponent()
    expect(container).toBeInTheDocument()
  })

  it('should handle route change', async () => {
    const onRouteChangeComplete = jest.fn()
    const routerEventsOnMock = jest.fn((event, handler) => {
      if (event === 'routeChangeComplete') {
        onRouteChangeComplete.mockImplementation(handler)
      }
    })
    mockedUseRouter.mockReturnValue({
      asPath: '',
      query: {},
      events: {
        on: routerEventsOnMock,
        off: jest.fn(),
      },
    } as unknown as NextRouter)

    renderComponent()
    onRouteChangeComplete()
    expect(routerEventsOnMock).toHaveBeenCalledWith('routeChangeComplete', expect.any(Function))
  })

  it('should reset state when ClearAllFiltersButton is clicked', async () => {
    const setRefinementIdMock = jest.fn()
    mockedUseAtomValue.mockImplementationOnce((atom) => {
      switch (atom) {
        case refinementsIdAtom:
          return 1
        case isAnyFilterActiveAtom:
          return true
        default:
          return null
      }
    })
    mockedUseUpdateAtom.mockReturnValue(setRefinementIdMock)
    const { user, getByRole } = renderComponent()
    await user.click(getByRole('button', { name: 'Clear all' }))
    expect(setRefinementIdMock).toHaveBeenCalledWith(null)
  })

  it('should reset state when ClearAllFiltersButton is clicked when isMobile is true', async () => {
    const setRefinementIdMock = jest.fn()
    mockedUseAtomValue.mockImplementationOnce((atom) => {
      switch (atom) {
        case refinementsIdAtom:
          return 1
        case isAnyFilterActiveAtom:
          return true
        default:
          return null
      }
    })
    mockedUseUpdateAtom.mockReturnValue(setRefinementIdMock)
    const { user, getByRole } = renderComponent({ isMobile: true })
    await user.click(getByRole('button', { name: 'Clear all' }))
    expect(setRefinementIdMock).toHaveBeenCalledWith(null)
  })

  it('should handle keyboard events', async () => {
    const { user, getAllByTestId, getByTestId } = renderComponent()

    const hostElementPanel = getByTestId('d_plpfltr_sctn_fltr_panel')
    const hostElementButton = getAllByTestId('plpfltr_body_fltr_acord')[0]

    await user.click(hostElementButton)
    fireEvent.keyDown(hostElementButton, { code: 'ArrowDown' })

    await user.click(hostElementPanel)
    fireEvent.keyUp(hostElementPanel, { code: 'ArrowUp' })

    expect(hostElementButton).toHaveFocus()
  })

  it('should expand accordion on click', async () => {
    const { user, getAllByTestId } = renderComponent({ isMobile: true })
    const button = getAllByTestId('plpfltr_body_fltr_acord')[0]
    expect(button).toHaveAttribute('aria-expanded', 'false')
    await user.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'true')
  })

  it('should expand accordion on click when isMobile is false', async () => {
    const { user, getAllByTestId, container } = renderComponent()
    const button = getAllByTestId('plpfltr_body_fltr_acord')[0]
    expect(button).toHaveAttribute('aria-expanded', 'false')
    const hostElementAccordion = container.querySelector('.chakra-accordion')
    await user.click(hostElementAccordion)
    fireEvent.scroll(hostElementAccordion)
    await user.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'true')
  })
})
