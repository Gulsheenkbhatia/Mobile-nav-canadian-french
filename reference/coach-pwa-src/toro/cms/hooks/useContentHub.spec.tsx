import React, { useRef, useEffect } from 'react'
import { render } from 'test-utils/react'
import { useContentHub } from './useContentHub'

const ArticleCard = ({ index, hidden }: { index: number; hidden: boolean }) => (
  <div
    className="content-hub-v2__article-card"
    data-qa={`card-${index}`}
    {...(hidden ? { 'data-hidden': 'true' } : {})}
  >
    Card {index}
  </div>
)

const SeeMoreTestComponent = ({
  isDesktop = true,
  totalCards = 6,
  initialVisible = 3,
  cardsPerClickDesktop = 2,
  cardsPerClickMobile = 1,
  invalidPerClick = false,
}: {
  isDesktop?: boolean
  totalCards?: number
  initialVisible?: number
  cardsPerClickDesktop?: number | string
  cardsPerClickMobile?: number | string
  invalidPerClick?: boolean
}) => {
  const initializeContentHub = useContentHub(isDesktop)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (ref.current) {
      initializeContentHub(ref.current)
    }
  }, [initializeContentHub])

  return (
    <div ref={ref}>
      <article className="mol-content-hub-v2">
        <div
          className="content-hub-v2__article-cards-section"
          data-cards-per-click-desktop={invalidPerClick ? 'abc' : String(cardsPerClickDesktop)}
          data-cards-per-click-mobile={invalidPerClick ? '' : String(cardsPerClickMobile)}
        >
          <div className="content-hub-v2__article-cards-grid">
            {Array.from({ length: totalCards }, (_, i) => (
              <ArticleCard key={i} index={i} hidden={i >= initialVisible} />
            ))}
          </div>
          <div className="content-hub-v2__see-more-btn">
            <button className="content-hub-v2__see-more-trigger" type="button">
              SEE MORE ARTICLES
            </button>
          </div>
        </div>
      </article>
    </div>
  )
}

const TestComponent = ({ isDesktop = true }: { isDesktop?: boolean }) => {
  const initializeContentHub = useContentHub(isDesktop)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (ref.current) {
      initializeContentHub(ref.current)
    }
  }, [initializeContentHub])

  return (
    <div ref={ref}>
      <article className="mol-content-hub">
        <div className="tabs-wrapper">
          <ul className="nav desktop-tab-nav" role="tablist">
            <li className="nav-item" role="presentation">
              <button
                className="nav-link active"
                id="all-tab"
                data-bs-toggle="tab"
                data-bs-target="#_all"
                type="button"
                role="tab"
                aria-controls="all"
                aria-selected="true"
              >
                All
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className="nav-link"
                id="design-tab"
                data-bs-toggle="tab"
                data-bs-target="#_design"
                type="button"
                role="tab"
                aria-controls="design"
                aria-selected="false"
              >
                Design
              </button>
            </li>
          </ul>

          <div className="mobile-tab-dropdown">
            <div className="mobile-dropdown-container">
              <div className="mobile-dropdown">
                <button className="dropdown-button" type="button">
                  <span className="selected-value">All</span>
                </button>
                <div className="dropdown-menu">
                  <div className="dropdown-option selected" data-value="all" data-target="#_all">
                    All
                  </div>
                  <div className="dropdown-option" data-value="design" data-target="#_design">
                    Design
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="tab-content">
            <div
              className="tab-pane fade show active"
              id="_all"
              role="tabpanel"
              aria-labelledby="all-tab"
            >
              <div className="tab-content-list">All Content</div>
            </div>
            <div
              className="tab-pane fade"
              id="_design"
              role="tabpanel"
              aria-labelledby="design-tab"
            >
              <div className="tab-content-list">Design Content</div>
            </div>
          </div>
        </div>
      </article>
    </div>
  )
}

