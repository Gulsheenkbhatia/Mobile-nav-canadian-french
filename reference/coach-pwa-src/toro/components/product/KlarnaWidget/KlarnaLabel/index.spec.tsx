import React from 'react'
import { render, CustomRenderOptions } from 'test-utils/react'
import KlarnaLabel from 'toro/components/product/KlarnaWidget/KlarnaLabel'
import useExperiment from 'toro/hooks/useExperiment'
import { mockIntersectionObserver } from 'test-utils/mock-utils'
import usePreference from 'toro/hooks/usePreference_new'

jest.mock('toro/hooks/usePreference_new')
jest.mock('next/navigation', () => {
  return {
    usePathname: () => '/product',
  }
})
jest.mock('toro/hooks/useExperiment')
jest.mocked(useExperiment).mockImplementation(() => false)

const renderOptions: CustomRenderOptions = {
  contexts: {
    PWAContext: {
      appData: {},
    },
  },
}

jest.mock('toro/hooks/useExperiment')
jest.mock('jotai/utils')
jest.mock('toro/hooks/useViewportType', () => {
  return jest.fn(() => ({
    isDesktop: false,
    isMobile: true,
  }))
})

mockIntersectionObserver()
describe('KlarnaLabel', () => {
  const setup = (props = {}) => {
    return render(
      <KlarnaLabel
        textMain={{ value: 'Buy now, pay later with Klarna.' }}
        onClick={jest.fn()}
        onMouseEnter={jest.fn()}
        {...props}
      />,
      renderOptions
    )
  }

  beforeEach(() => {
    ;(usePreference as jest.MockedFn<typeof usePreference>).mockReturnValue({
      coachtopia: {
        coachtopiaHomeURL: '/shop/testBrand',
      },
    })
  })

  it('renders learn more button if learnMoreLabel is provided', () => {
    const { container } = setup({
      learnMoreLabel: { url: 'https://learnmore.url' },
    })
    const klarnaContainer = container.querySelector('.klarna-learn-more')
    expect(klarnaContainer).toBeVisible()
  })

  it('calls onClick and onMouseEnter handlers', async () => {
    const onClick = jest.fn()
    const onMouseEnter = jest.fn()
    const { user, container } = setup({
      learnMoreLabel: { url: 'https://learnmore.url' },
      onClick,
      onMouseEnter,
    })
    const button = container.querySelector('.klarna-learn-more')
    await user.click(button)
    await user.hover(button)

    expect(onClick).toHaveBeenCalled()
    expect(onMouseEnter).toHaveBeenCalled()
  })

  it('renders the Klarna container with expected default classes', () => {
    const { container } = setup()
    const klarnaContainer = container.querySelector('.klarna-details')
    expect(klarnaContainer.parentElement).toHaveClass('klarna-container')
  })
  it('renders when logo has the url provided', () => {
    jest.mocked(useExperiment).mockImplementation(() => true)
    const { getByTestId } = setup({ logo: { url: 'https://logo.url', alt: 'Klarna Logo' } })
    expect(getByTestId('cm_body_pdt_pomocallout')).toBeVisible()
  })
})
