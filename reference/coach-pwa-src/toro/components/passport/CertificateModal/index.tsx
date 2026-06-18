import type { FC } from 'react'
import Modal from 'toro/components/Modal'
import ModalOverlay from 'toro/components/ModalOverlay'
import ModalContent from 'toro/components/ModalContent'
import ModalCloseButton from 'toro/components/ModalCloseButton'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import ImageCoachtopia from '@tapestry-inc/design-tokens/coachtopia/logo/primary-black.svg'
import Box from 'toro/components/Box'
import Button from 'toro/components/Button'
import Image from 'toro/components/Image'

type CertificateModalProps = {
  isOpen: boolean
  onClose: () => void
  content?: {
    enabled: boolean
    title: string
    image?: string
    body: string
    button: string
  }
}

const CertificateModal: FC<CertificateModalProps> = ({ isOpen, onClose, content }) => {
  const styles = useMultiStyleConfig('CertificateModal')

  if (!content || !content.enabled) {
    return null
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent sx={styles.modalContentRoot}>
        <Box sx={styles.logo}>
          <ImageCoachtopia />
        </Box>
        <Box sx={styles.title}>{content.title}</Box>
        {content.image && <Image src={content.image} alt={content.title} />}
        <Box sx={styles.body}>{content.body}</Box>
        <Button onClick={onClose} sx={styles.button}>
          {content.button}
        </Button>
        <ModalCloseButton sx={styles.closeButton} />
      </ModalContent>
    </Modal>
  )
}

export default CertificateModal
