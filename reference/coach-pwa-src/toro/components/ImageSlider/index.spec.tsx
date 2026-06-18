import React from 'react'
import { render, fireEvent, CustomRenderOptions } from 'test-utils/react'
import ImageSliderComponent, { ImageSliderProps } from 'toro/components/ImageSlider/index'
import * as utils from 'jotai/utils'

jest.mock('toro/icons', () => ({
  NavChevronLeftIcon: () => <div>Left Icon</div>,
  NavChevronLeftBoldIcon: () => <div>Left Icon</div>,
  NavChevronRightIcon: () => <div>Right Icon</div>,
  NavChevronRightBoldIcon: () => <div>Right Icon</div>,
}))

Object.defineProperty(HTMLElement.prototype, 'scrollTo', {
  configurable: true,
  value: jest.fn(),
})

const renderOptions: CustomRenderOptions = {
  contexts: {
    PWAContext: {
      appData: {},
    },
  },
}

const children = [
  <div key="1">Slide 1</div>,
  <div key="2">Slide 2</div>,
  <div key="3">Slide 3</div>,
]

const defaultProps: ImageSliderProps = {
  id: 'test-slider',
  swipeable: true,
  arrows: true,
  dots: true,
  isDesktop: true,
  children,
  styles: {
    dotsContainer: {},
  },
}

const makeSetup = (props: any = {}) => {
  const combinedProps = { ...defaultProps, ...props }
  return render(<ImageSliderComponent {...combinedProps} />, renderOptions)
}

describe('ImageSliderComponent', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should render the slider with children', () => {
    const { getByText } = makeSetup()
    expect(getByText('Slide 1')).toBeInTheDocument()
    expect(getByText('Slide 2')).toBeInTheDocument()
    expect(getByText('Slide 3')).toBeInTheDocument()
  })

  it('should display right arrow correctly', () => {
    const { getByText } = makeSetup()
    expect(getByText('Right Icon')).toBeInTheDocument()
  })

  it('should display left arrow correctly', () => {
    const { getByText, container } = makeSetup()
    Object.defineProperty(container.firstChild.firstChild, 'scrollWidth', {
      value: 900,
      writable: true,
    })
    Object.defineProperty(container.firstChild.firstChild, 'scrollLeft', {
      value: 300,
      writable: true,
    })
    fireEvent.scroll(container.firstChild.firstChild)
    expect(getByText('Left Icon')).toBeInTheDocument()
  })

  it('should call onArrowClick when right arrow is clicked', async () => {
    const onArrowClickProp = jest.fn()
    const { user, getByText } = makeSetup({ onArrowClick: onArrowClickProp })
    await user.click(getByText('Right Icon'))
    expect(onArrowClickProp).toHaveBeenCalledWith('right', 0)
  })

  it('should call onArrowClick when left arrow is clicked', async () => {
    const onArrowClickProp = jest.fn()
    const { user, getByText, container } = makeSetup({ onArrowClick: onArrowClickProp })
    Object.defineProperty(container.firstChild.firstChild, 'scrollWidth', {
      value: 900,
      writable: true,
    })
    Object.defineProperty(container.firstChild.firstChild, 'scrollLeft', {
      value: 300,
      writable: true,
    })
    fireEvent.scroll(container.firstChild.firstChild)
    await user.click(getByText('Left Icon'))
    expect(onArrowClickProp).toHaveBeenCalledWith('left', 1)
  })

  it('should render right arrow when scroll width is zero', () => {
    const { getByText, container } = makeSetup()
    Object.defineProperty(container.firstChild.firstChild, 'scrollWidth', {
      value: 0,
      writable: true,
    })
    fireEvent.scroll(container.firstChild.firstChild)
    expect(getByText('Right Icon')).toBeInTheDocument()
  })

  it('should call onSlideChange when slide changes', () => {
    const mockOnSlideChange = jest.fn()
    const { container } = makeSetup({ onSlideChange: mockOnSlideChange })
    Object.defineProperty(container.firstChild.firstChild, 'scrollWidth', {
      value: 900,
      writable: true,
    })
    Object.defineProperty(container.firstChild.firstChild, 'scrollLeft', {
      value: 300,
      writable: true,
    })
    fireEvent.scroll(container.firstChild.firstChild)
    expect(mockOnSlideChange).toHaveBeenCalledWith(1, false)
  })

  it('should display dots if there are multiple slides and dots prop is true', () => {
    const { getByTestId } = makeSetup()
    expect(getByTestId('m_plp_btn_img_slickdots')).toBeInTheDocument()
  })

  it('should not display dots if dots prop is false', () => {
    const { container } = makeSetup({ dots: false })
    const dots = container.querySelectorAll('[data-testid="pagination-dot"]')
    expect(dots.length).toBe(0)
  })

  it('should not display arrows if arrows prop is false', () => {
    const { queryByText } = makeSetup({ arrows: false })
    expect(queryByText('Left Icon')).not.toBeInTheDocument()
    expect(queryByText('Right Icon')).not.toBeInTheDocument()
  })

  it('should render correctly when isPlpV3 is true', () => {
    jest.spyOn(utils, 'useAtomValue').mockReturnValue(true)
    const { getByText } = makeSetup()
    expect(getByText('Slide 1')).toBeInTheDocument()
    expect(getByText('Slide 2')).toBeInTheDocument()
    expect(getByText('Slide 3')).toBeInTheDocument()
  })

  it('should trigger slideForward method which is called using ref', () => {
    const ref = React.createRef<{ slideForward: () => void }>()
    const { container } = makeSetup({ ref })
    const slider = container.firstChild as HTMLElement
    const scrollToMock = jest.spyOn(slider, 'scrollTo').mockImplementation(() => {})
    ref.current?.slideForward()
    expect(scrollToMock).toHaveBeenCalledWith({ left: slider.clientWidth, behavior: 'smooth' })
    scrollToMock.mockRestore()
  })
})
