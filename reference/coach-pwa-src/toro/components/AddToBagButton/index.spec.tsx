import { render } from 'test-utils/react'
import AddToBagButton from './index'
import * as useAddToCartHook from 'toro/hooks/useAddToCart'
import { addToBagSizesAtom, sizeDrawerVgIdAtom } from 'store/plp.atom'
import merge from 'lodash/merge'

// Mock next/dynamic to return components without lazy loading
jest.mock('next/dynamic', () => () => {
  return jest.requireActual('toro/components/list/ProductTileSizeDrawer').default
})

describe('AddToBagButton', () => {
  const mockAddToCart = jest.fn()
  const mockOnCloseSizeDrawer = jest.fn()
  const mockAddToCartVariant = jest.fn()
  const mockOnClick = jest.fn()
  const mockSetIsATBButtonDisabled = jest.fn()

  const defaultUseAddToCartReturn = {
    addToCart: mockAddToCart,
    isMaxQuantityReached: false,
    isDisabled: false,
    showSizesSelectionDesktop: false,
    onCloseSizeDrawer: mockOnCloseSizeDrawer,
    addToCartVariant: mockAddToCartVariant,
    isError: false,
    errorMessage: '',
  }

  const defaultRenderOptions = {
    contexts: {
      ViewportContext: {
        viewport: 'desktop' as const,
        isDesktop: true,
        isMobile: false,
      },
      PWAContext: {
        appData: {
          locale: 'en-US',
        },
      },
      AnalyticsContext: {
        send: jest.fn(),
      },
    },
  }

  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(useAddToCartHook, 'default').mockReturnValue(defaultUseAddToCartReturn)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('Viewport Filtering', () => {
    it('should return null when isMobileOnly={true} on desktop', () => {
      const { queryByRole } = render(
        <AddToBagButton variantId="variant-1" isMobileOnly={true} />,
        defaultRenderOptions
      )

      expect(queryByRole('button')).not.toBeInTheDocument()
    })

    it('should render when isMobileOnly={true} on mobile', () => {
      const mobileOptions = merge({}, defaultRenderOptions, {
        contexts: {
          ViewportContext: {
            viewport: 'mobile' as const,
            isDesktop: false,
            isMobile: true,
          },
        },
      })

      const { getByRole } = render(
        <AddToBagButton variantId="variant-1" isMobileOnly={true} />,
        mobileOptions
      )

      expect(getByRole('button')).toBeVisible()
    })

    it('should return null when isDesktopOnly={true} on mobile', () => {
      const mobileOptions = merge({}, defaultRenderOptions, {
        contexts: {
          ViewportContext: {
            viewport: 'mobile' as const,
            isDesktop: false,
            isMobile: true,
          },
        },
      })

      const { queryByRole } = render(
        <AddToBagButton variantId="variant-1" isDesktopOnly={true} />,
        mobileOptions
      )

      expect(queryByRole('button')).not.toBeInTheDocument()
    })

    it('should render when isDesktopOnly={true} on desktop', () => {
      const { getByRole, debug } = render(
        <AddToBagButton variantId="variant-1" isDesktopOnly={true} />,
        defaultRenderOptions
      )

      debug()
      expect(getByRole('button')).toBeVisible()
    })

    it('should always render when both isMobileOnly and isDesktopOnly are false', () => {
      // Test on desktop
      const { getByTestId: getByTestIdDesktop } = render(
        <AddToBagButton
          variantId="variant-1"
          isMobileOnly={false}
          isDesktopOnly={false}
          dataQA="add-to-bag-btn-desktop"
        />,
        defaultRenderOptions
      )
      expect(getByTestIdDesktop('add-to-bag-btn-desktop')).toBeVisible()

      // Test on mobile
      const mobileOptions = merge({}, defaultRenderOptions, {
        contexts: {
          ViewportContext: {
            viewport: 'mobile' as const,
            isDesktop: false,
            isMobile: true,
          },
        },
      })

      const { getByTestId: getByTestIdMobile } = render(
        <AddToBagButton
          variantId="variant-1"
          isMobileOnly={false}
          isDesktopOnly={false}
          dataQA="add-to-bag-btn-mobile"
        />,
        mobileOptions
      )
      expect(getByTestIdMobile('add-to-bag-btn-mobile')).toBeVisible()
    })
  })

  describe('Button Disabled State', () => {
    it('should disable button when any flag is true', () => {
      jest.spyOn(useAddToCartHook, 'default').mockReturnValue({
        ...defaultUseAddToCartReturn,
        isDisabled: true,
        isMaxQuantityReached: true,
      })

      const { getByRole } = render(
        <AddToBagButton variantId="variant-1" disabled={true} />,
        defaultRenderOptions
      )

      expect(getByRole('button')).toBeDisabled()
    })

    it('should enable button when all flags are false', () => {
      const { getByRole } = render(
        <AddToBagButton variantId="variant-1" disabled={false} />,
        defaultRenderOptions
      )

      expect(getByRole('button')).not.toBeDisabled()
    })
  })

  describe('Button Text Priority', () => {
    it('should display "Item Limit Reached" when isMaxQuantityReached is true', () => {
      jest.spyOn(useAddToCartHook, 'default').mockReturnValue({
        ...defaultUseAddToCartReturn,
        isMaxQuantityReached: true,
      })

      const { getByText } = render(<AddToBagButton variantId="variant-1" />, defaultRenderOptions)

      expect(getByText('Item Limit Reached')).toBeVisible()
    })

    it('should display custom buttonCaption when provided', () => {
      const { getByText } = render(
        <AddToBagButton variantId="variant-1" buttonCaption="Add to Cart" />,
        defaultRenderOptions
      )

      expect(getByText('Add to Cart')).toBeVisible()
    })

    it('should display default "Add to Bag" text when no custom caption and not max quantity', () => {
      const { getByText } = render(<AddToBagButton variantId="variant-1" />, defaultRenderOptions)

      expect(getByText('Add to Bag')).toBeVisible()
    })
  })

  describe('Icon Display', () => {
    it('should not display icon when isMaxQuantityReached is true', () => {
      jest.spyOn(useAddToCartHook, 'default').mockReturnValue({
        ...defaultUseAddToCartReturn,
        isMaxQuantityReached: true,
      })

      const { container } = render(<AddToBagButton variantId="variant-1" />, defaultRenderOptions)

      const icon = container.querySelector('svg')
      expect(icon).not.toBeInTheDocument()
    })

    it('should display icon when isMaxQuantityReached is false', () => {
      const { container } = render(<AddToBagButton variantId="variant-1" />, defaultRenderOptions)

      const icon = container.querySelector('svg')
      expect(icon).toBeVisible()
    })

    it('should not display icon when hideIcon is true', () => {
      const { container } = render(
        <AddToBagButton variantId="variant-1" hideIcon />,
        defaultRenderOptions
      )
      expect(container.querySelector('svg')).not.toBeInTheDocument()
    })

    it('should display icon with neutral color when button is disabled', () => {
      const { container } = render(
        <AddToBagButton disabled={true} variantId="variant-1" />,
        defaultRenderOptions
      )

      const icon = container.querySelector('svg')
      expect(icon).toHaveAttribute('fill', 'var(--color-neutral-base)')
    })

    it('should display icon with black color when button is enabled', () => {
      const { container } = render(<AddToBagButton variantId="variant-1" />, defaultRenderOptions)

      const icon = container.querySelector('svg')
      expect(icon).toHaveAttribute('fill', 'var(--color-black-base)')
    })
  })

  describe('Click Handler', () => {
    it('should not call callbacks when button is disabled', async () => {
      const { user, getByRole } = render(
        <AddToBagButton variantId="variant-1" disabled={true} onClick={mockOnClick} />,
        defaultRenderOptions
      )

      const button = getByRole('button')
      await user.click(button)

      expect(mockAddToCart).not.toHaveBeenCalled()
      expect(mockOnClick).not.toHaveBeenCalled()
    })

    it('should call all callbacks which are inside the handler', async () => {
      const callOrder: string[] = []

      const trackingAddToCart = jest.fn(async () => {
        callOrder.push('addToCart')
      })
      const trackingOnClick = jest.fn(() => callOrder.push('onClick'))

      jest.spyOn(useAddToCartHook, 'default').mockReturnValue({
        ...defaultUseAddToCartReturn,
        addToCart: trackingAddToCart,
      })

      const { getByRole, user } = render(
        <AddToBagButton variantId="variant-1" onClick={trackingOnClick} />,
        defaultRenderOptions
      )

      const button = getByRole('button')
      await user.click(button)

      expect(callOrder).toEqual(['addToCart', 'onClick'])
    })
  })

  describe('Size Drawer', () => {
    const mockSizes = [
      { value: 'size-1', name: 'Small', orderable: true, variantId: 'variant-s' },
      { value: 'size-2', name: 'Medium', orderable: true, variantId: 'variant-m' },
      { value: 'size-3', name: 'Large', orderable: false, variantId: 'variant-l' },
    ]

    it('should render drawer when showSizesSelectionDesktop is true', () => {
      jest.spyOn(useAddToCartHook, 'default').mockReturnValue({
        ...defaultUseAddToCartReturn,
        showSizesSelectionDesktop: true,
      })

      const renderOptions = merge({}, defaultRenderOptions, {
        contexts: {
          JotaiProviderContext: new Map([
            [addToBagSizesAtom, mockSizes],
            [sizeDrawerVgIdAtom, 'vg-123'],
          ] as any),
        },
      }) as any

      const { getByTestId } = render(<AddToBagButton variantId="variant-1" />, renderOptions)

      expect(getByTestId('Size_drawer')).toBeVisible()
    })

    it('should not render drawer when showSizesSelectionDesktop is false', () => {
      const { queryByTestId } = render(
        <AddToBagButton variantId="variant-1" />,
        defaultRenderOptions
      )

      expect(queryByTestId('Size_drawer')).not.toBeInTheDocument()
    })

    it('should call onCloseSizeDrawer when drawer triggers close', async () => {
      jest.spyOn(useAddToCartHook, 'default').mockReturnValue({
        ...defaultUseAddToCartReturn,
        showSizesSelectionDesktop: true,
      })

      const renderOptions = {
        ...defaultRenderOptions,
        contexts: {
          ...defaultRenderOptions.contexts,
          JotaiProviderContext: new Map([
            [addToBagSizesAtom, mockSizes],
            [sizeDrawerVgIdAtom, 'vg-123'],
          ] as any),
        },
      } as any

      const { getByTestId, getByText, user } = render(
        <AddToBagButton variantId="variant-1" />,
        renderOptions
      )

      const drawer = getByTestId('Size_drawer')
      expect(drawer).toBeVisible()

      // Click on a size, which calls onAddToBagClick and then closeDrawer
      const sizeButton = getByText('small')
      await user.click(sizeButton)

      // Wait for async operations to complete
      await new Promise((resolve) => setTimeout(resolve, 0))

      // After clicking a size, the drawer should close (onCloseSizeDrawer is called internally)
      expect(mockOnCloseSizeDrawer).toHaveBeenCalled()
    })

    it('should call addToCartVariant with variantId when selection is made', async () => {
      jest.spyOn(useAddToCartHook, 'default').mockReturnValue({
        ...defaultUseAddToCartReturn,
        showSizesSelectionDesktop: true,
      })

      const renderOptions = {
        ...defaultRenderOptions,
        contexts: {
          ...defaultRenderOptions.contexts,
          JotaiProviderContext: new Map([
            [addToBagSizesAtom, mockSizes],
            [sizeDrawerVgIdAtom, 'vg-123'],
          ] as any),
        },
      } as any

      const { getByText, user } = render(<AddToBagButton variantId="variant-1" />, renderOptions)

      // Click on the first size button (Small)
      const sizeButton = getByText('small')
      await user.click(sizeButton)

      expect(mockAddToCartVariant).toHaveBeenCalledTimes(1)
      expect(mockAddToCartVariant).toHaveBeenCalledWith('variant-s')
    })
  })

  describe('Disabled State Callback', () => {
    it('should call setIsATBButtonDisabled on mount and when isDisabled changes', () => {
      jest.spyOn(useAddToCartHook, 'default').mockReturnValue({
        ...defaultUseAddToCartReturn,
        isDisabled: false,
      })

      const { rerender } = render(
        <AddToBagButton
          variantId="variant-1"
          setIsATBButtonDisabled={mockSetIsATBButtonDisabled}
        />,
        defaultRenderOptions
      )

      expect(mockSetIsATBButtonDisabled).toHaveBeenCalledWith(false)

      jest.spyOn(useAddToCartHook, 'default').mockReturnValue({
        ...defaultUseAddToCartReturn,
        isDisabled: true,
      })

      rerender(
        <AddToBagButton variantId="variant-1" setIsATBButtonDisabled={mockSetIsATBButtonDisabled} />
      )

      expect(mockSetIsATBButtonDisabled).toHaveBeenCalledWith(true)
    })

    it('should handle undefined setIsATBButtonDisabled callback gracefully', () => {
      expect(() => {
        render(<AddToBagButton variantId="variant-1" />, defaultRenderOptions)
      }).not.toThrow()
    })
  })
})
