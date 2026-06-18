import { render } from 'test-utils/react'
import userEvent from '@testing-library/user-event'
import DynamicSubNavigation, { SubNavCategory } from 'toro/components/DynamicSubNavigation'
import usePreference from 'toro/hooks/usePreference_new'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import useAnalytics from 'toro/analytics/useAnalytics'
import usePageType from 'toro/hooks/usePageType'

const mockUseMultiStyleConfigElements = {
  mainWrapper: () => {},
  wrapper: () => {},
  categoryName: {},
  scrollableWrapper: {},
  linksWrapper: {},
  link: {},
}

jest.mock('toro/hooks/usePreference_new')
jest.mock('toro/hooks/useMultiStyleConfig')
jest.mock('toro/analytics/useAnalytics')
jest.mock('toro/hooks/usePageType')
jest.mock('toro/components/WindowShopInspirationToggle', () => ({
  __esModule: true,
  default: () => <div>Window Shop</div>,
}))

const mockSendAnalytics = jest.fn()

const mockedUsePreference = usePreference as jest.MockedFn<typeof usePreference>
const mockedUseMultiStyleConfig = useMultiStyleConfig as jest.MockedFn<typeof useMultiStyleConfig>
const mockedUseAnalytics = useAnalytics as jest.MockedFn<typeof useAnalytics>
const mockedUsePageType = usePageType as jest.MockedFn<typeof usePageType>

const renderOptions = {
  contexts: {
    PWAContext: { appData: { showBundles: false } },
    ViewportContext: {},
    SessionContext: {
      user: {
        listSourceCodeGroupCategoriesID: [],
        CustomerGroups: {
          customerGroup: [],
        },
      },
    },
  },
}
jest.mock('next/router', () => {
  return {
    useRouter: () => ({
      asPath: '/',
    }),
  }
})
jest.mock('jotai/utils', () => ({
  ...(jest.requireActual('jotai/utils') as object),
  useAtomValue: () => ({
    test1: {
      cgid: 'test1',
      url: '/test/1',
      name: 'TEST 1',
    },
    test2: {
      cgid: 'test2',
      url: '/test/2',
      name: 'TEST 2',
      catNameColorForSubNavHP: 'blue',
    },
  }),
}))

const subNavigationData = [
  {
    cgid: 'test1',
    url: '/test/1',
    name: 'TEST 1',
  },
  {
    cgid: 'test2',
    url: '/test/2',
    name: 'TEST 2',
    catNameColorForSubNavHP: 'blue',
    dataQA: 'categoryName',
  },
  {
    cgid: 'test3',
    url: '/test/3',
    name: 'TEST 3',
  },
]

const dynamicSubNavigationStyles = {
  brand: {
    enable: true,
    fontFamily: 'HelveticaNeue73ExtendedBold',
    textDecoration: 'underline',
    backgroundColor: 'red',
    color: '#000001',
  },
  subbrand: {
    enable: true,
    fontFamily: 'HelveticaNeue73ExtendedBold',
    textDecoration: 'none',
    backgroundColor: '#F4E3FB',
    color: '#000001',
  },
}

const windowShop = {
  enableBrand: true,
  brandUrl: '/shop/test-1',
  subBrandUrl: '/shop/test-1',
  enableSubBrand: true,
}

describe('DynamicSubNavigation tests', () => {
  beforeEach(() => {
    mockedUsePreference.mockImplementation(() => ({
      coachtopia: { coachtopiaRootCategory: '' },
      toggleSiteFeatures: { dynamicSubNavigationStyles },
      adaptiveExperience: { windowShop },
      storefrontConfigs: { transparentHeader: false },
    }))
    mockedUseMultiStyleConfig.mockImplementation(() => mockUseMultiStyleConfigElements)
    mockedUsePageType.mockImplementation(() => ({
      isPDP: true,
      isHP: false,
      isSRP: false,
      isPLP: false,
      isRetailHP: false,
      isOutletHP: false,
      isSubHP: false,
      isProductPassport: false,
      isContentPage: false,
    }))
  })
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should render categories from menuData atom', () => {
    const { queryByText } = render(
      <DynamicSubNavigation categories={subNavigationData as SubNavCategory[]} variant="plpV3" />,
      renderOptions
    )
    const subCategoryName = queryByText(subNavigationData[0].name)
    expect(subCategoryName).toBeInTheDocument()
  })
  it('should not render categories if it is not in menuData atom', () => {
    const { queryByText } = render(
      <DynamicSubNavigation categories={subNavigationData as SubNavCategory[]} variant="homeT1" />,
      renderOptions
    )
    const subCategoryName = queryByText(subNavigationData[2].name)
    expect(subCategoryName).not.toBeInTheDocument()
  })
  it('should not add data attributes when variant is homeT2', () => {
    const { getAllByRole } = render(
      <DynamicSubNavigation categories={subNavigationData as SubNavCategory[]} variant="homeT2" />,
      renderOptions
    )
    const subCategoryName = getAllByRole('link')
    subCategoryName.forEach((cat) => {
      expect(cat.getAttributeNames()).not.toContain('data-iscoachtopiasubcategory')
      expect(cat.getAttributeNames()).not.toContain('data-iscoachtopiarootcategory')
    })
  })

  it('should not display category Name when coachtopiaRootCategory equals cgid', async () => {
    mockedUsePreference.mockImplementation(() => ({
      coachtopia: { coachtopiaRootCategory: 'test2' },
      toggleSiteFeatures: { dynamicSubNavigationStyles },
      adaptiveExperience: { windowShop },
      storefrontConfigs: { transparentHeader: true },
    }))
    const { queryByText } = render(
      <DynamicSubNavigation
        categories={subNavigationData as SubNavCategory[]}
        variant="homeT2"
        activeCategoryId="test2"
      />,
      renderOptions
    )
    const categoryNameText = queryByText('TEST 2')
    expect(categoryNameText).not.toBeInTheDocument()
  })

  it('should handle sub nav item click', async () => {
    const user = userEvent.setup({ delay: null })
    mockedUseAnalytics.mockImplementation(() => ({
      send: mockSendAnalytics,
    }))
    const { getAllByRole } = render(
      <DynamicSubNavigation categories={subNavigationData as SubNavCategory[]} variant="plpV3" />,
      renderOptions
    )
    const link = getAllByRole('link')
    await user.click(link[0])
    expect(mockSendAnalytics).toHaveBeenCalledWith('navClick', {
      eventLocation: 'sub nav',
      navigationItemData: { parentCategoryTree: undefined },
    })
  })
  it('should render WindowShopInspirationToggle with label "Window Shop" when windowShop.enableBrand is true on Home page', async () => {
    mockedUsePageType.mockImplementation(() => ({
      isPDP: false,
      isHP: true,
      isSRP: false,
      isPLP: false,
      isRetailHP: false,
      isOutletHP: false,
      isSubHP: false,
      isProductPassport: false,
      isContentPage: false,
    }))
    mockedUsePreference.mockImplementation(() => ({
      coachtopia: { coachtopiaRootCategory: '' },
      toggleSiteFeatures: { dynamicSubNavigationStyles },
      adaptiveExperience: { windowShop },
      storefrontConfigs: { transparentHeader: false },
    }))
    mockedUseMultiStyleConfig.mockImplementation(() => mockUseMultiStyleConfigElements)
    const { getByText } = render(
      <DynamicSubNavigation categories={subNavigationData as SubNavCategory[]} variant="plpV3" />,
      renderOptions
    )
    expect(getByText('Window Shop')).toBeInTheDocument()
  })
})
