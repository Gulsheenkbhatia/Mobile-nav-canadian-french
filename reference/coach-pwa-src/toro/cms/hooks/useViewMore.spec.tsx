import React, { useRef, useEffect } from 'react'
import { render, screen } from 'test-utils/react'
import { useViewMore } from './useViewMore'
import { applySplideSlidersForNode } from 'toro/helpers/home'
import useViewportType from 'toro/hooks/useViewportType'

jest.mock('toro/helpers/home', () => ({
  applySplideSlidersForNode: jest.fn(),
}))

jest.mock('toro/hooks/useViewportType', () => ({
  __esModule: true,
  default: jest.fn(() => ({ isMobile: false })),
}))

const mockUseViewportType = jest.mocked(useViewportType)

const RegularTestComponent = () => {
  const setNode = useViewMore()
  const ref = useRef(null)

  useEffect(() => {
    if (ref.current) {
      setNode(ref.current)
    }
  }, [setNode])

  return (
    <div ref={ref}>
      <div className="mol-product-4up-grid">
        <button className="view-more">View More</button>
        <button className="view-less d-none">View Less</button>
        <div className="view-more-item d-none">Item 1</div>
        <div className="view-more-item d-none">Item 2</div>
        <div className="view-more-item d-none">Item 3</div>
        <div className="view-more-item d-none">Item 4</div>
        <div className="view-more-item d-none">Item 5</div>
        <div className="view-more-item d-none">Item 6</div>
      </div>
    </div>
  )
}

const DynamicTestComponent = ({ isMobile = false }) => {
  const setNode = useViewMore()
  const ref = useRef(null)

  useEffect(() => {
    if (ref.current) {
      setNode(ref.current)
    }
  }, [setNode])

  const suffix = isMobile ? '-mob' : '-desk'

  return (
    <div ref={ref}>
      <div className="mol-content-card-container">
        <div
          className="content-container"
          data-mobile-card="2"
          data-desktop-card="3"
          data-collapse-after-mob="1"
          data-collapse-after-desk="2"
        >
          <button className={`view-more${suffix}`}>View More</button>
          <button className={`view-less${suffix} d-none`}>View Less</button>
          <div className={`view-more-stack${suffix}`}>
            <div>Card 1</div>
            <div>Card 2</div>
            <div>Card 3</div>
            <div>Card 4</div>
            <div>Card 5</div>
          </div>
        </div>
      </div>
    </div>
  )
}

