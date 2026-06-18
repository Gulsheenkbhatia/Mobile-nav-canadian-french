import { Atom } from 'jotai'
import { type CustomRenderOptions, render, waitFor } from 'test-utils/react'
import userEvent from '@testing-library/user-event'
import ProductTileSizeDrawer from 'toro/components/list/ProductTileSizeDrawer'
import useAnalytics from 'toro/analytics/useAnalytics'
import useOutsideClick from 'toro/hooks/useOutsideClick'
import { addToBagSizesAtom, sizeDrawerVgIdAtom } from 'store/plp.atom'
import { PlpSizeDrawerSizes } from 'toro/components/list/PlpSizeDrawer/types'

jest.mock('toro/analytics/useAnalytics')
jest.mock('toro/hooks/useOutsideClick')

const mockSizes: PlpSizeDrawerSizes = [
  {
    name: 'Small',
    value: 'SM',
    orderable: true,
    variantId: 'variant-sm-123',
  },
  {
    name: 'Medium',
    value: 'MD',
    orderable: true,
    variantId: 'variant-md-456',
  },
  {
    name: 'Large',
    value: 'LG',
    orderable: false,
    variantId: 'variant-lg-789',
  },
  {
    name: 'Extra Large',
    value: 'XL',
    orderable: true,
    variantId: 'variant-xl-101',
  },
]

const mockVariationGroupId = 'test-variation-group-123'

const defaultAtomsData: Array<[Atom<unknown>, unknown]> = [
  [addToBagSizesAtom, mockSizes],
  [sizeDrawerVgIdAtom, mockVariationGroupId],
]

const defaultRenderOptions: CustomRenderOptions = {
  contexts: {
    PWAContext: {
      appData: {
        siteId: 'coh_us_out',
        defaultLocale: 'en-US',
        locale: 'en-US',
      },
    },
    ViewportContext: {
      viewport: 'desktop',
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      isTouchDevice: false,
    },
  },
}

interface MakeSetupOptions {
  customRenderOptions?: CustomRenderOptions
  customProps?: Partial<React.ComponentProps<typeof ProductTileSizeDrawer>>
  customAtomsData?: Array<[Atom<unknown>, unknown]>
}

const makeSetup = ({
  customRenderOptions,
  customProps,
  customAtomsData = [],
}: MakeSetupOptions = {}) => {
  const mockCloseDrawer = jest.fn()
  const mockOnAddToBagClick = jest.fn().mockResolvedValue(undefined)

  const renderOptions: CustomRenderOptions = {
    ...defaultRenderOptions,
    ...customRenderOptions,
    contexts: {
      ...defaultRenderOptions.contexts,
      ...customRenderOptions?.contexts,
      JotaiProviderContext: new Map([...defaultAtomsData, ...customAtomsData]),
    },
  }

  const props: React.ComponentProps<typeof ProductTileSizeDrawer> = {
    closeDrawer: mockCloseDrawer,
    onAddToBagClick: mockOnAddToBagClick,
    ...customProps,
  }

  const result = render(<ProductTileSizeDrawer {...props} />, renderOptions)

  return {
    ...result,
    mockCloseDrawer,
    mockOnAddToBagClick,
  }
}

