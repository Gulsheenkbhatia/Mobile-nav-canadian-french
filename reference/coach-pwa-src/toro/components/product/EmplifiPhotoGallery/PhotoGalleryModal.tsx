import React, { useRef } from 'react'
import Box from 'toro/components/Box'
import Image from 'toro/components/Image'
import Modal from 'toro/components/Modal'
import ModalContent from 'toro/components/ModalContent'
import ModalCloseButton from 'toro/components/ModalCloseButton'
import Grid from 'toro/components/Grid'
import { useIntl } from 'react-intl'
import type { NormalizedPhotoReview } from 'toro/helpers/emplifiNormalizers'
import { SystemStyleObject } from '@chakra-ui/react'
import Text from 'toro/components/Text'
import useOutsideClick from 'toro/hooks/useOutsideClick'

type PhotoGalleryModalProps = {
  isOpen: boolean
  onClose: () => void
  photos: (NormalizedPhotoReview['photos'][number] & { index: number })[]
  styles: Record<string, SystemStyleObject>
  onThumbnailClick: (index: number, fromViewAllModal: boolean) => void
}

const PhotoGalleryModal = ({
  isOpen,
  onClose,
  photos,
  styles,
  onThumbnailClick,
}: PhotoGalleryModalProps) => {
  const { formatMessage } = useIntl()
  const handleThumbnailClick = (index: number) => {
    onThumbnailClick(index, true)
    onClose()
  }
  const photosGridRef = useRef<HTMLDivElement>(null)

  useOutsideClick({
    ref: photosGridRef,
    handler: onClose,
  })

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <ModalContent sx={styles.modalContent}>
        <Box sx={styles.modalContainer}>
          <Text as="h2" data-qa="gallery_review_title" sx={styles.modalTitle}>
            {formatMessage({
              id: 'pdp.reviews.allReviewsWithPhotos',
              defaultMessage: 'All reviews with photos',
            })}
          </Text>
          <ModalCloseButton data-qa="close_gallery" sx={styles.modalCloseButton} />
          <Grid ref={photosGridRef} sx={styles.modalGrid}>
            {photos.map((photo) => (
              <Image
                onClick={() => handleThumbnailClick(photo.index)}
                data-qa="review_gallery_image"
                src={photo.thumbnailUrl}
                key={photo.id}
                alt={
                  photo.caption ||
                  formatMessage({
                    id: 'pdp.reviews.customerPhoto',
                    defaultMessage: 'Customer photo',
                  })
                }
                lazy
                sx={styles.modalPhoto}
              />
            ))}
          </Grid>
        </Box>
      </ModalContent>
    </Modal>
  )
}

export default PhotoGalleryModal
