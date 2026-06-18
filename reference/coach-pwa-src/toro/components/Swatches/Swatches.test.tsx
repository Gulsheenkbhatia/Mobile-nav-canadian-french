import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Swatches from 'toro/components/Swatches/index'
import { colorsMock } from 'toro/components/Swatches/Swatches.mock'
import { mockIntersectionObserver } from 'test-utils/mock-utils'

jest.mock('toro/hooks/useViewportType', () =>
  jest.fn(() => ({
    isDesktop: false,
    isMobile: true,
  }))
)

jest.mock('toro/hooks/usePageType', () =>
  jest.fn(() => ({
    isPLP: true,
  }))
)

const mockOnChange = jest.fn(() => undefined)
const mockOnArrowClick = jest.fn(() => undefined)

mockIntersectionObserver()
describe('Swatches', () => {
  it('Swatches has all initial components', () => {
    render(
      <Swatches
        styles={{}}
        minHeight="24px"
        colors={colorsMock}
        onChange={mockOnChange}
        activeColorId={colorsMock[0].id}
        onArrowClick={mockOnArrowClick}
      />
    )

    const slides = screen.getAllByTestId('swatches_slide')
    const swatches = screen.getAllByTestId('swatches_slide_swatch')
    const nextSlideBtn = screen.getByRole('button')
    const swatchItem = screen.getAllByTestId('swatches_slide_swatch')[0]

    expect(slides.length).toEqual(2)
    expect(swatches.length).toEqual(6)
    expect(nextSlideBtn).toBeInTheDocument()
    expect(swatchItem).toHaveClass('activeColorSwatch')
  })
  it('swatch handles onChange event', async () => {
    render(
      <Swatches
        styles={{}}
        minHeight="24px"
        colors={colorsMock}
        onChange={mockOnChange}
        activeColorId={undefined}
        onArrowClick={mockOnArrowClick}
      />
    )

    await userEvent.click(screen.getAllByTestId('swatches_slide_swatch')[0])
    await waitFor(() => expect(mockOnChange).toHaveBeenCalledWith(colorsMock[0]))
  })
})
