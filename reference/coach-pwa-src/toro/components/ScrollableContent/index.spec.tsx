import React from 'react'
import { render, screen, fireEvent, CustomRenderOptions } from 'test-utils/react'
import ScrollableContent from './index'

const renderOptions: CustomRenderOptions = {
  contexts: {
    PWAContext: {
      appData: {},
    },
  },
}

describe('ScrollableContent', () => {
  it('renders children correctly', () => {
    render(<ScrollableContent>Test Content</ScrollableContent>, renderOptions)
    expect(screen.getByText('Test Content')).toBeVisible()
  })

  it('calls setScrollRef and setFadingChildClassNames props', () => {
    const setScrollRef = jest.fn()
    const setFadingChildClassNames = jest.fn()

    const { container } = render(
      <ScrollableContent
        fadeColor="red"
        setScrollRef={setScrollRef}
        setFadingChildClassNames={setFadingChildClassNames}
      >
        Test Content
      </ScrollableContent>,
      renderOptions
    )
    const scrollableDiv = container.querySelector('div>div>div')
    expect(setScrollRef).toHaveBeenCalledWith(scrollableDiv)
    expect(setFadingChildClassNames).toHaveBeenCalledWith('leftFadeHidden rightFadeHidden')
  })

  it('applies custom class names', () => {
    const customClassNames = 'custom-class'
    const { container } = render(
      <ScrollableContent wrapperClassNames={customClassNames}>Test Content</ScrollableContent>,
      renderOptions
    )
    const scrollableDiv = container.querySelector('div > div > div.custom-class')
    expect(scrollableDiv).toHaveClass('custom-class')
  })

  it('updates fading class names on scroll', () => {
    const { container } = render(
      <ScrollableContent fadeColor="rgba(0, 0, 0, 0.1)">
        <div style={{ width: '2000px', height: '100px' }}>Scrollable Content</div>
      </ScrollableContent>,
      renderOptions
    )

    const outerContainer = container.querySelector('div > div')

    const scrollableContainer = container.querySelector('div>div>div')

    expect(outerContainer).toHaveClass('rightFadeHidden')
    expect(outerContainer).toHaveClass('leftFadeHidden')
    fireEvent.scroll(scrollableContainer, { target: { scrollLeft: 100 } })
    expect(outerContainer).not.toHaveClass('leftFadeHidden')
    fireEvent.scroll(scrollableContainer, {
      target: { scrollLeft: 2000 - scrollableContainer.clientWidth },
    })
    expect(outerContainer).toHaveClass('rightFadeHidden')
    scrollableContainer.scrollLeft = 0
    fireEvent.scroll(scrollableContainer)
    expect(outerContainer).toHaveClass('leftFadeHidden')
  })
  it('does not apply fading class names when hasFade is false', () => {
    const { container } = render(
      <ScrollableContent>
        <div style={{ width: '2000px', height: '100px' }}>Scrollable Content</div>
      </ScrollableContent>,
      renderOptions
    )
    const outerContainer = container.querySelector('div > div')
    expect(outerContainer).not.toHaveClass('rightFadeHidden')
  })

  it('auto-scrolls to the target when it is out of view', () => {
    const autoScrollContainerRef = { current: null } as React.MutableRefObject<HTMLElement | null>
    const { container, rerender } = render(
      <ScrollableContent
        autoScrollTargetSelector=".activeColorSwatch"
        autoScrollActiveSwatchTrigger="1"
        autoScrollContainerRef={autoScrollContainerRef}
      >
        <div className="activeColorSwatch">Active</div>
      </ScrollableContent>,
      renderOptions
    )

    const scrollableContainer = container.querySelector('.scrollableContent') as HTMLElement
    const activeNode = container.querySelector('.activeColorSwatch') as HTMLElement

    Object.defineProperty(scrollableContainer, 'scrollLeft', { value: 0, writable: true })
    Object.defineProperty(scrollableContainer, 'clientWidth', { value: 100 })
    Object.defineProperty(scrollableContainer, 'scrollWidth', { value: 200 })
    const scrollToMock = jest.fn()
    scrollableContainer.scrollTo = scrollToMock
    autoScrollContainerRef.current = scrollableContainer

    jest
      .spyOn(scrollableContainer, 'getBoundingClientRect')
      .mockReturnValue({ left: 0, right: 100, width: 100 } as DOMRect)
    jest
      .spyOn(activeNode, 'getBoundingClientRect')
      .mockReturnValue({ left: 150, right: 210, width: 60 } as DOMRect)

    rerender(
      <ScrollableContent
        autoScrollTargetSelector=".activeColorSwatch"
        autoScrollActiveSwatchTrigger="2"
        autoScrollContainerRef={autoScrollContainerRef}
      >
        <div className="activeColorSwatch">Active</div>
      </ScrollableContent>
    )

    expect(scrollToMock).toHaveBeenCalled()
  })

  it('does not auto-scroll when target is already visible', () => {
    const { container } = render(
      <ScrollableContent autoScrollTargetSelector=".activeColorSwatch">
        <div className="activeColorSwatch">Active</div>
      </ScrollableContent>,
      renderOptions
    )

    const scrollableContainer = container.querySelector('.scrollableContent') as HTMLElement
    const activeNode = container.querySelector('.activeColorSwatch') as HTMLElement

    Object.defineProperty(scrollableContainer, 'scrollLeft', { value: 0, writable: true })
    Object.defineProperty(scrollableContainer, 'clientWidth', { value: 100 })
    Object.defineProperty(scrollableContainer, 'scrollWidth', { value: 200 })
    const scrollToMock = jest.fn()
    scrollableContainer.scrollTo = scrollToMock

    jest
      .spyOn(scrollableContainer, 'getBoundingClientRect')
      .mockReturnValue({ left: 0, right: 100, width: 100 } as DOMRect)
    jest
      .spyOn(activeNode, 'getBoundingClientRect')
      .mockReturnValue({ left: 10, right: 60, width: 50 } as DOMRect)

    expect(scrollToMock).not.toHaveBeenCalled()
  })
})
