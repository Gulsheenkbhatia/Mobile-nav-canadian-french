import { render, screen } from 'test-utils/react'
import userEvent from '@testing-library/user-event'
import CertificateModal from './index'

jest.mock('@tapestry-inc/design-tokens/coachtopia/logo/primary-black.svg', () => {
  return function MockCoachtopiaLogo() {
    return <span data-qa="coachtopia-logo">Coachtopia Logo</span>
  }
})

jest.mock('toro/hooks/useMultiStyleConfig', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    modalContentRoot: {},
    logo: {},
    title: {},
    body: {},
    button: {},
    closeButton: {},
  })),
}))

describe('CertificateModal', () => {
  const mockOnClose = jest.fn()

  const mockContent = {
    enabled: true,
    title: 'Certificate of Authenticity',
    image: 'https://example.com/certificate.jpg',
    body: 'This product is certified authentic.',
    button: 'Got It',
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Conditional Rendering', () => {
    it('should return null when content is undefined', () => {
      render(<CertificateModal isOpen={true} onClose={mockOnClose} content={undefined} />)

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('should return null when content is null', () => {
      render(<CertificateModal isOpen={true} onClose={mockOnClose} content={null as any} />)

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('should return null when content.enabled is false', () => {
      const disabledContent = { ...mockContent, enabled: false }

      render(<CertificateModal isOpen={true} onClose={mockOnClose} content={disabledContent} />)

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('should render modal when isOpen is true and content is valid', () => {
      render(<CertificateModal isOpen={true} onClose={mockOnClose} content={mockContent} />)

      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    it('should not render modal when isOpen is false', () => {
      render(<CertificateModal isOpen={false} onClose={mockOnClose} content={mockContent} />)

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  describe('Content Rendering', () => {
    beforeEach(() => {
      render(<CertificateModal isOpen={true} onClose={mockOnClose} content={mockContent} />)
    })

    it('should render Coachtopia logo', () => {
      expect(screen.getByTestId('coachtopia-logo')).toBeInTheDocument()
    })

    it('should render title from content', () => {
      expect(screen.getByText(mockContent.title)).toBeInTheDocument()
    })

    it('should render image with correct src and alt', () => {
      const image = screen.getByRole('img')
      expect(image).toHaveAttribute('src', mockContent.image)
      expect(image).toHaveAttribute('alt', mockContent.title)
    })

    it('should render body text', () => {
      expect(screen.getByText(mockContent.body)).toBeInTheDocument()
    })

    it('should render button with correct text', () => {
      expect(screen.getByRole('button', { name: mockContent.button })).toBeInTheDocument()
    })
  })

  describe('User Interactions', () => {
    it('should call onClose when button is clicked', async () => {
      const user = userEvent.setup()
      render(<CertificateModal isOpen={true} onClose={mockOnClose} content={mockContent} />)

      await user.click(screen.getByRole('button', { name: mockContent.button }))

      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })

    it('should call onClose when close button (ModalCloseButton) is clicked', async () => {
      const user = userEvent.setup()
      render(<CertificateModal isOpen={true} onClose={mockOnClose} content={mockContent} />)

      const closeButton = screen.getByLabelText('Close')
      await user.click(closeButton)

      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })
  })

  describe('Optional certificate image', () => {
    it('should not render certificate image when image URL is missing', () => {
      render(
        <CertificateModal
          isOpen={true}
          onClose={mockOnClose}
          content={{ ...mockContent, image: undefined }}
        />
      )

      expect(screen.queryByRole('img')).not.toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('should handle content with empty strings gracefully', () => {
      const emptyContent = {
        enabled: true,
        title: '',
        image: '',
        body: '',
        button: '',
      }

      render(<CertificateModal isOpen={true} onClose={mockOnClose} content={emptyContent} />)

      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    it('should render with minimal valid content', () => {
      const minimalContent = {
        enabled: true,
        title: 'Test',
        image: 'test.jpg',
        body: 'Body',
        button: 'OK',
      }

      render(<CertificateModal isOpen={true} onClose={mockOnClose} content={minimalContent} />)

      expect(screen.getByText('Test')).toBeInTheDocument()
      expect(screen.getByText('Body')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'OK' })).toBeInTheDocument()
    })
  })
})
