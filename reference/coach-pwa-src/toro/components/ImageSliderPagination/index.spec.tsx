import React from 'react'
import { render } from 'test-utils/react'
import ImageSliderPagination, { ImageSliderPaginationProps } from './index'

const dotsContainerQa = 'm_plp_btn_img_slickdots'

const renderComponent = (props: Partial<ImageSliderPaginationProps> = {}) => {
  const defaultProps: ImageSliderPaginationProps = {
    activeSlideIndex: 0,
    totalSlidesNum: 5,
    variant: undefined,
    styles: {
      dotsContainer: {},
      dot: {},
      sliderLine: {},
      slider: {},
    },
  }

  return render(<ImageSliderPagination {...defaultProps} {...props} />, { contexts: {} })
}

describe('ImageSliderPagination', () => {
  it('should render dots container with correct qa attribute', () => {
    const { getByTestId } = renderComponent()
    expect(getByTestId(dotsContainerQa)).toBeInTheDocument()
  })

  it('should render the correct number of dots when variant is not provided', () => {
    const { container } = renderComponent({ totalSlidesNum: 3 })
    const dots = container.querySelector(`[data-qa="${dotsContainerQa}"]`).children
    expect(dots.length).toBe(3)
  })

  it('should apply active class to the active slide dot', () => {
    const { container } = renderComponent({ activeSlideIndex: 1, totalSlidesNum: 3 })
    const dots = container.querySelector(`[data-qa="${dotsContainerQa}"]`).children
    expect(dots[1]).toHaveClass('active')
  })

  it('should not render dots when variant is "slide"', () => {
    const { container } = renderComponent({ variant: 'slide', totalSlidesNum: 3 })
    const dots = container.querySelector(`[data-qa="${dotsContainerQa}"]`).children
    expect(dots.length).toBe(1) // Only the slider parent should be rendered
  })
})
