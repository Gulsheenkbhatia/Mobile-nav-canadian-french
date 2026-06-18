import React from 'react'
import Modal from 'toro/components/Modal'
import ModalOverlay from 'toro/components/ModalOverlay'
import ModalContent from 'toro/components/ModalContent'
import ModalCloseButton from 'toro/components/ModalCloseButton'
import useTheme from 'toro/hooks/useTheme'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import MainContainer from 'toro/components/MainContainer'
import PropTypes from 'prop-types'

/**
 * Fullscreen modal that contains zoomable product media
 *
 * @param {Object} props - Component props
 * @param {Function} props.onClose - Close handler
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {React.ReactNode} props.children - Content to display in the modal
 * @param {boolean} [props.isCloseBtnSmall] - Whether to use a smaller close button
 */

const ProductZoomModal = ({ onClose, isOpen, children, isCloseBtnSmall }) => {
  const theme = useTheme()
  const styles = useMultiStyleConfig('zoomModal')
  const { space } = theme

  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay backgroundColor="transparent" />
      <ModalContent
        maxWidth="none"
        h="100%"
        w="100%"
        overflowY="hidden"
        className="zoomModal"
        sx={styles.zoomModal}
      >
        <MainContainer>{children}</MainContainer>

        <ModalCloseButton
          top={space.xxl}
          right={isCloseBtnSmall ? '20px' : space.xxl}
          color={'#898989'}
          sx={{
            '&:focus': {
              boxShadow: 'none',
            },
            '& svg': isCloseBtnSmall
              ? { width: '21px', height: '21px' }
              : { width: space.xl, height: space.xl },
          }}
        />
      </ModalContent>
    </Modal>
  )
}

export default withErrorBoundaryWrapper(ProductZoomModal)
ProductZoomModal.propTypes = {
  onClose: PropTypes.func,
  isOpen: PropTypes.bool,
  isCloseBtnSmall: PropTypes.bool,
}
ProductZoomModal.defaultProps = {
  onClose: () => {},
  isOpen: false,
  isCloseBtnSmall: false,
}
