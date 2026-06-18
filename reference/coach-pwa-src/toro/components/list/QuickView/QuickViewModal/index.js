import React, { useEffect } from 'react'
import Modal from 'toro/components/Modal'
import ModalOverlay from 'toro/components/ModalOverlay'
import ModalContent from 'toro/components/ModalContent'
import ModalCloseButton from 'toro/components/ModalCloseButton'
import useTheme from 'toro/hooks/useTheme'
import { useRouter } from 'next/router'

/**
 * Modal that contains product quick view
 *
 * @param  {Function} onClose close handler
 */
const QuickViewModal = ({ onClose, children, isShowSizeGuidePopUp }) => {
  const theme = useTheme()
  const { asPath } = useRouter()
  const { space } = theme

  useEffect(() => {
    return onClose
  }, [asPath])

  return (
    <Modal onClose={onClose} isOpen isCentered>
      <ModalOverlay display={isShowSizeGuidePopUp && 'none'} />
      <ModalContent
        maxWidth="none"
        minHeight="500px"
        maxHeight="74vh"
        padding="24px"
        w="800px"
        m="0"
        borderRadius="none"
        overflow="auto"
        display={isShowSizeGuidePopUp && 'none'}
        data-qa="cbs_modal_flyoutsignin"
      >
        {children}
        <ModalCloseButton
          top={space.l}
          right={space.l}
          sx={{
            '&:focus': {
              boxShadow: 'none',
            },
            '& svg': { width: space.m, height: space.m },
          }}
          data-qa="rnr_icon_allrev_x"
        />
      </ModalContent>
    </Modal>
  )
}

export default QuickViewModal