describe('ProductTileSizeDrawer', () => {
  const mockSend = jest.fn()

  beforeEach(() => {
    jest.mocked(useAnalytics).mockReturnValue({ send: mockSend })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('Component Renders Correctly', () => {
    it('should render container Box with correct attributes', () => {
      const { getByTestId } = makeSetup()

      // Check that the Size_drawer is rendered
      const sizeDrawer = getByTestId('Size_drawer')
      // Check that the Box visible has the correct class
      expect(sizeDrawer).toBeVisible()
      expect(sizeDrawer).toHaveClass('size-drawer')
    })

    it('should render ProductTileSizeDrawerContent inside container', () => {
      const { getByText } = makeSetup()

      // The ProductTileSizeDrawerContent renders a "Choose size" label
      expect(getByText('Choose size')).toBeVisible()
      // Check that size buttons are rendered
      expect(getByText('small')).toBeVisible()
      expect(getByText('medium')).toBeVisible()
      expect(getByText('large')).toBeVisible()
      expect(getByText('extra large')).toBeVisible()
    })
  })

  describe('Add to Bag Click Handler', () => {
    it.each([
      {
        testName: 'valid size selection',
        sizeText: 'small',
        expectedSize: mockSizes[0],
      },
      {
        testName: 'medium size selection',
        sizeText: 'medium',
        expectedSize: mockSizes[1],
      },
      {
        testName: 'extra large size selection',
        sizeText: 'extra large',
        expectedSize: mockSizes[3],
      },
    ])('should handle $testName correctly', async ({ sizeText, expectedSize }) => {
      const { getByText, mockOnAddToBagClick, mockCloseDrawer } = makeSetup()

      const sizeButton = getByText(sizeText)

      await userEvent.click(sizeButton)

      // Verify analytics event sent with correct data
      expect(mockSend).toHaveBeenCalledWith('swatchInteraction', {
        eventAction: 'swatch click',
        eventLabel: mockVariationGroupId,
        eventLocation: 'quick add to cart drawer',
        swatchType: 'size',
        swatchValue: expectedSize.name,
        swatchVariant: expectedSize.variantId,
      })
      // Verify parent handler called with correct variantId
      expect(mockOnAddToBagClick).toHaveBeenCalledWith(expectedSize.variantId)
      // Verify drawer is closed
      expect(mockCloseDrawer).toHaveBeenCalled()
    })

    it('should handle disabled sizes correctly', () => {
      const { getByText } = makeSetup()

      // Find the large size button which is disabled (orderable: false)
      const largeSizeText = getByText('large')
      const largeSizeButton = largeSizeText.closest('button')
      // Verify that disabled size button is disabled
      expect(largeSizeButton).toBeDisabled()
    })

    it('should wait for async parent handler before closing drawer', async () => {
      // Create a promise that we can control
      let resolveAsync: () => void
      const asyncPromise = new Promise<void>((resolve) => {
        resolveAsync = resolve
      })
      // First, let's verify that the basic functionality works
      const { getByText, mockOnAddToBagClick, mockCloseDrawer } = makeSetup()

      // Mock the handler to return our controlled promise
      mockOnAddToBagClick.mockImplementation(() => asyncPromise)
      const sizeButton = getByText('small')
      // Click and wait for the event to process
      await userEvent.click(sizeButton)
      // Verify that onAddToBagClick was called with correct parameter
      expect(mockOnAddToBagClick).toHaveBeenCalledWith(mockSizes[0].variantId)
      // At this point, closeDrawer should NOT have been called yet because async handler hasn't resolved
      expect(mockCloseDrawer).not.toHaveBeenCalled()
      // Now resolve the async operation
      resolveAsync()
      // Now closeDrawer should have been called
      await waitFor(() => expect(mockCloseDrawer).toHaveBeenCalled())
    })
  })

  describe('Analytics Event Structure', () => {
    it.each<{
      testName: string
      sizeText: string
      expectedSwatchValue: string
      expectedSwatchVariant: string
      customAtomsData: Array<[Atom<unknown>, unknown]>
      expectedLabel: string
    }>([
      {
        testName: 'correct data structure',
        sizeText: 'small',
        expectedSwatchValue: 'Small',
        expectedSwatchVariant: 'variant-sm-123',
        customAtomsData: [],
        expectedLabel: mockVariationGroupId,
      },
      {
        testName: 'custom variationGroupId from atom',
        sizeText: 'small',
        expectedSwatchValue: 'Small',
        expectedSwatchVariant: 'variant-sm-123',
        customAtomsData: [[sizeDrawerVgIdAtom, 'custom-vg-id-456']],
        expectedLabel: 'custom-vg-id-456',
      },
    ])(
      'should send analytics event with $testName',
      async ({
        sizeText,
        expectedSwatchValue,
        expectedSwatchVariant,
        customAtomsData,
        expectedLabel,
      }) => {
        const { getByText } = makeSetup({
          customAtomsData,
        })

        const sizeButton = getByText(sizeText)
        await userEvent.click(sizeButton)

        expect(mockSend).toHaveBeenCalledWith('swatchInteraction', {
          eventAction: 'swatch click',
          eventLabel: expectedLabel,
          eventLocation: 'quick add to cart drawer',
          swatchType: 'size',
          swatchValue: expectedSwatchValue,
          swatchVariant: expectedSwatchVariant,
        })
      }
    )
  })

  describe('Outside Click Handling', () => {
    it('should setup useOutsideClick hook with correct parameters and call closeDrawer when clicking outside', () => {
      const mockUseOutsideClick = jest.mocked(useOutsideClick)
      const { mockCloseDrawer, getByTestId } = makeSetup()

      const mockUseOutsideClickArgs = mockUseOutsideClick.mock.calls[0][0]
      // Verify that the ref passed to useOutsideClick points to the drawer container
      const sizeDrawer = getByTestId('Size_drawer')
      expect(mockUseOutsideClickArgs.ref.current).toBe(sizeDrawer)
      // Simulate clicking outside by calling the handler
      const mockEvent = new Event('click')
      mockUseOutsideClickArgs.handler(mockEvent)
      expect(mockCloseDrawer).toHaveBeenCalled()
    })
  })
})