describe('useContentHub', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    jest.clearAllMocks()
  })

  describe('Desktop Tab Navigation', () => {
    it('should switch tabs when tab button is clicked', async () => {
      const { user } = render(<TestComponent isDesktop={true} />)

      const designTab = document.querySelector('#design-tab') as HTMLButtonElement
      const allTab = document.querySelector('#all-tab') as HTMLButtonElement
      const designPane = document.querySelector('#_design')
      const allPane = document.querySelector('#_all')

      await user.click(designTab)

      // Design tab should become active
      expect(designTab.classList.contains('active')).toBe(true)
      expect(designTab.getAttribute('aria-selected')).toBe('true')
      expect(designPane?.classList.contains('active')).toBe(true)
      expect(designPane?.classList.contains('show')).toBe(true)

      // All tab should become inactive
      expect(allTab.classList.contains('active')).toBe(false)
      expect(allTab.getAttribute('aria-selected')).toBe('false')
      expect(allPane?.classList.contains('active')).toBe(false)
      expect(allPane?.classList.contains('show')).toBe(false)
    })

    it('should initialize with correct active tab', () => {
      render(<TestComponent isDesktop={true} />)

      const allTab = document.querySelector('#all-tab') as HTMLButtonElement
      const allPane = document.querySelector('#_all')

      expect(allTab.classList.contains('active')).toBe(true)
      expect(allTab.getAttribute('aria-selected')).toBe('true')
      expect(allPane?.classList.contains('active')).toBe(true)
      expect(allPane?.classList.contains('show')).toBe(true)
    })
  })

  describe('Mobile Dropdown Navigation', () => {
    it('should toggle dropdown on button click', async () => {
      const { user } = render(<TestComponent isDesktop={false} />)

      const dropdownButton = document.querySelector('.dropdown-button') as HTMLButtonElement
      const mobileDropdown = document.querySelector('.mobile-dropdown')

      expect(mobileDropdown?.classList.contains('open')).toBe(false)

      await user.click(dropdownButton)
      expect(mobileDropdown?.classList.contains('open')).toBe(true)

      await user.click(dropdownButton)
      expect(mobileDropdown?.classList.contains('open')).toBe(false)
    })

    it('should switch tabs when dropdown option is clicked', async () => {
      const { user } = render(<TestComponent isDesktop={false} />)

      const dropdownButton = document.querySelector('.dropdown-button') as HTMLButtonElement
      const designOption = document.querySelector('[data-target="#_design"]') as HTMLElement
      const selectedValue = document.querySelector('.selected-value')
      const designTab = document.querySelector('#design-tab') as HTMLButtonElement
      const designPane = document.querySelector('#_design')
      const mobileDropdown = document.querySelector('.mobile-dropdown')

      // Open dropdown
      await user.click(dropdownButton)

      // Click design option
      await user.click(designOption)

      // Should update selected value
      expect(selectedValue?.textContent).toBe('Design')

      // Should switch to design tab
      expect(designTab.classList.contains('active')).toBe(true)
      expect(designPane?.classList.contains('active')).toBe(true)

      // Should close dropdown
      expect(mobileDropdown?.classList.contains('open')).toBe(false)

      // Should update option selection
      expect(designOption?.classList.contains('selected')).toBe(true)
    })

    it('should close dropdown when clicking outside', async () => {
      const { user } = render(<TestComponent isDesktop={false} />)

      const dropdownButton = document.querySelector('.dropdown-button') as HTMLButtonElement
      const mobileDropdown = document.querySelector('.mobile-dropdown')

      // Open dropdown
      await user.click(dropdownButton)
      expect(mobileDropdown?.classList.contains('open')).toBe(true)

      // Click outside
      await user.click(document.body)
      expect(mobileDropdown?.classList.contains('open')).toBe(false)
    })
  })

  describe('See More (v2)', () => {
    it('should initialize on a .mol-content-hub-v2 root', () => {
      render(<SeeMoreTestComponent isDesktop={true} totalCards={6} />)

      const hub = document.querySelector('.mol-content-hub-v2') as HTMLElement
      expect(hub).toBeTruthy()
      expect(hub.dataset.init).toBe('true')
    })

    it('should reveal the desktop per-click count of hidden cards on click', async () => {
      const { user } = render(
        <SeeMoreTestComponent
          isDesktop={true}
          totalCards={7}
          initialVisible={3}
          cardsPerClickDesktop={2}
        />
      )

      const allCards = document.querySelectorAll('.content-hub-v2__article-card')
      expect(allCards).toHaveLength(7)

      const hiddenBefore = document.querySelectorAll(
        '.content-hub-v2__article-card[data-hidden="true"]'
      )
      expect(hiddenBefore).toHaveLength(4)

      const seeMoreBtn = document.querySelector(
        '.content-hub-v2__see-more-trigger'
      ) as HTMLButtonElement
      await user.click(seeMoreBtn)

      const hiddenAfter = document.querySelectorAll(
        '.content-hub-v2__article-card[data-hidden="true"]'
      )
      expect(hiddenAfter).toHaveLength(2)
    })

    it('should reveal the mobile per-click count of hidden cards on click', async () => {
      const { user } = render(
        <SeeMoreTestComponent
          isDesktop={false}
          totalCards={6}
          initialVisible={3}
          cardsPerClickMobile={1}
        />
      )

      const hiddenBefore = document.querySelectorAll(
        '.content-hub-v2__article-card[data-hidden="true"]'
      )
      expect(hiddenBefore).toHaveLength(3)

      const seeMoreBtn = document.querySelector(
        '.content-hub-v2__see-more-trigger'
      ) as HTMLButtonElement
      await user.click(seeMoreBtn)

      const hiddenAfter = document.querySelectorAll(
        '.content-hub-v2__article-card[data-hidden="true"]'
      )
      expect(hiddenAfter).toHaveLength(2)
    })

    it('should add see-more--hidden to the button wrapper when all cards are revealed', async () => {
      const { user } = render(
        <SeeMoreTestComponent
          isDesktop={true}
          totalCards={5}
          initialVisible={3}
          cardsPerClickDesktop={2}
        />
      )

      const btnWrapper = document.querySelector('.content-hub-v2__see-more-btn') as HTMLElement
      expect(btnWrapper.classList.contains('see-more--hidden')).toBe(false)

      const seeMoreBtn = document.querySelector(
        '.content-hub-v2__see-more-trigger'
      ) as HTMLButtonElement
      await user.click(seeMoreBtn)

      expect(btnWrapper.classList.contains('see-more--hidden')).toBe(true)
    })

    it('should progressively reveal cards across multiple clicks', async () => {
      const { user } = render(
        <SeeMoreTestComponent
          isDesktop={true}
          totalCards={9}
          initialVisible={3}
          cardsPerClickDesktop={2}
        />
      )

      const seeMoreBtn = document.querySelector(
        '.content-hub-v2__see-more-trigger'
      ) as HTMLButtonElement
      const btnWrapper = document.querySelector('.content-hub-v2__see-more-btn') as HTMLElement

      const getHiddenCount = () =>
        document.querySelectorAll('.content-hub-v2__article-card[data-hidden="true"]').length

      expect(getHiddenCount()).toBe(6)

      await user.click(seeMoreBtn)
      expect(getHiddenCount()).toBe(4)

      await user.click(seeMoreBtn)
      expect(getHiddenCount()).toBe(2)

      await user.click(seeMoreBtn)
      expect(getHiddenCount()).toBe(0)
      expect(btnWrapper.classList.contains('see-more--hidden')).toBe(true)
    })

    it('should fall back to 3 when data-cards-per-click attribute is invalid', async () => {
      const { user } = render(
        <SeeMoreTestComponent
          isDesktop={true}
          totalCards={9}
          initialVisible={3}
          invalidPerClick={true}
        />
      )

      const seeMoreBtn = document.querySelector(
        '.content-hub-v2__see-more-trigger'
      ) as HTMLButtonElement

      const getHiddenCount = () =>
        document.querySelectorAll('.content-hub-v2__article-card[data-hidden="true"]').length

      expect(getHiddenCount()).toBe(6)

      await user.click(seeMoreBtn)
      expect(getHiddenCount()).toBe(3)
    })

    it('should work without tab navigation present', () => {
      render(<SeeMoreTestComponent isDesktop={true} totalCards={4} initialVisible={3} />)

      const hub = document.querySelector('.mol-content-hub-v2') as HTMLElement
      expect(hub.dataset.init).toBe('true')

      const seeMoreBtn = document.querySelector('.content-hub-v2__see-more-trigger')
      expect(seeMoreBtn).toBeTruthy()
    })

    it('should move focus to the first revealed card after clicking see more', async () => {
      const { user } = render(
        <SeeMoreTestComponent
          isDesktop={true}
          totalCards={5}
          initialVisible={3}
          cardsPerClickDesktop={2}
        />
      )

      const seeMoreBtn = document.querySelector(
        '.content-hub-v2__see-more-trigger'
      ) as HTMLButtonElement
      await user.click(seeMoreBtn)

      const firstRevealed = document.querySelector('[data-qa="card-3"]') as HTMLElement
      expect(firstRevealed).toBeTruthy()
      expect(document.activeElement).toBe(firstRevealed)
      expect(firstRevealed.getAttribute('tabindex')).toBe('-1')
    })
  })
})
