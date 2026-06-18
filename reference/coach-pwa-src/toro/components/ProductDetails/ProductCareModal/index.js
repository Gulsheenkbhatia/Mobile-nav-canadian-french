import React from 'react'
import { useIntl } from 'react-intl'
import Modal from 'toro/components/Modal'
import ModalOverlay from 'toro/components/ModalOverlay'
import ModalContent from 'toro/components/ModalContent'
import ModalCloseButton from 'toro/components/ModalCloseButton'
import useViewportType from 'toro/hooks/useViewportType'
import useTheme from 'toro/hooks/useTheme'
import ModalHeader from 'toro/components/ModalHeader'
import ModalBody from 'toro/components/ModalBody'

/**
 * Fullscreen modal that contains product care data
 *
 * @param  {Function} onClose close handler
 */
const ProductCareModal = ({ onClose, children, ...rest }) => {
  const { isMobile } = useViewportType()
  const theme = useTheme()
  const { space, colors } = theme
  const { formatMessage } = useIntl()
  return (
    <Modal onClose={onClose} isOpen isCentered scrollBehavior={'inside'}>
      <ModalOverlay opacity="0.8 !important" background={colors.main.black} />
      <ModalContent
        p="s"
        maxWidth="none"
        h={isMobile ? '100vh' : '80%'}
        w={isMobile ? '100vw' : '50%'}
        maxHeight={isMobile && 'calc(100% + 7.5rem)'}
        borderRadius="none"
      >
        <ModalHeader boxShadow="none" mt="25px">
          <ModalCloseButton
            top={space.xl}
            right={space.xl}
            mt="20px"
            sx={{
              '&:focus': {
                boxShadow: 'none',
              },
              '& svg': { width: space.m, height: space.m },
            }}
          />
          {formatMessage({
            id: 'pdp.productCare.title',
            defaultMessage: 'Product Care',
          })}
        </ModalHeader>
        <ModalBody
          overflow="auto"
          css={{
            '&::-webkit-scrollbar': {
              width: '14px',
            },
            '&::-webkit-scrollbar-track': {
              background: colors.neutral.light,
            },
            '&::-webkit-scrollbar-thumb': {
              height: '220px',
              background: colors.neutral.base,
              backgroundClip: 'padding-box',
              border: '4px solid white',
              borderRadius: '7px',
            },
          }}
          {...rest}
        >
          {children}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default ProductCareModal
