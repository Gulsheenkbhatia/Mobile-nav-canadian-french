import React from 'react'
import { render, screen } from 'test-utils/react'
import userEvent from '@testing-library/user-event'
import * as jotai from 'jotai'
import ThreadUpModal from './index'
import useViewportType from 'toro/hooks/useViewportType'
import useCmsAnalytics from 'toro/analytics/useCmsAnalytics'

jest.mock('jotai', () => {
  const originalModule = jest.requireActual('jotai')
  return {
    ...originalModule,
    useAtom: jest.fn(),
  }
})

jest.mock('toro/components/HtmlContent', () => {
  return function MockHtmlContent({ content, ref, onClick }) {
    return (
      <div
        dangerouslySetInnerHTML={{ __html: content }}
        data-testid="html-content"
        onClick={onClick}
        ref={ref}
      />
    )
  }
})

const mockFN = jest.fn()
const contentUpdatedMockFN = jest.fn()
jest.mock('toro/hooks/useViewportType')
jest.mock('toro/analytics/useCmsAnalytics')
jest.mocked(useViewportType).mockImplementation(() => ({ isDesktop: true, isMobile: false }))
jest.mocked(useCmsAnalytics).mockImplementation(() => ({
  contentUpdated: contentUpdatedMockFN,
  onClick: mockFN,
}))

jest.mock('next/router', () => {
  return {
    useRouter: () => ({
      push: mockFN,
    }),
  }
})

const renderOptions = {
  contexts: {
    PWAContext: {
      appData: {
        thredUpModalContent: {
          contentSlots: {
            html: '<div class="mol-banner" data-qa="site_promo_banner_wrapper"> <div class="row"> <div class="banner-container solid-background col-12 p-0 " data-qa="site_promo_banner_wrapper"> <p class="text-eyebrow1-m promo-line-text promo-text text-center">You’re about to leave katespade.com...</p> <div class="mol-header-block-container mob-text-over-img"> <div class="mol-header-block"> <div class="at-text-block" data-qa="site_promo_headline_wrapper"> <p class="at-eyebrow-text text-eyebrow1-m">Introducing</p> <h2 class="at-headline-text text-display1-m "> kate spade new york<br>Pre-Loved</h2> </div> </div> </div> </div> </div> </div>',
            pElem: ['You’re about to leave katespade.com...', 'Introducing'],
            hElem: [' kate spade new york', 'Pre-Loved'],
          },
        },
      },
    },
  },
}

describe('when ThreadUpModal component is visible', () => {
  beforeEach(() => {
    jotai.useAtom.mockReturnValue([true, mockFN])
    render(<ThreadUpModal />, renderOptions)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })
  it('renders modal correctly when visible', () => {
    const modalContent = screen.getByTestId('site_promo_headline_wrapper')
    screen.getByRole('dialog').style.opacity = 1
    expect(modalContent).toBeVisible()
  })

  it('closes modal when close button is clicked', async () => {
    const closeButton = screen.getByLabelText('Close')
    await userEvent.click(closeButton)
    expect(mockFN).toHaveBeenCalledWith(false)
  })

  it('triggers contentUpdated effect on mount', () => {
    expect(contentUpdatedMockFN).toHaveBeenCalled()
  })
})

describe('when ThreadUpModal component is not visible', () => {
  it('does not render modal when not visible', () => {
    jotai.useAtom.mockReturnValue([false, mockFN])
    render(<ThreadUpModal />, renderOptions)
    const modalContent = screen.queryByText('Pre-Loved')
    expect(modalContent).not.toBeInTheDocument()
  })
})
