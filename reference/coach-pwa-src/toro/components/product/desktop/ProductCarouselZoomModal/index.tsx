import React, { ReactNode } from 'react'
import Modal from 'toro/components/Modal'
import ModalOverlay from 'toro/components/ModalOverlay'
import ModalContent from 'toro/components/ModalContent'
import ModalBody from 'toro/components/ModalBody'
import ModalCloseButton from 'toro/components/ModalCloseButton'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'

/**
 * Fullscreen modal that contains zoomable product media
 *
 * @param  {Function} onClose close handler
 */
const ProductZoomModal = ({
  onClose,
  isOpen,
  children,
}: {
  onClose: () => void
  isOpen: boolean
  children: ReactNode
}) => {
  const styles = useMultiStyleConfig('ProductCarouselZoomModal')

  return (
    <Modal onClose={onClose} isOpen={isOpen} motionPreset="slideInBottom" isCentered>
      <ModalOverlay backgroundColor="transparent" />
      <ModalContent
        backgroundColor={'var(--color-page-bg)'}
        maxWidth="none"
        h="100%"
        w="100%"
        overflowY="hidden"
        className="zoomModal"
        my="0px"
        sx={styles.modalContent}
      >
        <ModalBody w="100%">{children}</ModalBody>

        <ModalCloseButton
          top={'var(--spacing-12)'}
          right={'var(--spacing-12)'}
          color={'#000'}
          sx={{
            '&:focus': {
              boxShadow: 'none',
            },
            '& svg': { width: 'var(--spacing-4)', height: 'var(--spacing-4)' },
          }}
          dataQA="hdr_btn_Zoom_Close_icon"
        />
      </ModalContent>
    </Modal>
  )
}

export default withErrorBoundaryWrapper(ProductZoomModal)
