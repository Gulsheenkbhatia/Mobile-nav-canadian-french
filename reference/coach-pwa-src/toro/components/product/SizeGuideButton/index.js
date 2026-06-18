import { memo, useMemo } from 'react'
import Button from 'toro/components/Button'
import Box from 'toro/components/Box'
import Modal from 'toro/components/Modal'
import { useIntl } from 'react-intl'
import ModalOverlay from 'toro/components/ModalOverlay'
import ModalContent from 'toro/components/ModalContent'
import ModalCloseButton from 'toro/components/ModalCloseButton'
import useDisclosure from 'toro/hooks/useDisclosure'
import HtmlContent from 'toro/components/HtmlContent'
import useViewportType from 'toro/hooks/useViewportType'
import useTheme from 'toro/hooks/useTheme'
import useAnalytics from 'toro/analytics/useAnalytics'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import PropTypes from 'prop-types'
import isSW from 'toro/helpers/isSW'
import { useUpdateAtom } from 'jotai/utils'
import { isSizeGuidePopUpOpenAtom } from 'store/pdp.atom'

function SizeGuideButton({
  isSticky,
  isQuickView,
  setShowSizeGuidePopUp,
  productId,
  quickViewEventLocation,
  variant,
  ...props
}) {
  const setSizeGuidePopUpOpen = useUpdateAtom(isSizeGuidePopUpOpenAtom)
  const { formatMessage } = useIntl()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isDesktop } = useViewportType()
  const theme = useTheme()
  const notBrandSW = !isSW()
  const analytics = useAnalytics()
  const styles = useMultiStyleConfig('SizeGuideTheme', { variant })

  const handleAnalyticsEvent = (eventName, eventLocation) => {
    analytics.send(eventName, {
      eventAction: eventName === 'quickViewInteraction' ? 'size guide' : 'size chart click',
      eventLabel: productId,
      eventLocation,
    })
  }

  const handlePopUpOpen = () => {
    setSizeGuidePopUpOpen(true)
    onOpen()
    isQuickView && setShowSizeGuidePopUp(true)
    if (isQuickView) {
      handleAnalyticsEvent('quickViewInteraction', quickViewEventLocation)
    } else {
      handleAnalyticsEvent('productInteraction', 'product')
    }
  }
  const handlePopUpClose = () => {
    setSizeGuidePopUpOpen(false)
    onClose()
    isQuickView && setShowSizeGuidePopUp(false)
  }

  const sizeGuideContainerStyles = useMemo(() => styles.sizeGuideContainer(isSticky), [isSticky])

  if (!props.sizeGuideContent) {
    console.warn(`Missing 'sizeGuideContent' prop`)
    return null
  }

  return (
    <>
      <Box sx={sizeGuideContainerStyles} className="size-guide-container">
        <Button
          variant="plain"
          size={isDesktop ? 'md' : 'sm'}
          onClick={handlePopUpOpen}
          data-qa={isQuickView ? 'pdp_btn_sizeguide' : 'pdp_btn_sizeguide'}
          sx={styles.sizeGuideButton}
        >
          {formatMessage({ id: 'pdp.product.sizeGuideButton', defaultMessage: 'see size guide' })}
        </Button>
      </Box>
      <Modal
        isOpen={isOpen}
        isCentered
        onClose={handlePopUpClose}
        scrollBehavior={'inside'}
        blockScrollOnMount={true}
      >
        <ModalOverlay />
        <ModalContent
          minWidth={isDesktop ? (notBrandSW ? '550px' : '600px') : notBrandSW ? '100%' : '83%'}
          maxHeight={isDesktop ? '100%' : '80%'}
          overflowY="auto"
          sx={styles.modalContentWrapper}
        >
          <ModalCloseButton
            top={notBrandSW ? '7px' : '35px'}
            data-qa="m_add_updated_toast_icon_close"
            sx={{
              '&:focus': theme.focus,
              zIndex: '100',
            }}
          />
          <Box overflow={notBrandSW ? 'auto' : 'initial'} width={'100%'}>
            <HtmlContent
              content={props.sizeGuideContent}
              margin={notBrandSW ? '0' : '0 48px 48px 48px'}
            />
          </Box>
        </ModalContent>
      </Modal>
    </>
  )
}

SizeGuideButton.propTypes = {
  isSticky: PropTypes.bool,
  isQuickView: PropTypes.bool,
  setShowSizeGuidePopUp: PropTypes.func,
  productId: PropTypes.string,
}

SizeGuideButton.defaultProps = {
  setShowSizeGuidePopUp: () => {},
}

export default memo(withErrorBoundaryWrapper(SizeGuideButton))
