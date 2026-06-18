import { render, waitFor } from 'test-utils/react'
import userEvent from '@testing-library/user-event'
import { mockIntersectionObserver } from 'test-utils/mock-utils'
import Swatch, { shouldSwatchPreventRender } from 'toro/components/Swatches/Swatch'

jest.mock('toro/hooks/useViewportType', () =>
  jest.fn(() => ({
    isDesktop: true,
    isMobile: false,
  }))
)

mockIntersectionObserver()
describe('Swatch', () => {
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
  }

  const makeSetup = (customProps: any = {}) => {
    return render(<Swatch {...baseProps} {...customProps} />, {
      contexts: { PWAContext: { appData: {} }, AnalyticsContext: {} },
    })
  }
  it('renders swatch component correctly', async () => {
    const { getByAltText } = makeSetup({ lazy: false })
    await waitFor(() => expect(getByAltText('red')).toBeVisible())
  })

  it('handles keyPress event on image', async () => {
    const { getByAltText } = makeSetup({ lazy: false })
    const user = userEvent.setup()

    await waitFor(async () => {
      const image = getByAltText('red')
      await user.type(image, '{enter}')
      expect(baseProps.onChange).toHaveBeenCalled()
    })
  })
})

describe('shouldSwatchPreventRender Function', () => {
  it('prevents re-render if isActive and color.id have not changed', () => {
    const prevProps = {
      isActive: true,
      color: { id: '1', text: 'Red' },
    }
    const nextProps = {
      isActive: true,
      color: { id: '1', text: 'Blue' },
    }
    expect(shouldSwatchPreventRender(prevProps, nextProps)).toBeTruthy()
  })

  it('allows re-render if isActive has changed', () => {
    const prevProps = {
      isActive: false,
      color: { id: '1', text: 'Red' },
    }
    const nextProps = {
      isActive: true,
      color: { id: '1', text: 'Red' },
    }
    expect(shouldSwatchPreventRender(prevProps, nextProps)).toBeFalsy()
  })

  it('allows re-render if color.id has changed', () => {
    const prevProps = {
      isActive: true,
      color: { id: '1', text: 'Red' },
    }
    const nextProps = {
      isActive: true,
      color: { id: '2', text: 'Red' },
    }
    expect(shouldSwatchPreventRender(prevProps, nextProps)).toBeFalsy()
  })
})
