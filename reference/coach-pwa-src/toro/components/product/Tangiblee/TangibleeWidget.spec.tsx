import React from 'react'
import { render, CustomRenderOptions, waitFor } from 'test-utils/react'
import userEvent from '@testing-library/user-event'
import TangibleeWidget from 'toro/components/product/Tangiblee/TangibleeWidget'
import { useAtomValue } from 'jotai/utils'
import { priceGroupAtom, productPriceGroupAtom } from 'store/pdp.atom'
import useAnalytics from 'toro/analytics/useAnalytics'
import useViewportType from 'toro/hooks/useViewportType'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import usePreference from 'toro/hooks/usePreference_new'
import getCurrentLocale from 'toro/helpers/getCurrentLocale'
import { openModal, getTangibleeCta } from 'toro/helpers/tangibleeHelper'
import useExperiment from 'toro/hooks/useExperiment'

jest.mock('toro/hooks/useExperiment')
jest.mocked(useExperiment).mockImplementation(() => false)

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

const injectScriptOnceMock = jest.fn()

const renderOptions: CustomRenderOptions = {
  contexts: {
    PWAContext: {
      appData: {
        brand: 'coach',
        locale: 'en-US',
      },
      injectScriptOnce: injectScriptOnceMock,
    },
    ViewportContext: {},
    AnalyticsContext: {},
  },
}
jest.mock('jotai/utils')
jest.mock('toro/analytics/useAnalytics')
jest.mock('toro/hooks/useViewportType')
jest.mock('toro/hooks/useMultiStyleConfig')
jest.mock('toro/hooks/usePreference_new')
jest.mock('toro/helpers/getCurrentLocale')
jest.mock('toro/helpers/tangibleeHelper')
jest.mock('next/navigation', () => {
  return {
    usePathname: () => '/product',
  }
})

const mockSendAnalytics = jest.fn()

const mockedUseAtomValue = useAtomValue as jest.MockedFn<typeof useAtomValue>
const mockedUseAnalytics = useAnalytics as jest.MockedFn<typeof useAnalytics>
const mockedUseViewportType = useViewportType as jest.MockedFn<typeof useViewportType>
const mockedUseMultiStyleConfig = useMultiStyleConfig as jest.MockedFn<typeof useMultiStyleConfig>
const mockedUsePreference = usePreference as jest.MockedFn<typeof usePreference>
const mockedGetCurrentLocale = getCurrentLocale as jest.MockedFn<typeof getCurrentLocale>
const mockedOpenModal = openModal as jest.MockedFn<typeof openModal>
const mockedGetTangibleeCta = getTangibleeCta as jest.MockedFn<typeof getTangibleeCta>

const mockUseMultiStyleConfigElements = {
  BagSizeCompare: false,
  PlusIcon: () => {},
  tangibleeHeroImage: () => {},
  tangibleImage: () => {},
  tangibleIcon: () => {},
  tangibleWrapper: () => {},
  tangibleeContainer: () => {},
  tangibleeTitle: () => {},
}

