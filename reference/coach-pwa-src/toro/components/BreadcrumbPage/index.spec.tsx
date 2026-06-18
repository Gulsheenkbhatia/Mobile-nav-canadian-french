import React from 'react'
import userEvent from '@testing-library/user-event'
import { render, screen } from 'test-utils/react'
import BreadcrumbPage from './index'
import { useRouter } from 'next/router'
import useAnalytics from 'toro/analytics/useAnalytics'
import { categoryUrlsAtom } from 'store/menu-data.atom'
import { isPlpV3Atom } from 'store/plp.atom'
import { EXPERIMENTS } from 'toro/constants/experiments'
import { PAGE_TYPES } from 'toro/constants/googleAnalytics'
import { QUERY_PARAM_FROM_SEARCH } from 'toro/constants/appConstants'
import { Atom } from 'jotai'
import { experimentsAtom } from 'store/experiments.atom'

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}))
jest.mock('toro/analytics/useAnalytics')

const mockUseRouter = jest.mocked(useRouter)
const mockUseAnalytics = jest.mocked(useAnalytics)

describe('BreadcrumbPage', () => {
  const defaultBreadcrumbData = [
    { id: 'root', name: 'Home', url: 'https://example.com/', cgid: 'root' },
    { id: 'cat1', name: 'Category 1', url: 'https://example.com/cat1', cgid: 'cat1' },
  ]

  const defaultProps = {
    breadcrumbData: defaultBreadcrumbData,
    plpToPDPBreadcrumbData: [],
    apploading: false,
    variant: 'default',
  }

  const mockAnalyticsSend = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseRouter.mockReturnValue({
      pathname: '/shop',
      query: {},
      back: jest.fn(),
    } as any)
    mockUseAnalytics.mockReturnValue({ send: mockAnalyticsSend } as any)
  })

  const renderComponent = (props = {}, atoms: any[] = [], viewport: any = { isMobile: false }) => {
    const defaultAtoms = [
      [categoryUrlsAtom, {}],
      [isPlpV3Atom, false],
      [experimentsAtom, ''],
    ]
    // Merge default atoms with provided atoms, allowing overrides
    const atomMap = new Map<Atom<unknown>, unknown>(defaultAtoms as any)
    atoms.forEach(([atom, value]) => atomMap.set(atom, value))

    return render(<BreadcrumbPage {...defaultProps} {...props} />, {
      contexts: {
        JotaiProviderContext: atomMap,
        PWAContext: {
          appData: {},
        },
        ViewportContext: {
          ...viewport,
        },
      },
    })
  }

  it('renders nothing if breadcrumbData is missing/null', () => {
    renderComponent({ breadcrumbData: null })
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
  })

  it('renders breadcrumbs correctly', () => {
    renderComponent()

    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(2)
    expect(screen.getByText('Home')).toBeVisible()
    expect(screen.getByText('Category 1')).toBeVisible()
  })

  it('uses plpToPDPBreadcrumbData when apploading is true', () => {
    const plpBreadcrumbs = [{ id: 'plp1', name: 'PLP Link', url: 'https://example.com/plp1' }]
    renderComponent({
      apploading: true,
      plpToPDPBreadcrumbData: plpBreadcrumbs,
    })

    expect(screen.getByText('PLP Link')).toBeVisible()
    expect(screen.queryByText('Home')).not.toBeInTheDocument()
  })

  it('renders back to search results when coming from search', () => {
    mockUseRouter.mockReturnValue({
      pathname: '/products/123',
      query: { [QUERY_PARAM_FROM_SEARCH]: 'bag' },
      back: jest.fn(),
    } as any)

    renderComponent()

    expect(screen.getByText(/Back To Search Results/)).toBeVisible()
    expect(screen.getByText('Category 1')).toBeVisible()
    // 'Home' should be skipped in this logic: [searchItem, last(_breadcrumbs)]
    expect(screen.queryByText('Home')).not.toBeInTheDocument()
  })

  it('renders correctly for PDP V3 Mobile', () => {
    mockUseRouter.mockReturnValue({
      pathname: '/products/123',
      query: {},
    } as any)

    renderComponent({}, [[experimentsAtom, EXPERIMENTS.PDP_V3]], { isMobile: true })

    // PDP V3 Mobile logic: _breadcrumbs.splice(-1) -> removes last item
    // Original: [Home, Category 1] -> Result: [Home]
    expect(screen.getByText('Home')).toBeVisible()
    expect(screen.queryByText('Category 1')).not.toBeInTheDocument()
  })

  it('renders correctly for PDP V3 Mobile with Search', () => {
    mockUseRouter.mockReturnValue({
      pathname: '/products/123',
      query: { [QUERY_PARAM_FROM_SEARCH]: 'bag' },
    } as any)

    renderComponent({}, [[experimentsAtom, EXPERIMENTS.PDP_V3]], { isMobile: true })

    // PDP V3 Mobile logic with search: returns only [searchItem]
    expect(screen.getByText(/Back To Search Results/)).toBeVisible()
    expect(screen.queryByText('Home')).not.toBeInTheDocument()
    expect(screen.queryByText('Category 1')).not.toBeInTheDocument()
  })

  it('handles analytics on breadcrumb click', async () => {
    const user = userEvent.setup()
    mockUseRouter.mockReturnValue({
      pathname: '/products/123',
      query: {},
    } as any)

    renderComponent()
    const link = screen.getByText('Home')
    await user.click(link)

    expect(mockAnalyticsSend).toHaveBeenCalledWith('breadcrumb', {
      eventpageLocation: PAGE_TYPES.PDP,
      eventLabel: 'Home',
    })
  })

  it('navigates back if URL contains search query', async () => {
    const user = userEvent.setup()
    const backMock = jest.fn()
    mockUseRouter.mockReturnValue({
      pathname: '/shop',
      query: {},
      back: backMock,
    } as any)

    const searchBreadcrumbs = [
      { id: 'search', name: 'Search', url: 'https://example.com/search?q=test' },
      { id: 'current', name: 'Current', url: '/current' },
    ]

    renderComponent({ breadcrumbData: searchBreadcrumbs })
    const link = screen.getByText('Search')
    await user.click(link)

    expect(backMock).toHaveBeenCalled()
  })

  it('uses correct variant for PLP V3', () => {
    mockUseRouter.mockReturnValue({
      pathname: '/shop',
      query: {},
    } as any)

    renderComponent({ variant: 'default' }, [[isPlpV3Atom, true]])
    expect(screen.getByText('Home')).toBeVisible()
  })

  it('handles absUrl and relative URL logic correctly', () => {
    const complexBreadcrumbs = [
      { id: '1', name: 'Complex', url: undefined, absUrl: 'https://domain.com/category/123' },
    ]

    renderComponent({ breadcrumbData: complexBreadcrumbs })

    const link = screen.getByText('Complex')
    expect(link).toHaveAttribute('href', '/category/123')
  })
})
