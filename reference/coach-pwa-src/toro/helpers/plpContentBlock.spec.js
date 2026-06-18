import { initializePlpBlockEventListeners } from './plpContentBlock'
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
  return <HtmlContent content={props.plpData} />
}

const renderOptions = {
  contexts: {
    PWAContext: {},
    ViewportContext: {},
    AnalyticsContext: {},
  },
}

describe('initializePlpBlockEventListeners', () => {
  it('should attach event listeners to toggleContentBlock elements', async () => {
    const plpData = `
      <div>
        <div class="mol-plp-block">
          <div class="toggleContentBlock">
            <div class="collapse"></div>
            <span class="plp-block-show-more"></span>
            <span class="plp-block-show-less d-none"></span>
            <use></use>
          </div>
        </div>
      </div>
    `
    const { user, container } = render(makeSut({ plpData: plpData }), renderOptions)
    const node = container.querySelector('div')

    initializePlpBlockEventListeners(node)

    const toggleContentBlock = container.querySelector('.toggleContentBlock')

    await user.click(toggleContentBlock)

    const collapseBlock = document.querySelector('.collapse')
    const showMoreText = document.querySelector('.plp-block-show-more')
    const showLessText = document.querySelector('.plp-block-show-less')
    const collapseIcon = document.querySelector('use')

    expect(collapseBlock.classList.contains('show')).toBe(true)
    expect(showMoreText.classList.contains('d-none')).toBe(true)
    expect(showLessText.classList.contains('d-none')).toBe(false)
    expect(collapseIcon.getAttribute('xlink:href')).toBe('#icon-nav-chevron-up')

    await user.click(toggleContentBlock)

    expect(collapseBlock.classList.contains('show')).toBe(false)
    expect(showMoreText.classList.contains('d-none')).toBe(false)
    expect(showLessText.classList.contains('d-none')).toBe(true)
    expect(collapseIcon.getAttribute('xlink:href')).toBe('#icon-nav-chevron-down')
  })

  it('should not attach event listeners when toggleContentBlock elements are not present', () => {
    const plpData = `
      <div>
      </div>
    `
    const { container } = render(makeSut({ plpData: plpData }), renderOptions)
    const node = container.querySelector('div')

    initializePlpBlockEventListeners(node)

    const toggleContentBlock = document.querySelector('.toggleContentBlock')
    expect(toggleContentBlock).toBeNull()
  })

  it('should not attach event listeners when node is not provided', () => {
    initializePlpBlockEventListeners(null)

    const toggleContentBlock = document.querySelector('.toggleContentBlock')
    expect(toggleContentBlock).toBeNull()
  })
})
