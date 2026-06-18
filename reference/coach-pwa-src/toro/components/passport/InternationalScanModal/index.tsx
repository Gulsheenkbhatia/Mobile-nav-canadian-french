import type { FC } from 'react'
import Modal from 'toro/components/Modal'
import ModalOverlay from 'toro/components/ModalOverlay'
import ModalContent from 'toro/components/ModalContent'
import ModalCloseButton from 'toro/components/ModalCloseButton'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import HtmlContent from 'toro/components/HtmlContent'

type InternationalScanModalProps = {
  isOpen: boolean
  onClose: () => void
  content?: string
}

const InternationalScanModal: FC<InternationalScanModalProps> = ({
  isOpen,
  onClose,
  content = '',
}) => {
  const styles = useMultiStyleConfig('InternationalScanModal')

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent sx={styles.modalContentRoot}>
        <HtmlContent content={content} />
        <ModalCloseButton sx={styles.closeButton} />
      </ModalContent>
    </Modal>
  )
}

export default InternationalScanModal
