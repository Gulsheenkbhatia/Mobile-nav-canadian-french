import React, { memo, useCallback } from 'react'
import Modal from 'toro/components/Modal'
import ModalOverlay from 'toro/components/ModalOverlay'
import ModalContent from 'toro/components/ModalContent'
import Box from 'toro/components/Box'
import Text from 'toro/components/Text'
import Button from 'toro/components/Button'
import { useIntl } from 'react-intl'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'

const LanguageSelectorModal = ({ redirectLink, setRedirectLink }) => {
  const styles = useMultiStyleConfig('LanguageSelector')
  const onContinueBtnClick = () => {
    window.location = redirectLink
  }

  const onStayClick = useCallback(() => {
    setRedirectLink('')
  }, [setRedirectLink])

  const { formatMessage } = useIntl()

  return (
    <Modal
      motionPreset="slideInBottom"
      isOpen={Boolean(redirectLink)}
      closeOnEsc={false}
      closeOnOverlayClick={false}
      isCentered
    >
      <ModalOverlay />
      <ModalContent sx={styles.modalContent}>
        <Box>
          <Box as="h2" data-qa="d_cs_modal_title_txt" sx={styles.selectorMessageContainer}>
            {formatMessage({
              id: 'header.languageSelector.shopByYourShippingDestination',
              defaultMessage: 'Shop By Your Shipping Destination',
            })}
          </Box>
          <Text maxWidth="595px" data-qa="d_cs_modal_msg_txt" sx={styles.selectorMessageText}>
            {formatMessage({
              id: 'header.languageSelector.quickerService',
              defaultMessage:
                'For quicker service we’ll redirect you to shop the website closest to your shipping destination. Items in your bag will not carry over since our assortments vary by region.',
            })}
          </Text>
        </Box>
        <Button
          onClick={onContinueBtnClick}
          w="100%"
          sx={styles.selectorButtonRedirect}
          colorScheme="black"
          data-qa="d_cs_modal_continue_to_other_site_btn"
        >
          {formatMessage({
            id: 'header.languageSelector.otherSite',
            defaultMessage: 'CONTINUE TO OTHER SITE',
          })}
        </Button>
        <Button
          onClick={onStayClick}
          w="100%"
          sx={styles.selectorButton}
          colorScheme="black"
          variant="outline"
        >
          {formatMessage({
            id: 'header.languageSelector.stayOnSite',
            defaultMessage: 'STAY ON THIS SITE',
          })}
        </Button>
      </ModalContent>
    </Modal>
  )
}

export default memo(LanguageSelectorModal)
