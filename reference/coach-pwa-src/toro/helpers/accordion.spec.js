import { initializeAccordionEventListeners } from './accordion'
import { render } from 'test-utils/react'
import HtmlContent from 'toro/components/HtmlContent'
jest.mock('next/router', () => {
  const push = jest.fn()
  return {
    useRouter: () => ({
      push,
    }),
  }
})
const makeSut = (props = {}) => {
  return <HtmlContent content={props.accordionData} />
}
const renderOptions = {
  contexts: {
    PWAContext: {},
    ViewportContext: {},
    AnalyticsContext: {},
  },
}
describe('initializeAccordionEventListeners', () => {
  it('should attach event listeners to toggleAccordionButton elements', async () => {
    const accordionData = `
    <div class="accordion toro-accordion dashboard__accordion">
      <div class="card">
        <div class="card-header">
            <button class="card-header__button d-flex align-items-start w-100 collapsed" data-toggle="collapse" data-target="#collapseContent-1" aria-expanded="false" aria-controls="#collapseContent-1">
              <div class="card-header__arrow-icon d-inline-flex">
                  <svg class="icon collapsed-icon" role="presentation">
                    <use xlink:href="#icon-nav-chevron-down"></use>
                  </svg>
                  <svg class="icon expanded-icon" role="presentation">
                    <use xlink:href="#icon-nav-chevron-up"></use>
                  </svg>
              </div>
            </button>
        </div>
        <div id="collapseContent-1" class="collapse" aria-labelledby="Ready-to-wear and soft accessories Details Content" data-parent=".toro-accordion" style="">
        </div>
      </div>
      <div class="card">
      <div class="card-header">
          <button class="card-header__button d-flex align-items-start w-100 collapsed" data-toggle="collapse" data-target="#collapseContent-1" aria-expanded="false" aria-controls="#collapseContent-1">
            <div class="card-header__arrow-icon d-inline-flex">
                <svg class="icon collapsed-icon" role="presentation">
                  <use xlink:href="#icon-nav-chevron-down"></use>
                </svg>
                <svg class="icon expanded-icon" role="presentation">
                  <use xlink:href="#icon-nav-chevron-up"></use>
                </svg>
            </div>
          </button>
      </div>
      <div id="collapseContent-1" class="collapse" aria-labelledby="Ready-to-wear and soft accessories Details Content" data-parent=".toro-accordion" style="">
      </div>
    </div>
    </div>
    `
    const { user, container } = render(makeSut({ accordionData: accordionData }), renderOptions)
    const node = container.querySelector('div')
    initializeAccordionEventListeners(node)
    const toggleAccordionButton = container.querySelector('.card-header__button')
    await user.click(toggleAccordionButton)
    const targetId = toggleAccordionButton?.getAttribute('data-target')
    const expandedContent = document.querySelector(targetId)
    expect(toggleAccordionButton.classList.contains('collapsed')).toBe(false) // on click of button remove collapse class
    expect(toggleAccordionButton).toHaveAttribute('aria-expanded', 'true')
    expect(expandedContent.classList.contains('collapse')).toBe(false)
    await user.click(toggleAccordionButton)
    expect(toggleAccordionButton.classList.contains('collapsed')).toBe(true) // on click of button remove collapse class
    expect(toggleAccordionButton).toHaveAttribute('aria-expanded', 'false')
    expect(expandedContent.classList.contains('collapse')).toBe(true)
    const parentAccordion = toggleAccordionButton?.closest('.accordion')
    const expandedAccordionButton = parentAccordion?.querySelector(
      '.card-header__button:not(.collapsed)'
    )
    const previousId = expandedAccordionButton?.getAttribute('data-target')
    const previousExpandedContent = document.querySelector(previousId)
    await user.click(toggleAccordionButton)
    if (expandedAccordionButton) {
      expect(expandedAccordionButton.classList.contains('collapsed')).toBe(true)
      expect(expandedAccordionButton).toHaveAttribute('aria-expanded', 'false')
      expect(previousExpandedContent.classList.contains('collapse')).toBe(true)
    }
  })
  it('should not attach event listeners when toggleAccordionButton elements are not present', () => {
    const accordionData = `
      <div>
      </div>
    `
    const { container } = render(makeSut({ accordionData: accordionData }), renderOptions)
    const node = container.querySelector('div')
    initializeAccordionEventListeners(node)
    const toggleAccordionButton = document.querySelector('.card-header__button')
    expect(toggleAccordionButton).toBeNull()
  })
  it('should not attach event listeners when node is not provided', () => {
    initializeAccordionEventListeners(null)
    const toggleAccordionButton = document.querySelector('.card-header__button')
    expect(toggleAccordionButton).toBeNull()
  })
})
