import isBrowser from 'toro/helpers/isBrowser'
import Modal from 'toro/components/Modal'
import { ModalOverlay } from '@chakra-ui/react'
import ModalContent from 'toro/components/ModalContent'
import SitePreviewShareUrlModalContent from 'toro/components/SitePreview/SitePreviewShareUrlModalContent'
import { SitePreviewShareUrlModalProps } from 'toro/components/SitePreview/sitePreviewTypes'

const SitePreviewShareUrlModal = ({
  isOpen,
  onClose,
  sitePreviewConfig,
  isSitePreviewDataSet,
}: SitePreviewShareUrlModalProps) => {
  const showShareUrlModalContent = isBrowser() && isSitePreviewDataSet

  return (
    <Modal
      motionPreset="slideInBottom"
      isOpen={isOpen}
      onClose={onClose}
      closeOnEsc={false}
      closeOnOverlayClick={true}
    >
      <ModalOverlay />
      <ModalContent minWidth="400px" p="15px">
        {showShareUrlModalContent && (
          <SitePreviewShareUrlModalContent
            sitePreviewConfig={sitePreviewConfig}
            onClose={onClose}
          />
        )}
      </ModalContent>
    </Modal>
  )
}

export default SitePreviewShareUrlModal
