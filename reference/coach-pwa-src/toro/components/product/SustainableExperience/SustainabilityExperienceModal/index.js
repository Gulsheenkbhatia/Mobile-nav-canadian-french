import Flex from 'toro/components/Flex'
import Image from 'toro/components/Image'
import Modal from 'toro/components/Modal'
import ModalBody from 'toro/components/ModalBody'
import ModalCloseButton from 'toro/components/ModalCloseButton'
import ModalContent from 'toro/components/ModalContent'
import ModalHeader from 'toro/components/ModalHeader'
import ModalOverlay from 'toro/components/ModalOverlay'
import SustainabilityAsset from 'toro/components/product/SustainableExperience/SustainabilityContentAsset'
import Box from 'toro/components/Box'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import PropTypes from 'prop-types'

export default function SustainabilityExperienceModal({ isOpen, onClose, modalData, isMobile }) {
  const styles = useMultiStyleConfig('sustainIcons')

  const modalContentStyles = {
    className: 'sustainability-modal-content',
    p: isMobile ? '50px 10px' : '80px 50px',
    minWidth: !isMobile ? '700px' : '100%',
    maxHeight: !isMobile ? '450px' : '70%',
    overflow: 'auto',
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered scrollBehavior={'inside'}>
      <ModalOverlay />
      <ModalContent {...modalContentStyles} sx={styles.sustainabilityModalContent}>
        <ModalCloseButton />
        <ModalHeader>
          <Flex display="inline-flex">
            <Image
              src={
                modalData?.materialImagePath?.default ||
                'https://images.coach.com/is/image/Coach/coach-brand-image'
              }
              className="sustainable-icon_modal"
            />
            <Box className="sustain-icons-text_modal">{modalData?.materialContent?.default}</Box>
          </Flex>
        </ModalHeader>
        <ModalBody>
          <SustainabilityAsset html={modalData && modalData.markup} />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
SustainabilityExperienceModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  modalData: PropTypes.object,
  isMobile: PropTypes.bool,
}
SustainabilityExperienceModal.defaultProps = {
  onClose: () => {},
}
