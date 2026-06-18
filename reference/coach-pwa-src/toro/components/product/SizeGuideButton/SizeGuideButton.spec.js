import React from 'react'
import { render, screen, cleanup, waitFor } from 'test-utils/react'
import SizeGuideButton from './index'
import useViewportType from 'toro/hooks/useViewportType'
import userEvent from '@testing-library/user-event'

const mockFn = jest.fn()
jest.mock('toro/hooks/useViewportType')
jest.mocked(useViewportType).mockImplementation(() => ({ isDesktop: true, isMobile: false }))
jest.mock('next/router', () => {
  return {
    useRouter: () => ({
      push: mockFn,
    }),
  }
})

const renderOptions = {
  contexts: {
    PWAContext: {
      appData: {},
    },
    AnalyticsContext: { send: mockFn },
  },
}

const testVisibility = async (text, state = 'visible', params) => {
  const contentElement = screen.getByText(text)

  await waitFor(
    () => {
      if (state === 'visible') {
        expect(contentElement).toBeVisible()
      } else expect(contentElement).not.toBeVisible()
    },
    { ...params }
  )
}

describe('SizeGuideButton Component for PDP', () => {
  const renderComponent = (showSizeGuide = true) => {
    const mockProps = {
      isSticky: false,
      isQuickView: false,
      setShowSizeGuidePopUp: mockFn,
      productId: 'CH793',
      sizeGuideContent: showSizeGuide ? '<div>Size Guide Content</div>' : null,
    }
    return {
      ...render(<SizeGuideButton {...mockProps} />, renderOptions),
      user: userEvent.setup({ delay: null }),
    }
  }

  beforeEach(() => {
    cleanup()
    jest.clearAllMocks()
  })

  test('renders the button correctly', () => {
    renderComponent()
    const sizeGuideButton = screen.getByTestId('pdp_btn_sizeguide')

    expect(sizeGuideButton).toBeVisible()
  })
  test('opens the modal on button click and fires analytics event', async () => {
    const { user } = renderComponent()
    const sizeGuideButton = screen.getByTestId('pdp_btn_sizeguide')
    await user.click(sizeGuideButton)
    await testVisibility('Size Guide Content')

    expect(mockFn).toHaveBeenCalled()
  })

  test('closes the modal on close button click', async () => {
    const { user } = renderComponent()
    const sizeGuideButton = screen.getByTestId('pdp_btn_sizeguide')

    // Open the modal
    await user.click(sizeGuideButton)
    await testVisibility('Size Guide Content', 'visible')

    // Close the modal
    const closeButton = screen.getByLabelText('Close')
    expect(closeButton).toBeVisible()
    await user.click(closeButton)

    // Check that the modal content is not visible
    await testVisibility('Size Guide Content', 'hidden', { timeout: 1500 })
  })

  test('does not render if sizeGuideContent is missing', () => {
    cleanup()
    console.warn = mockFn
    renderComponent(false)
    const sizeGuideButton = screen.queryByTestId('pdp_btn_sizeguide')
    expect(sizeGuideButton).not.toBeInTheDocument()
    expect(mockFn).toHaveBeenCalled()
  })
})

describe('SizeGuideButton Component for QuickView', () => {
  const sizeGuidePopUpMock = jest.fn()
  const mockProps = {
    isSticky: false,
    isQuickView: true,
    setShowSizeGuidePopUp: sizeGuidePopUpMock,
    productId: 'CH793',
    sizeGuideContent: '<div>Size Guide Content</div>',
  }

  const renderComponent = () => ({
    ...render(<SizeGuideButton {...mockProps} />, renderOptions),
    user: userEvent.setup({ delay: null }),
  })

  beforeEach(async () => {
    jest.clearAllMocks()
  })

  test('opens the modal on button click and fires analytics event', async () => {
    const { user } = renderComponent()
    const sizeGuideButton = screen.getByTestId('pdp_btn_sizeguide')
    await user.click(sizeGuideButton)

    expect(sizeGuidePopUpMock).toHaveBeenCalledWith(true)
    expect(mockFn).toHaveBeenCalled()
  })

  test('closes the modal on close button click', async () => {
    const { user } = renderComponent()
    const sizeGuideButton = screen.getByTestId('pdp_btn_sizeguide')
    await user.click(sizeGuideButton)
    const closeButton = screen.getByLabelText('Close')
    await user.click(closeButton)

    expect(sizeGuidePopUpMock).toHaveBeenCalledWith(false)
  })
})
