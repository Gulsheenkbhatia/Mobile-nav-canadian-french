import React from 'react'
import { render, screen, waitFor, CustomRenderOptions } from 'test-utils/react'
import EnjectCustomizationScript from 'toro/components/EnjectCustomizationScript/index'
import { useRouter, type NextRouter } from 'next/router'
import useAnalytics from 'toro/analytics/useAnalytics'
import userEvent from '@testing-library/user-event'
import { useAtom } from 'jotai'
import useViewportType from 'toro/hooks/useViewportType'
import useExperiment from 'toro/hooks/useExperiment'

const defaultProps = {
  skuId: '',
  productData: {
    colors: [
      { id: '12345', image: { src: '' }, media: { full: [{ src: '' }], thumbnail: { src: '' } } },
      { id: '123' },
    ],
  },
  selectedVariant: { productId: '12345' },
  isCustomize: true,
  isMonogram: true,
  isQuickView: false,
  masterId: 'master123',
  isCustomizerPrefernceEnabled: true,
  customizerPrefernce: { CustomizerApiKey: '123', CustomizerAddonHangtags: { default: '#123' } },
  productCustomState: { 12345: { canCustomize: true } },
  customizerData: {},
  defaultVariantProductID: 'default123',
}

// Mock functions and storage
const mockFetch = jest.fn()
const mockGetItem = jest.fn()
const mockSetItem = jest.fn()
const mockSendAnalyticsEvent = jest.fn()
const mockSetCustomizerDataParent = jest.fn()
const mockedUseAtom = jest.mocked(useAtom) as jest.Mock
const mockedUseViewportType = jest.mocked(useViewportType) as jest.Mock
const mockedUseExperiment = jest.mocked(useExperiment) as jest.Mock

const setCustomizerVariants = jest.fn()
const testWindow: any = global.window
global.fetch = mockFetch
global.localStorage.getItem = mockGetItem
global.localStorage.setItem = mockSetItem

jest.mock('toro/analytics/useAnalytics')
jest.mock('next/router', () => {
  const actual = jest.requireActual('next/router')

  return {
    ...actual,
    useRouter: jest.fn(),
  }
})
jest.mock('jotai', () => {
  const actual = jest.requireActual('jotai')

  return {
    ...actual,
    useAtom: jest.fn(),
  }
})
jest.mock('toro/hooks/useViewportType')
jest.mock('toro/hooks/useExperiment')

const mockedUseAnalytics = jest.mocked(useAnalytics)
const mockedUseRouter = jest.mocked(useRouter)

const renderOptions: CustomRenderOptions = {
  contexts: {
    PWAContext: {
      appData: { customizerScriptUrl: '/custom-script' },
    },
    ViewportContext: {},
    AnalyticsContext: {},
    SessionContext: {},
  },
}

const mockRouter = {
  push: jest.fn(),
  query: {},
} as unknown as NextRouter

const makeSetup = (props: object = {}, customRenderOptions = renderOptions) =>
  render(<EnjectCustomizationScript {...defaultProps} {...props} />, customRenderOptions)

