import { render } from 'test-utils/react'
import userEvent from '@testing-library/user-event'
import ProductImageGallery from 'toro/components/ShopAssistChat/ProductImageGallery'
import StylesProvider from 'toro/components/StylesProvider'

const mockWindowOpen = jest.fn()
Object.defineProperty(window, 'open', {
  writable: true,
  value: mockWindowOpen,
})

global.IntersectionObserver = jest.fn().mockImplementation((callback) => ({
  observe: jest.fn(),
  disconnect: jest.fn(),
  unobserve: jest.fn(),
}))

const defaultStyles = {
  productImageGallery: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 'var(--spacing-2)',
  },
  productImageItem: { cursor: 'pointer', overflow: 'hidden' },
  productImage: {},
}

const renderWithStyles = (ui: React.ReactElement) =>
  render(<StylesProvider value={defaultStyles}>{ui}</StylesProvider>)

const mockImages = [
  'https://example.com/image1.jpg',
  'https://example.com/image2.jpg',
  'https://example.com/image3.jpg',
]

describe('ProductImageGallery', () => {
  beforeEach(() => {
    mockWindowOpen.mockClear()
  })

  describe('Rendering behavior', () => {
    it('renders nothing when images array is empty', () => {
      const { queryByRole } = renderWithStyles(<ProductImageGallery images={[]} />)

      expect(queryByRole('list')).not.toBeInTheDocument()
    })

    it('renders nothing when images prop is undefined', () => {
      const { queryByRole } = renderWithStyles(<ProductImageGallery images={undefined} />)

      expect(queryByRole('list')).not.toBeInTheDocument()
    })

    it('renders gallery container with correct role when images provided', () => {
      const { getByRole } = renderWithStyles(<ProductImageGallery images={mockImages} />)

      expect(getByRole('list')).toBeVisible()
    })

    it('renders correct number of image items', () => {
      const { getAllByRole } = renderWithStyles(<ProductImageGallery images={mockImages} />)

      const imageItems = getAllByRole('listitem')
      expect(imageItems).toHaveLength(3)
    })

    it('renders image containers for each image', () => {
      const { getAllByRole, getByLabelText } = renderWithStyles(
        <ProductImageGallery images={mockImages} />
      )

      const imageContainers = getAllByRole('listitem')
      expect(imageContainers).toHaveLength(3)

      expect(getByLabelText('Product image 1. Click to view full size in new tab.')).toBeVisible()
      expect(getByLabelText('Product image 2. Click to view full size in new tab.')).toBeVisible()
      expect(getByLabelText('Product image 3. Click to view full size in new tab.')).toBeVisible()
    })
  })

  describe('Accessibility', () => {
    it('provides proper aria labels for image containers', () => {
      const { getByLabelText } = renderWithStyles(<ProductImageGallery images={mockImages} />)

      expect(getByLabelText('Product image 1. Click to view full size in new tab.')).toBeVisible()
      expect(getByLabelText('Product image 2. Click to view full size in new tab.')).toBeVisible()
      expect(getByLabelText('Product image 3. Click to view full size in new tab.')).toBeVisible()
    })

    it('makes image containers focusable with tabIndex', () => {
      const { getAllByRole } = renderWithStyles(<ProductImageGallery images={mockImages} />)

      const imageContainers = getAllByRole('listitem')
      imageContainers.forEach((container) => {
        expect(container).toHaveAttribute('tabIndex', '0')
      })
    })

    it('has cursor pointer on image containers', () => {
      const { getAllByRole } = renderWithStyles(<ProductImageGallery images={mockImages} />)

      const imageContainers = getAllByRole('listitem')
      imageContainers.forEach((container) => {
        expect(container).toHaveStyle('cursor: pointer')
      })
    })
  })

  describe('Click interactions', () => {
    it('opens image in new tab when clicked', async () => {
      const user = userEvent.setup()
      const { getByLabelText } = renderWithStyles(<ProductImageGallery images={mockImages} />)

      const firstImageContainer = getByLabelText(
        'Product image 1. Click to view full size in new tab.'
      )
      await user.click(firstImageContainer)

      expect(mockWindowOpen).toHaveBeenCalledWith(
        'https://example.com/image1.jpg',
        '_blank',
        'noopener,noreferrer'
      )
    })

    it('opens different images when different containers are clicked', async () => {
      const user = userEvent.setup()
      const { getByLabelText } = renderWithStyles(<ProductImageGallery images={mockImages} />)

      const secondImageContainer = getByLabelText(
        'Product image 2. Click to view full size in new tab.'
      )
      await user.click(secondImageContainer)

      expect(mockWindowOpen).toHaveBeenCalledWith(
        'https://example.com/image2.jpg',
        '_blank',
        'noopener,noreferrer'
      )
    })
  })

  describe('Keyboard interactions', () => {
    it('opens image in new tab when Enter key is pressed', async () => {
      const user = userEvent.setup()
      const { getByLabelText } = renderWithStyles(<ProductImageGallery images={mockImages} />)

      const firstImageContainer = getByLabelText(
        'Product image 1. Click to view full size in new tab.'
      )
      await user.click(firstImageContainer)
      await user.keyboard('{Enter}')

      expect(mockWindowOpen).toHaveBeenCalledWith(
        'https://example.com/image1.jpg',
        '_blank',
        'noopener,noreferrer'
      )
    })

    it('opens image in new tab when Space key is pressed', async () => {
      const user = userEvent.setup()
      const { getByLabelText } = renderWithStyles(<ProductImageGallery images={mockImages} />)

      const firstImageContainer = getByLabelText(
        'Product image 1. Click to view full size in new tab.'
      )
      firstImageContainer.focus()
      await user.keyboard(' ')

      expect(mockWindowOpen).toHaveBeenCalledWith(
        'https://example.com/image1.jpg',
        '_blank',
        'noopener,noreferrer'
      )
    })

    it('does not open image for other keys', async () => {
      const user = userEvent.setup()
      const { getByLabelText } = renderWithStyles(<ProductImageGallery images={mockImages} />)

      const firstImageContainer = getByLabelText(
        'Product image 1. Click to view full size in new tab.'
      )
      firstImageContainer.focus()
      await user.keyboard('{Tab}')

      expect(mockWindowOpen).not.toHaveBeenCalled()
    })

    it('handles keyboard events correctly', async () => {
      const user = userEvent.setup()
      const { getByLabelText } = renderWithStyles(<ProductImageGallery images={mockImages} />)

      const firstImageContainer = getByLabelText(
        'Product image 1. Click to view full size in new tab.'
      )

      firstImageContainer.focus()
      await user.keyboard('{Enter}')
      expect(mockWindowOpen).toHaveBeenCalledWith(
        'https://example.com/image1.jpg',
        '_blank',
        'noopener,noreferrer'
      )

      mockWindowOpen.mockClear()

      await user.keyboard(' ')
      expect(mockWindowOpen).toHaveBeenCalledWith(
        'https://example.com/image1.jpg',
        '_blank',
        'noopener,noreferrer'
      )
    })
  })

  describe('Layout and styling', () => {
    it('uses CSS Grid layout for image gallery', () => {
      const { getByRole } = renderWithStyles(<ProductImageGallery images={mockImages} />)

      const galleryContainer = getByRole('list')
      expect(galleryContainer).toHaveStyle('display: grid')
      expect(galleryContainer).toHaveStyle('grid-template-columns: repeat(3, 1fr)')
    })

    it('has proper spacing and margins', () => {
      const { getByRole } = renderWithStyles(<ProductImageGallery images={mockImages} />)

      const galleryContainer = getByRole('list')
      expect(galleryContainer).toHaveStyle('gap: var(--spacing-2)')
      expect(galleryContainer).toHaveStyle('margin-top: var(--spacing-2)')
    })

    it('applies proper styling to image containers', () => {
      const { getAllByRole } = renderWithStyles(<ProductImageGallery images={mockImages} />)

      const imageContainers = getAllByRole('listitem')
      imageContainers.forEach((container) => {
        expect(container).toHaveAttribute('tabIndex', '0')
        expect(container).toHaveStyle('cursor: pointer')
        expect(container).toHaveStyle('overflow: hidden')
      })
    })
  })

  describe('Edge cases', () => {
    it('handles single image correctly', () => {
      const singleImage = ['https://example.com/single.jpg']
      const { getByRole, getAllByRole, getByLabelText } = renderWithStyles(
        <ProductImageGallery images={singleImage} />
      )

      expect(getByRole('list')).toBeVisible()
      expect(getAllByRole('listitem')).toHaveLength(1)
      expect(getByLabelText('Product image 1. Click to view full size in new tab.')).toBeVisible()
    })

    it('handles many images correctly', () => {
      const manyImages = Array.from(
        { length: 12 },
        (_, i) => `https://example.com/image${i + 1}.jpg`
      )
      const { getAllByRole } = renderWithStyles(<ProductImageGallery images={manyImages} />)

      expect(getAllByRole('listitem')).toHaveLength(12)
    })

    it('handles malformed image URLs gracefully', async () => {
      const malformedImages = ['', 'not-a-url', 'https://example.com/valid.jpg']
      const user = userEvent.setup()
      const { getAllByRole, getByLabelText } = renderWithStyles(
        <ProductImageGallery images={malformedImages} />
      )

      expect(getAllByRole('listitem')).toHaveLength(3)

      const firstContainer = getByLabelText('Product image 1. Click to view full size in new tab.')
      await user.click(firstContainer)
      expect(mockWindowOpen).toHaveBeenCalledWith('', '_blank', 'noopener,noreferrer')
    })
  })
})
