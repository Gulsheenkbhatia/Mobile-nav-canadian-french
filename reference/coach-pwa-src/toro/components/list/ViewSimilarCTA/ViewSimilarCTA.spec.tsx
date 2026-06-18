import { render, screen } from 'test-utils/react'
import usePreference from 'toro/hooks/usePreference_new'
import useViewportType from 'toro/hooks/useViewportType'
import useExperiment from 'toro/hooks/useExperiment'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import ViewSimilarCTA from 'toro/components/list/ViewSimilarCTA'
import useLLMRecommendations from 'toro/hooks/useLLMRecommendations'

const styles = {}

jest.mock('toro/hooks/useViewportType')
jest.mock('toro/hooks/usePreference_new')
jest.mock('toro/hooks/useExperiment')
jest.mock('toro/hooks/useLLMRecommendations')
jest.mock('jotai/utils')

const mockedUsePreference = usePreference as jest.MockedFn<typeof usePreference>
const mockedUseViewportType = useViewportType as jest.MockedFn<typeof useViewportType>
const mockedUseExperiment = useExperiment as jest.MockedFn<typeof useExperiment>
const mockedUseAtomValue = useAtomValue as jest.MockedFn<typeof useAtomValue>
const mockedUseUpdateAtomValue = useUpdateAtom as jest.MockedFn<typeof useUpdateAtom>
const mockUseLLMRecommConfig = useLLMRecommendations as jest.Mock

const mockSetAEDrawerConfig = jest.fn()
mockedUseUpdateAtomValue.mockImplementation(() => mockSetAEDrawerConfig)

const mockAnalytyticsSend = jest.fn()
jest.mock('toro/analytics/useAnalytics', () =>
  jest.fn(() => ({
    send: mockAnalytyticsSend,
  }))
)

const product = { id: 'test', name: 'test', url: 'test' }
const activeProduct = { id: 'test1', name: 'test1', url: 'test1' }

describe('ViewSimilarCTA', () => {
  beforeEach(() => {
    mockUseLLMRecommConfig.mockReturnValue({
      setVisuallySimilarProp: () => Promise.resolve(),
    })
  })
  afterAll(() => {
    jest.resetAllMocks()
  })
  it('should be link if AE Drawer disabled', async () => {
    mockedUsePreference.mockImplementation(() => ({
      toggleSiteFeatures: { similarOptionsCTAConfig: { PLP: { link: 'test_link' } } },
      adaptiveExperience: {
        enableAEDrawerExp: {
          PLP: {
            enable: false,
          },
          brand: { desktop: false, mobile: false },
          subBrand: { desktop: false, mobile: false },
        },
      },
    }))
    mockedUseAtomValue.mockImplementation(() => false)
    mockedUseViewportType.mockImplementation(() => ({ isDesktop: false, isMobile: true }))
    mockedUseExperiment.mockImplementation(() => false)

    const { user } = render(
      <ViewSimilarCTA
        styles={styles}
        product={product}
        activeProduct={activeProduct}
        icon={null}
      />,
      {
        contexts: { PWAContext: { appData: {} }, AnalyticsContext: {} },
      }
    )

    const element = screen.getByRole('button')
    const parentElement = element.parentElement

    expect(parentElement.tagName).toBe('A')
    expect(parentElement.getAttribute('href')).toEqual('test_link')

    // Prevent jsdom from attempting real navigation on anchor clicks
    parentElement.addEventListener('click', (e) => e.preventDefault())
    await user.click(parentElement)
    expect(mockAnalytyticsSend).toBeCalledWith('listInteraction', {
      eventAction: 'view similar click',
      eventLocation: 'product tile',
      eventLabel: product.id,
    })
  })
  it('should be button if AE Drawer enabled', async () => {
    mockedUsePreference.mockImplementation(() => ({
      toggleSiteFeatures: { similarOptionsCTAConfig: {} },
      adaptiveExperience: {
        enableAEDrawerExp: {
          PLP: {
            enable: true,
          },
          brand: { desktop: false, mobile: true },
          subBrand: { desktop: false, mobile: true },
        },
      },
    }))
    mockedUseAtomValue.mockImplementation(() => true)
    mockedUseViewportType.mockImplementation(() => ({ isDesktop: false, isMobile: true }))
    mockedUseExperiment.mockImplementation(() => true)
    mockedUseUpdateAtomValue.mockImplementation(() => mockSetAEDrawerConfig)

    const { user } = render(
      <ViewSimilarCTA
        styles={styles}
        product={product}
        activeProduct={activeProduct}
        icon={null}
      />,
      {
        contexts: { PWAContext: { appData: {} }, AnalyticsContext: {} },
      }
    )

    const element = screen.getByRole('button')
    const parentElement = element.parentElement

    expect(element).toBeInTheDocument()
    expect(parentElement.tagName).not.toBe('A')

    await user.click(element)
    expect(mockSetAEDrawerConfig).toBeCalledWith({
      showDrawer: true,
      activeProduct,
      eventLocation: 'category module',
    })
  })
  it('should be link if AE Drawer disabled on a page level', async () => {
    mockedUsePreference.mockImplementation(() => ({
      toggleSiteFeatures: { similarOptionsCTAConfig: { PLP: { link: 'test_link' } } },
      adaptiveExperience: {
        enableAEDrawerExp: {
          PLP: {
            enable: false,
          },
          brand: { desktop: true, mobile: true },
          subBrand: { desktop: true, mobile: true },
        },
      },
    }))
    mockedUseAtomValue.mockImplementation(() => false)
    mockedUseViewportType.mockImplementation(() => ({ isDesktop: false, isMobile: true }))
    mockedUseExperiment.mockImplementation(() => false)

    const { user } = render(
      <ViewSimilarCTA
        styles={styles}
        product={product}
        activeProduct={activeProduct}
        icon={null}
      />,
      {
        contexts: { PWAContext: { appData: {} }, AnalyticsContext: {} },
      }
    )

    const element = screen.getByRole('button')
    const parentElement = element.parentElement

    expect(parentElement.tagName).toBe('A')
    expect(parentElement.getAttribute('href')).toEqual('test_link')

    // Prevent jsdom from attempting real navigation on anchor clicks
    parentElement.addEventListener('click', (e) => e.preventDefault())
    await user.click(parentElement)
    expect(mockAnalytyticsSend).toBeCalledWith('listInteraction', {
      eventAction: 'view similar click',
      eventLocation: 'product tile',
      eventLabel: product.id,
    })
  })
})