describe('EnjectCustomizationScript', () => {
  beforeEach(() => {
    mockedUseAnalytics.mockReturnValue({ send: mockSendAnalyticsEvent })
    mockedUseAtom.mockReturnValue([
      { canCustomizeParent: true, canCustomize: true },
      mockSetCustomizerDataParent,
    ])
    mockedUseViewportType.mockReturnValue({ isMobile: false })
    mockedUseExperiment.mockReturnValue(false)
    mockedUseRouter.mockReturnValue(mockRouter)
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should render customization button when customization is allowed', () => {
    makeSetup()

    const customizeButton1 = screen.getByText('Edit This Item')
    const customizeButton2 = screen.getByText('Customize Another')

    expect(customizeButton1).toBeVisible()
    expect(customizeButton2).toBeVisible()
  })

  it('should not render customization buttons when customization is not allowed', () => {
    mockedUseAtom.mockReturnValueOnce([{ canCustomizeParent: false, canCustomize: false }])
    makeSetup()

    const customizeButton1 = screen.queryByText('Edit This Item')
    const customizeButton2 = screen.queryByText('Customize Another')

    expect(customizeButton1).not.toBeInTheDocument()
    expect(customizeButton2).not.toBeInTheDocument()
  })

  it('should add script correctly when clicked on custimization cta', async () => {
    const user = userEvent.setup()
    const { getByText } = makeSetup()

    const customizeButton1 = getByText('Edit This Item')
    const customizeButton2 = screen.getByText('Customize Another')

    await user.click(customizeButton1)
    await user.click(customizeButton2)

    expect(mockSendAnalyticsEvent).toHaveBeenCalled()

    await waitFor(() => {
      const scriptTag = document.getElementsByTagName('script')
      expect(scriptTag[0].getAttribute('src')).toBe('/custom-script')
      scriptTag[0].onload(this)
    })
  })

  it('should reset custom data if selected variant changes', async () => {
    const user = userEvent.setup()
    const customProps = { productCustomState: { default123: {}, 12345: {} } }
    const customRender = {
      contexts: {
        PWAContext: { appData: {} },
        ViewportContext: {},
        AnalyticsContext: {},
        SessionContext: {},
      },
    }
    const { getByText } = makeSetup({ ...customProps, setCustomizerVariants }, customRender)
    const customizeButton1 = getByText('Edit This Item')

    await user.click(customizeButton1)

    expect(setCustomizerVariants).toHaveBeenCalledWith([])
  })

  it('should display and handle clickes for "Add a Free Monogram" CTA when canMonogram is true', async () => {
    const user = userEvent.setup()
    const { getByText } = makeSetup({
      productCustomState: { 12345: { canMonogram: true } },
      isCustomizerPrefernceEnabled: false,
      isCustomize: false,
      isMonogram: false,
    })
    const addMonogram = getByText('Add a Free Monogram')
    expect(addMonogram).toBeVisible()

    await user.click(addMonogram)
    expect(mockSendAnalyticsEvent).toHaveBeenCalled()
  })

  it('should call setSelectedColor when recipeFetched is true and customizerVariants are orderable', async () => {
    const setSelectedColor = jest.fn()
    const mockRecipe = JSON.stringify({
      master123: [
        {
          result: {
            productId: '12345',
            recipe: [{ id: 'recipe123' }],
            monogram: { sku: 'SKU 12345' },
          },
        },
      ],
    })

    const mockRecipeData = {
      id: 'recipe123',
      data: 'recipe data',
      recipe: { views: [{ code: 'Product' }], custom: {} },
      productId: '6789',
    }

    const mockFetchResponse = Promise.resolve({
      json: () => Promise.resolve(mockRecipeData),
    } as Response)

    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(mockRecipe)

    global.fetch = jest.fn(() => Promise.resolve(mockFetchResponse))
    const { rerender } = makeSetup({
      isCustomize: false,
      isMonogram: false,
      setCustomizerVariants,
      setSelectedColor,
    })

    rerender(
      <EnjectCustomizationScript
        {...defaultProps}
        setCustomizerVariants={setCustomizerVariants}
        setSelectedColor={setSelectedColor}
        customizerVariants={[{ orderable: true }]}
      />
    )
    await waitFor(() => {
      expect(setSelectedColor).toHaveBeenCalled()
    })

    await waitFor(() => {
      expect(setCustomizerVariants).toHaveBeenCalled()
    })

    const setCustomizerVariantsCallback = setCustomizerVariants.mock.calls[0][0]
    const currentVariants = []
    const updatedVariants = setCustomizerVariantsCallback(currentVariants)

    expect(updatedVariants[0]).toHaveProperty('baseProductId', '6789')
    expect(updatedVariants[0]).toHaveProperty('embellishment.embellish_type', 'no embellish type')
  })

  it('should display correct label on customization button', async () => {
    const user = userEvent.setup()
    const { getByText } = makeSetup({
      productCustomState: { 12345: { canCustomize: true } },
      isCustomizerPrefernceEnabled: false,
      isCustomize: false,
      isMonogram: false,
    })

    const customizeButton = getByText('Customize It')
    expect(customizeButton).toBeVisible()
    await user.click(customizeButton)
    expect(mockSendAnalyticsEvent).toHaveBeenCalled()
  })

  it('should render Edit Monogram CTA when monogram is present', async () => {
    const user = userEvent.setup()
    const { getByText } = makeSetup({
      productCustomState: {},
      selectedVariant: { productId: '1-2345' },
      isCustomize: false,
    })

    const customizeButton = getByText('Edit Monogram')
    expect(customizeButton).toBeVisible()
    await user.click(customizeButton)
    expect(mockSendAnalyticsEvent).toHaveBeenCalled()
  })

  it('should fetch product status and call setProductCustomState', async () => {
    const setProductCustomState = jest.fn()
    const mockRecipeData = { canMonogram: false, canCustomize: false }
    const mockFetchResponse = Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockRecipeData),
    } as Response)

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockFetchResponse),
      } as Response)
    )
    makeSetup({ productCustomState: {}, setProductCustomState })
    await waitFor(() => expect(setProductCustomState).toHaveBeenCalled())
  })

  it('should fetch recipe by params', async () => {
    const mockRouter = {
      push: jest.fn(),
      query: { recipe: 'recipe123' },
    } as unknown as NextRouter

    mockedUseRouter.mockReturnValue(mockRouter)
    const mockRecipeData = {
      recipe: { custom: { monogram: '' } },
      productId: '12345',
    }

    const mockFetchResponse = Promise.resolve({
      json: () => Promise.resolve(mockRecipeData),
    } as Response)

    global.fetch = jest.fn(() => Promise.resolve(mockFetchResponse))

    const { rerender } = makeSetup({ productCustomState: {} })
    rerender(
      <EnjectCustomizationScript {...defaultProps} customizerData={{ canMonogramParent: true }} />
    )
    await waitFor(() => expect(global.fetch).toHaveBeenCalled())
  })

  it('should create customizer widget on customizer click', async () => {
    const mockRouter = {
      push: jest.fn(() => Promise.resolve(null)),
      query: {},
    } as unknown as NextRouter

    mockedUseRouter.mockReturnValue(mockRouter)
    const user = userEvent.setup()

    testWindow.$ = jest.fn().mockReturnValue({ animate: jest.fn() })
    testWindow.CustomizerWidget = {
      default: {
        createWidget: jest.fn((config) => {
          config.onDone({ recipe: { id: 'recipe123' } }) // Simulate onDone being called
          config.onCancel() // Simulate onCancel being called
        }),
      },
    }
    const { getByText } = makeSetup({
      recipes: [
        { productId: '12345', location: '', monogram: { sku: '123' }, recipe: { id: '12345' } },
      ],
      selectedColor: { id: '12345' },
      isQuickView: true,
      customizerVariants: [{ orderable: true }],
    })

    const customizeButton1 = getByText('Edit This Item')
    const customizeButton2 = getByText('Customize Another')

    await user.click(customizeButton1)
    await user.click(customizeButton2)
    expect(mockSendAnalyticsEvent).toHaveBeenCalled()
    expect(testWindow.CustomizerWidget.default.createWidget).toHaveBeenCalled()
  })

  it('should call onDone and onCancel provided in customizer widget config', async () => {
    const user = userEvent.setup()
    const setRecipes = jest.fn()

    testWindow.CustomizerWidget = {
      default: {
        createWidget: jest.fn((config) => {
          config.onDone({ recipe: { id: 'recipe123' } }) // Simulate onDone being called
          config.onCancel() // Simulate onCancel being called
        }),
      },
    }
    const mockRecipeData = {
      recipe: { custom: { monogram: '' }, productId: '12345' },
      productId: '12345',
    }

    const mockFetchResponse = Promise.resolve({
      json: () => Promise.resolve(mockRecipeData),
    } as Response)

    global.fetch = jest.fn(() => Promise.resolve(mockFetchResponse))

    const { getByText } = makeSetup({
      customizerVariants: [{ orderable: true }],
      isCustomize: false,
      isMonogram: false,
      setRecipes,
    })

    const customizeButton2 = getByText('Customize It')

    await user.click(customizeButton2)

    expect(mockSendAnalyticsEvent).toHaveBeenCalled()
    expect(global.fetch).toHaveBeenCalled()
    expect(setRecipes).toHaveBeenCalled()

    const setRecipesCallback = setRecipes.mock.calls[0][0]
    const prevRecipes = []
    const updatedRecipes = setRecipesCallback(prevRecipes)

    expect(Object.keys(updatedRecipes[0])).toContain('location')
    expect(Object.keys(updatedRecipes[0])).toContain('monogram')
  })

  it('should render without dot class on PDPv4.2 mobile', async () => {
    mockedUseViewportType.mockReturnValueOnce({ isMobile: true })
    mockedUseExperiment.mockReturnValueOnce(true)

    makeSetup()

    const customizeButton1 = screen.getByText('Edit This Item')

    expect(customizeButton1.classList).not.toContain('customization_link--dot')
  })

  it('should render CustomizeAndMonogramV6 component when type is "widget"', () => {
    makeSetup({ type: 'widget' })

    // When type is "widget", it should render the CustomizeAndMonogramV6 component
    // which would be imported dynamically, so we can't easily test its presence
    // but we can verify the component doesn't render the default links
    const customizeButton = screen.queryByText('Edit This Item')
    expect(customizeButton).not.toBeInTheDocument()
  })

  it('should render default links when type is "links" (default)', () => {
    makeSetup({ type: 'links' })

    const customizeButton1 = screen.getByText('Edit This Item')
    const customizeButton2 = screen.getByText('Customize Another')

    expect(customizeButton1).toBeVisible()
    expect(customizeButton2).toBeVisible()
  })
})