describe('TangibleeWidget', () => {
  const defaultProps = {
    skuId: 'cu068_b4mpl',
    productData: {
      id: 'CU068 B4MPL',
      custom: { c_filterCategory: 'SHOULDER BAG' },
      category_id: 'women-handbags-shoulder-bags',
      defaultVariant: {
        id: 'CU068 B4MPL',
      },
    },
    tangibleeData: {
      cu068_b4bk: true,
      cu068_b4cbd: true,
      cu068_b4mpl: true,
      cw637_b4ced: true,
      cu068_b4xep: true,
    },
    variantData: { orderable: true },
    rulerIconSrc: undefined,
    isCloserLookArea: false,
    onHeroImage: true,
    variant: 'buttonCTA',
    hideComparablePriceValue: false,
  }

  const makeSetup = (props: any = {}) => {
    const combinedProps = { ...defaultProps, ...props }
    return render(<TangibleeWidget {...combinedProps} />, renderOptions)
  }

  beforeEach(() => {
    mockedUseAtomValue.mockImplementation((atom) => {
      switch (atom) {
        case priceGroupAtom:
          return {
            salePrice: '$295',
          }
        case productPriceGroupAtom:
          return {
            salePrice: '$295',
          }
        default:
          return null
      }
    })
    mockedUseAnalytics.mockImplementation(() => ({
      send: mockSendAnalytics,
    }))
    mockedUseViewportType.mockImplementation(() => ({ isMobile: false }))
    mockedUseMultiStyleConfig.mockImplementation(() => mockUseMultiStyleConfigElements)
    mockedUsePreference.mockImplementation(() => ({
      tangiblee: {
        BRAND_URL: 'www.coach.com',
        TANGIBLEE_INTEGRATION_SCRIPT:
          'https://cdn.tangiblee.com/integration/3.1/managed/www.coach.com/revision_4/variation_original/tangiblee-bundle.min.js',
        enableStrategicTangiblee: true,
        IS_TANGIBLEE_ENABLED: true,
      },
      coachtopia: {
        coachtopiaHomeURL: '/shop/testBrand',
      },
    }))
    mockedGetCurrentLocale.mockImplementation(() => ({
      locale: 'en-US',
      currencySymbol: '$',
    }))
    mockedGetTangibleeCta.mockImplementation(() => [
      {
        bags: 'Bag',
      },
      {
        bag: 'Bag',
      },
      {
        watches: 'Watch',
      },
      {
        watch: 'Watch',
      },
    ])
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders the component correctly with default props', () => {
    const { getByText } = makeSetup()
    expect(getByText('See Bag Size')).toBeVisible()
  })

  it('should inject correct script source when button is clicked', async () => {
    const { getByTestId } = makeSetup()
    const button = getByTestId('pdp_btn_tangiblee_cta')
    await userEvent.click(button)
    expect(injectScriptOnceMock).toHaveBeenCalledTimes(1)
  })

  it('renders the component and handle click event correctly when tangiblee integration script is undefined', async () => {
    const usePreferenceImplementation = mockedUsePreference.getMockImplementation()
    mockedUsePreference.mockImplementation(() => {
      const originalPreferences = usePreferenceImplementation ? usePreferenceImplementation() : {}
      return {
        ...originalPreferences,
        tangiblee: {
          ...originalPreferences.tangiblee,
          TANGIBLEE_INTEGRATION_SCRIPT: undefined,
        },
      }
    })
    const { getByTestId, getByText } = makeSetup()
    expect(getByText('See Bag Size')).toBeVisible()
    const button = getByTestId('pdp_btn_tangiblee_cta')
    await userEvent.click(button)
    expect(injectScriptOnceMock).not.toHaveBeenCalled()
  })

  it('openModal function is called with correct parameters when CTA button click', async () => {
    const { getByTestId } = makeSetup()
    const button = getByTestId('pdp_btn_tangiblee_cta')
    await userEvent.click(button)
    await waitFor(() => {
      expect(mockedOpenModal).toHaveBeenCalledWith(
        {
          cu068_b4bk: true,
          cu068_b4cbd: true,
          cu068_b4mpl: true,
          cu068_b4xep: true,
          cw637_b4ced: true,
        },
        'www.coach.com',
        {
          currency: '$',
          discountedPrice: undefined,
          experience: undefined,
          inStock: true,
          mode: undefined,
          price: '295',
          sku: 'cu068_b4mpl',
        }
      )
    })
  })

  it('triggers appropriate analytics event when CTA button is clicked', async () => {
    const { getByTestId } = makeSetup()
    const button = getByTestId('pdp_btn_tangiblee_cta')
    await userEvent.click(button)
    await waitFor(() => {
      expect(mockSendAnalytics).toHaveBeenCalledWith('productInteraction', {
        eventLocation: 'product',
        eventAction: 'see bag size click',
        eventLabel: 'CU068 B4MPL',
      })
    })
  })

  it('conditionally renders the component based on onHeroImage', () => {
    const { container } = makeSetup({ onHeroImage: false })
    expect(container.querySelector('.tangiblee-cta_ruler--details')).toBeVisible()
    expect(container.querySelector('.tangiblee-cta_title--details')).toBeVisible()
  })

  it('should handle CTA click when onHeroImage is false', async () => {
    const { getByTestId } = makeSetup({ onHeroImage: false })
    const button = getByTestId('pdp_btn_tangiblee_cta')
    await userEvent.click(button)
    await waitFor(() => {
      expect(mockSendAnalytics).toHaveBeenCalled()
    })
  })

  it('renders the component correctly when viewport is mobile view', () => {
    mockedUseViewportType.mockImplementation(() => ({ isMobile: true }))
    const { getByTestId } = makeSetup()
    expect(getByTestId('pdp_btn_tangiblee_cta')).toBeVisible()
  })

  it('displays the correct CTA text dynamically based on brand', () => {
    const { getByText } = render(<TangibleeWidget {...defaultProps} onHeroImage={false} />, {
      ...renderOptions,
      contexts: {
        ...renderOptions.contexts,
        PWAContext: {
          ...renderOptions.contexts.PWAContext,
          appData: {
            ...renderOptions.contexts.PWAContext.appData,
            brand: 'kate-spade',
          },
        },
      },
    })
    expect(getByText('What Fits Inside')).toBeVisible()
  })

  it('displays the correct CTA text dynamically based on different product category', () => {
    const modifiedProps = {
      productData: {
        ...defaultProps.productData,
        custom: {
          ...defaultProps.productData.custom,
          c_filterCategory: 'LEAH LOAFER',
        },
        category_id: 'women-shoes',
      },
    }
    const { getByText } = makeSetup(modifiedProps)
    expect(getByText('See Product Size')).toBeVisible()
  })

  it('displays the correct CTA text dynamically based on different product of bag category', () => {
    const modifiedProps = {
      productData: {
        ...defaultProps.productData,
        custom: {
          ...defaultProps.productData.custom,
          c_filterCategory: 'CANVAS SIGNATURE',
        },
        category_id: 'women-handbags-shoulder-bags',
      },
    }
    const { getByText } = makeSetup(modifiedProps)
    expect(getByText('See Bag Size')).toBeVisible()
  })

  it('handles the CTA click correctly when view port is mobile view', async () => {
    mockedUseViewportType.mockImplementation(() => ({ isMobile: true }))
    const { getByTestId } = makeSetup()
    const button = getByTestId('pdp_btn_tangiblee_cta')
    await userEvent.click(button)
    await waitFor(() => {
      expect(mockSendAnalytics).toHaveBeenCalled()
    })
  })

  it('renders BagSizeCompare icon if available', () => {
    const updatedMultiStyleConfig = {
      BagSizeCompare: () => {},
      PlusIcon: () => {},
      tangibleeHeroImage: () => {},
      tangibleImage: () => {},
      tangibleIcon: () => {},
      tangibleWrapper: () => {},
      tangibleeContainer: () => {},
      tangibleeTitle: () => {},
    }
    mockedUseMultiStyleConfig.mockImplementation(() => updatedMultiStyleConfig)
    const { container } = makeSetup()
    expect(container.querySelector('.tangiblee-cta_ruler--heropdp')).toBeVisible()
  })
})
