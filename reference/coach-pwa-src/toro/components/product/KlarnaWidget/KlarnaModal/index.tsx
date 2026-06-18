import Modal from 'toro/components/Modal'
import ModalOverlay from 'toro/components/ModalOverlay'
import ModalContent from 'toro/components/ModalContent'
import ModalCloseButton from 'toro/components/ModalCloseButton'
import Button from 'toro/components/Button'
import AspectRatio from 'toro/components/AspectRatio'
import { useIntl } from 'react-intl'

type KlarnaModalProps = {
  url?: string
  isOpen: boolean
  onClose: () => void
}

const KlarnaModal = ({ url, isOpen, onClose }: KlarnaModalProps) => {
  const formatMessage = useIntl().formatMessage

  return (
    <Modal
      lockFocusAcrossFrames
      blockScrollOnMount={false}
      isOpen={isOpen}
      onClose={onClose}
      isCentered
    >
      <ModalOverlay className="klarna-overlay" />
      <ModalContent
        boxSizing="border-box"
        maxW="520px"
        marginBottom="0"
        mt="0"
        px={{ base: '0px', md: '30px' }}
        justifyContent="space-between"
        overflow="hidden"
      >
        <ModalCloseButton
          size="lg"
          border="2px"
          borderRadius="50%"
          zIndex="var(--chakra-zIndices-popover)"
          _hover={{
            border: 'none',
          }}
          _focus={{ boxShadow: 'none' }}
        />
        {url && (
          <AspectRatio minH={{ base: '90vh', xl: '75vh' }}>
            <iframe src={url} />
          </AspectRatio>
        )}
        <Button
          _focus={{ boxShadow: 'none' }}
          onClick={onClose}
          h="50px"
          p="16px"
          mb="20px"
          mx={{ base: '20px', md: '0px' }}
          colorScheme="black"
        >
          {formatMessage({
            id: 'pdp.klarna.closeButton',
            defaultMessage: 'Close',
          })}
        </Button>
      </ModalContent>
    </Modal>
  )
}

export default KlarnaModal