describe('useViewMore', () => {
  beforeAll(() => {
    HTMLElement.prototype.scrollIntoView = jest.fn()
  })

  beforeEach(() => {
    document.body.innerHTML = ''
    jest.clearAllMocks()
    mockUseViewportType.mockReturnValue({ isMobile: false })
  })

  describe('Regular View More (Product Grids)', () => {
    it('should initialize with all items hidden and "View Less" hidden', () => {
      render(<RegularTestComponent />)

      const items = document.querySelectorAll('.view-more-item')
      const viewMoreButton = screen.getByText('View More')
      const viewLessButton = screen.getByText('View Less')

      items.forEach((item) => {
        expect(item.classList.contains('d-none')).toBe(true)
      })

      expect(viewMoreButton.classList.contains('d-none')).toBe(false)
      expect(viewLessButton.classList.contains('d-none')).toBe(true)
    })

    it('should show 4 items when "View More" is clicked', async () => {
      const { user } = render(<RegularTestComponent />)

      const items = document.querySelectorAll('.view-more-item')
      const viewMoreButton = screen.getByText('View More')

      await user.click(viewMoreButton)

      expect(items[0].classList.contains('d-none')).toBe(false)
      expect(items[1].classList.contains('d-none')).toBe(false)
      expect(items[2].classList.contains('d-none')).toBe(false)
      expect(items[3].classList.contains('d-none')).toBe(false)
      expect(items[4].classList.contains('d-none')).toBe(true)
      expect(items[5].classList.contains('d-none')).toBe(true)

      const viewLessButton = screen.getByText('View Less')
      expect(viewMoreButton.classList.contains('d-none')).toBe(false)
      expect(viewLessButton.classList.contains('d-none')).toBe(true)
    })

    it('should show all items after multiple clicks of "View More"', async () => {
      const { user } = render(<RegularTestComponent />)

      const items = document.querySelectorAll('.view-more-item')
      const viewMoreButton = screen.getByText('View More')

      await user.click(viewMoreButton)
      await user.click(viewMoreButton)

      items.forEach((item) => {
        expect(item.classList.contains('d-none')).toBe(false)
      })

      const viewLessButton = screen.getByText('View Less')
      expect(viewMoreButton.classList.contains('d-none')).toBe(true)
      expect(viewLessButton.classList.contains('d-none')).toBe(false)
    })

    it('should reset to all items hidden when "View Less" is clicked', async () => {
      const { user } = render(<RegularTestComponent />)

      const items = document.querySelectorAll('.view-more-item')
      const viewMoreButton = screen.getByText('View More')
      const viewLessButton = screen.getByText('View Less')

      await user.click(viewMoreButton)
      await user.click(viewMoreButton)

      await user.click(viewLessButton)

      items.forEach((item) => {
        expect(item.classList.contains('d-none')).toBe(true)
      })

      expect(viewMoreButton.classList.contains('d-none')).toBe(false)
      expect(viewLessButton.classList.contains('d-none')).toBe(true)
    })

    it('should clean up event listeners on unmount', () => {
      const { unmount } = render(<RegularTestComponent />)

      const viewMoreButton = screen.getByText('View More')
      const viewLessButton = screen.getByText('View Less')

      const removeEventListenerSpyMore = jest.spyOn(viewMoreButton, 'removeEventListener')
      const removeEventListenerSpyLess = jest.spyOn(viewLessButton, 'removeEventListener')

      unmount()

      expect(removeEventListenerSpyMore).toHaveBeenCalledWith('click', expect.any(Function))
      expect(removeEventListenerSpyLess).toHaveBeenCalledWith('click', expect.any(Function))
    })

    it('should call applySplideSlidersForNode when "View More" is clicked', async () => {
      const { container, user } = render(<RegularTestComponent />)
      const viewMoreButton = screen.getByText('View More')

      await user.click(viewMoreButton)
      const gridElement = container.querySelector('.mol-product-4up-grid')

      expect(applySplideSlidersForNode).toHaveBeenCalledWith(gridElement)
      expect(applySplideSlidersForNode).toHaveBeenCalledTimes(1)
    })
  })

  describe('Dynamic View More (Content Card Container)', () => {
    it('should initialize with correct number of visible cards based on dataset for desktop', () => {
      mockUseViewportType.mockReturnValue({ isMobile: false })

      render(<DynamicTestComponent isMobile={false} />)

      const cards = document.querySelectorAll('.view-more-stack-desk > div')
      const viewMoreButton = screen.getByText('View More')
      const viewLessButton = screen.getByText('View Less')

      expect(cards[0].classList.contains('d-none')).toBe(false)
      expect(cards[1].classList.contains('d-none')).toBe(false)
      expect(cards[2].classList.contains('d-none')).toBe(true)
      expect(cards[3].classList.contains('d-none')).toBe(true)
      expect(cards[4].classList.contains('d-none')).toBe(true)

      expect(viewMoreButton.classList.contains('d-none')).toBe(false)
      expect(viewLessButton.classList.contains('d-none')).toBe(true)
    })

    it('should show more cards when "View More" is clicked for desktop', async () => {
      const { user } = render(<DynamicTestComponent isMobile={false} />)

      const cards = document.querySelectorAll('.view-more-stack-desk > div')
      const viewMoreButton = screen.getByText('View More')

      await user.click(viewMoreButton)

      expect(cards[0].classList.contains('d-none')).toBe(false)
      expect(cards[1].classList.contains('d-none')).toBe(false)
      expect(cards[2].classList.contains('d-none')).toBe(false)
      expect(cards[3].classList.contains('d-none')).toBe(false)
      expect(cards[4].classList.contains('d-none')).toBe(false)

      expect(viewMoreButton.classList.contains('d-none')).toBe(true)
    })

    it('should initialize with correct number of visible cards for mobile', () => {
      mockUseViewportType.mockReturnValue({ isMobile: true })

      render(<DynamicTestComponent isMobile={true} />)

      const cards = document.querySelectorAll('.view-more-stack-mob > div')
      const viewMoreButtonMobile = document.querySelector('.view-more-mob')

      expect(cards[0].classList.contains('d-none')).toBe(false)
      expect(cards[1].classList.contains('d-none')).toBe(true)
      expect(cards[2].classList.contains('d-none')).toBe(true)
      expect(cards[3].classList.contains('d-none')).toBe(true)
      expect(cards[4].classList.contains('d-none')).toBe(true)

      expect(viewMoreButtonMobile.classList.contains('d-none')).toBe(false)
    })

    it('should reset to initial visible count when "View Less" is clicked', async () => {
      const { user } = render(<DynamicTestComponent isMobile={false} />)

      const cards = document.querySelectorAll('.view-more-stack-desk > div')
      const viewMoreButton = screen.getByText('View More')
      const viewLessButton = screen.getByText('View Less')

      await user.click(viewMoreButton)

      await user.click(viewLessButton)

      expect(cards[0].classList.contains('d-none')).toBe(false)
      expect(cards[1].classList.contains('d-none')).toBe(false)
      expect(cards[2].classList.contains('d-none')).toBe(true)
      expect(cards[3].classList.contains('d-none')).toBe(true)
      expect(cards[4].classList.contains('d-none')).toBe(true)

      expect(viewMoreButton.classList.contains('d-none')).toBe(false)
      expect(viewLessButton.classList.contains('d-none')).toBe(true)
    })
  })
})
