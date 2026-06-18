import React from 'react'
import { render, screen } from 'test-utils/react'

import PhotoGalleryModal from './PhotoGalleryModal'

jest.mock('toro/components/Image', () => {
  return function MockImage(props: any) {
    return (
      <img data-qa={props['data-qa']} alt={props.alt} src={props.src} onClick={props.onClick} />
    )
  }
})

jest.mock('react-intl', () => {
  const actual = jest.requireActual('react-intl')
  const intl = actual.createIntl({ locale: 'en' })

  return {
    ...actual,
    useIntl: () => intl,
  }
})

describe('PhotoGalleryModal', () => {
  const defaultPhotos = [
    { id: '1', thumbnailUrl: 'thumb-1.jpg', caption: 'Photo 1', index: 0 },
    { id: '2', thumbnailUrl: 'thumb-2.jpg', caption: 'Photo 2', index: 1 },
  ] as any

  const defaultStyles = {
    modalContent: {},
    modalContainer: {},
    modalTitle: {},
    modalCloseButton: {},
    modalGrid: {},
    modalPhoto: {},
  } as any

  const renderComponent = (props: Partial<React.ComponentProps<typeof PhotoGalleryModal>> = {}) => {
    const onClose = jest.fn()
    const onThumbnailClick = jest.fn()

    const result = render(
      <PhotoGalleryModal
        isOpen
        onClose={onClose}
        photos={defaultPhotos}
        styles={defaultStyles}
        onThumbnailClick={onThumbnailClick}
        {...props}
      />
    )

    return {
      ...result,
      onClose,
      onThumbnailClick,
    }
  }

  it('renders title and all photos when open', () => {
    renderComponent()

    expect(screen.getByTestId('gallery_review_title')).toBeInTheDocument()
    expect(screen.getAllByTestId('review_gallery_image')).toHaveLength(defaultPhotos.length)
  })

  it('invokes thumbnail callback with index and closes modal on image click', async () => {
    const { onClose, onThumbnailClick, user } = renderComponent()

    const firstImage = screen.getAllByTestId('review_gallery_image')[0]
    await user.click(firstImage)

    expect(onThumbnailClick).toHaveBeenCalledWith(0, true)
    expect(onClose).toHaveBeenCalled()
  })
})
