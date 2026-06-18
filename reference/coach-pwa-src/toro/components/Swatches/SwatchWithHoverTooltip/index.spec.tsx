import React from 'react'
import { render } from 'test-utils/react'
import { waitFor } from '@testing-library/react'
import SwatchWithHoverTooltip from 'toro/components/Swatches/SwatchWithHoverTooltip/index'
import { mockIntersectionObserver } from 'test-utils/mock-utils'

jest.mock('toro/hooks/useViewportType', () => () => ({ isMobile: false, isDesktop: true }))
mockIntersectionObserver()

describe('SwatchWithHoverTooltip', () => {
  const baseProps = {
    color: {
      id: '1',
      text: 'Red',
      image: { src: 'red.png', alt: 'red' },
      orderable: true,
    },
    isActive: false,
    onChange: jest.fn(),
    styles: {},
    productIdAttr: 'product-1',
    tooltipProps: {},
    showTooltip: true,
  }

  const makeSetup = (customProps: any = {}) => {
    return render(<SwatchWithHoverTooltip {...baseProps} {...customProps} />, {
      contexts: { PWAContext: { appData: {} }, AnalyticsContext: {} },
    })
  }

  it('renders swatches correctly with given props', async () => {
    const { getByAltText } = makeSetup({ lazy: false })
    await waitFor(() => expect(getByAltText('red')).toBeVisible())
  })

  it('handles isActive prop change', () => {
    const { rerender, getByTestId } = makeSetup()
    const swatch = getByTestId('swatches_slide_swatch')
    expect(swatch).not.toHaveClass('activeColorSwatch')
    rerender(<SwatchWithHoverTooltip {...baseProps} isActive={true} />)
    expect(swatch).toHaveClass('activeColorSwatch')
  })
})
