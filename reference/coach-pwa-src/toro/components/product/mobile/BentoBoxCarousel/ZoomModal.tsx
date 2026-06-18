import { FC } from 'react'
import Modal from 'toro/components/Modal'
import ModalOverlay from 'toro/components/ModalOverlay'
import ModalContent from 'toro/components/ModalContent'
import ModalCloseButton from 'toro/components/ModalCloseButton'
import { colors } from 'toro/theme'
import ProductCarouselWithZoom from 'toro/components/product/mobile/ProductCarouselWithZoom'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import OnImageBadge from 'toro/components/product/mobile/Badges/OnImageBadge'

interface ZoomModalProps {
  isOpen: boolean
  onClose: () => void
  initialIndex: number
}

const ZoomModal: FC<ZoomModalProps> = ({ isOpen, onClose, initialIndex }) => {
  const styles = useMultiStyleConfig('BentoBoxCarousel')

  return (
    <Modal isOpen={isOpen} isCentered onClose={onClose}>
      <ModalOverlay opacity="0.75 !important" background={colors.main.black} />
      <ModalContent sx={styles.modalContent}>
        <OnImageBadge />
        <ModalCloseButton onClick={onClose} sx={styles.modalCloseButton} />
        <ProductCarouselWithZoom variant="bento" initialIndex={initialIndex} />
      </ModalContent>
    </Modal>
  )
}

export default ZoomModal
