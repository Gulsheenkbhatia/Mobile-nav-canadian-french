import Box from 'toro/components/Box'
import Modal from 'toro/components/Modal'
import ModalOverlay from 'toro/components/ModalOverlay'
import ModalContent from 'toro/components/ModalContent'
import ModalCloseButton from 'toro/components/ModalCloseButton'
import useGlobalSlotAtomData from 'hooks/useGlobalSlotAtomData'

interface IPromoModalProps {
  isOpen: boolean
  onClose: () => void
}

const PromoModal = ({ isOpen, onClose }: IPromoModalProps) => {
  const { promoModalContent = '' } = useGlobalSlotAtomData('header-banner-m') as {
    promoModalContent: string
  }

  if (!promoModalContent) {
    return null
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay data-qa="modal-overlay" />
      <ModalContent
        className="inner"
        data-qa="modal-content"
        sx={{
          maxWidth: '620px',
        }}
      >
        <Box
          dangerouslySetInnerHTML={{ __html: promoModalContent }}
          className="column-right-float"
        ></Box>
        <ModalCloseButton
          data-qa="modal-close-button"
          sx={{
            width: '32px',
            height: '32px',
            '& svg': {
              width: '17px',
              height: '17px',
            },
          }}
        />
      </ModalContent>
    </Modal>
  )
}

export default PromoModal
