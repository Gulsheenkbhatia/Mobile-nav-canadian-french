import React from 'react'
import { render, screen } from 'test-utils/react'
import { act, waitFor } from '@testing-library/react'
import SwatchWithMobileTooltip from 'toro/components/Swatches/SwatchWithMobileTooltip' // Adjust the import path as necessary
import { mockIntersectionObserver } from 'test-utils/mock-utils'
import usePreference from 'toro/hooks/usePreference_new'

jest.mock('toro/hooks/usePreference_new')
jest.mock('toro/hooks/useFlockSwatchImageUrl', () => ({
  useFlockSwatchImageUrl: jest.fn(() => null),
}))
jest.mock('toro/hooks/useTemplate', () => jest.fn(() => false))
jest.mock('next/navigation', () => {
  return {
    usePathname: () => '/product',
  }
})

jest.mock('toro/hooks/useViewportType', () => () => ({ isMobile: true, viewport: 'mobile' }))
mockIntersectionObserver()

describe('SwatchWithMobileTooltip', () => {
  beforeEach(() => {
    ;(usePreference as jest.MockedFn<typeof usePreference>).mockReturnValue({
      coachtopia: {
        coachtopiaHomeURL: '/shop/testBrand',
      },
      pdpPreferences: {
        enableFlockColorSwatches: false,
      },
      sceneSeven: {
        placeholderAssetName: 'is/image/Coach/placeholder',
      },
    })
  })

  const imageData = {
    alt: '',
    src: '',
  }

  const baseProps = {
    color: {
      masterId: '',
      id: '1',
      text: 'Red',
      image: { src: 'red.png', alt: 'red' },
      orderable: true,
      displayifOOS: false,
      isOnSale: false,
      url: '',
      vgId: '1',
      media: {
        full: [],
        sequence: [],
        thumbnail: imageData,
        thumbnails: [],
      },
    },
    isActive: false,
    onChange: jest.fn(),
    styles: {},
    productIdAttr: 'product-1',
    tooltipProps: {},
    showTooltip: true,
  }

  const makeSetup = (customProps: any = {}, userSetupOptions = undefined) => {
    return render(<SwatchWithMobileTooltip {...baseProps} {...customProps} />, {
      contexts: { PWAContext: { appData: {} }, AnalyticsContext: {} },
      userSetupOptions,
    })
  }

  it('renders swatches correctly with given props', async () => {
    const { getByAltText } = makeSetup({ lazy: false })
    await waitFor(() => {
      expect(getByAltText('red')).toBeVisible()
    })
  })

  it('toggles tooltip visibility on mouse over', async () => {
    const { user, getByTestId } = makeSetup({ isActive: true, orderable: false, pageType: 'plp' })
    await waitFor(() => {
      expect(screen.queryByRole('tooltip')).not.toBeVisible()
    })

    const swatch = getByTestId('swatches_slide_swatch')
    await user.hover(swatch)
    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeVisible()
    })
  })

  it('calls onChange on click', async () => {
    const { user, getByTestId } = makeSetup()
    const swatch = getByTestId('swatches_slide_swatch')
    await waitFor(() => {
      expect(swatch).not.toHaveClass('activeColorSwatch')
    })
    await user.click(swatch)
    await waitFor(() => {
      expect(baseProps.onChange).toHaveBeenCalled()
    })
  })

  it('closes tooltip on outside click', async () => {
    const { user, getByTestId, rerender } = makeSetup({ isActive: true, isOpen: true })

    const swatch = getByTestId('swatches_slide_swatch')
    await user.hover(swatch)
    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeVisible()
    })

    // Simulate outside click
    await user.click(document.body)

    // Rerender with updated props
    rerender(<SwatchWithMobileTooltip {...baseProps} isActive={false} />)

    await waitFor(
      () => {
        const tooltip = screen.getByRole('tooltip')
        const opacity = parseFloat(tooltip.style.opacity || '1')

        expect(opacity).not.toBe(1)
      },
      { timeout: 50 }
    )
  })

  it('handles isActive prop change', async () => {
    const { rerender, getByTestId } = makeSetup()
    const swatch = getByTestId('swatches_slide_swatch')
    await waitFor(() => {
      expect(swatch).not.toHaveClass('activeColorSwatch')
    })
    rerender(<SwatchWithMobileTooltip {...baseProps} isActive={true} />)
    await waitFor(() => {
      expect(swatch).toHaveClass('activeColorSwatch')
    })
  })

  it('correctly toggles tooltip when swatch is active and clicked again', async () => {
    const { user, getByTestId } = makeSetup({ isActive: true })
    const swatch = getByTestId('swatches_slide_swatch')

    await user.click(swatch)
    await waitFor(
      () => {
        const tooltip = screen.getByRole('tooltip')
        const opacity = parseFloat(tooltip.style.opacity || '1')

        expect(opacity).not.toBe(1)
      },
      { timeout: 50 }
    )
  })

  it('automatically closes tooltip after 3 seconds when opened', async () => {
    jest.useFakeTimers()
    const { user, getByTestId } = makeSetup(
      { isActive: true },
      { advanceTimers: jest.advanceTimersByTime }
    )

    const swatch = getByTestId('swatches_slide_swatch')
    await user.hover(swatch)
    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeVisible()
    })

    act(() => {
      jest.advanceTimersByTime(3000)
    })
    await waitFor(() => {
      expect(screen.getByRole('tooltip')).not.toBeVisible()
    })
    jest.useRealTimers()
  })
})
