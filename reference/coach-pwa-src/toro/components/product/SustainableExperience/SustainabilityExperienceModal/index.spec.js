import { render, screen, waitFor } from 'test-utils/react'
import userEvent from '@testing-library/user-event'
import SustainabilityExperienceModal from './index' // Ensure the import path is correct

jest.mock('toro/hooks/useViewportType', () => () => ({ isMobile: true, isDesktop: true }))
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

const renderOptions = {
  contexts: {
    PWAContext: {
      appData: {},
    },
  },
}

const modalData = {
  materialImagePath: { default: 'https://example.com/image.png' },
  materialContent: { default: 'Sustainable Material' },
  markup: '<p>Some HTML content</p>',
}

describe('SustainabilityExperienceModal', () => {
  const renderModal = (props) =>
    render(<SustainabilityExperienceModal {...props} modalData={modalData} />, renderOptions)

  it('should render the modal when isOpen is true', async () => {
    const element = renderModal({ isOpen: true, isMobile: false })
    await waitFor(() => expect(element.getByText('Sustainable Material')).toBeVisible())
  })

  it('should not render the modal when isOpen is false', () => {
    const element = renderModal({ isOpen: false, isMobile: true })
    expect(element.queryByText('Sustainable Material')).not.toBeInTheDocument()
  })

  it('should call onClose when the close button is clicked', async () => {
    const onCloseMock = jest.fn()
    renderModal({ isOpen: true, onClose: onCloseMock, isMobile: true })

    await userEvent.click(screen.getByRole('button', { name: /close/i }))
    expect(onCloseMock).toHaveBeenCalledTimes(1)
  })
})
