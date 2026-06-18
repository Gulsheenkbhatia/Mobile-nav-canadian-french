import React, { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { emailPattern } from 'helpers/validationPatterns'
import { API_NOTIFY_ME_SUBMIT } from 'toro/constants/Urls'
import { sha256 } from 'js-sha256'
import get from 'lodash/get'
import useAnalytics from 'toro/analytics/useAnalytics'
import Text from 'toro/components/Text'
import Input from 'toro/components/Input'
import Button from 'toro/components/Button'
import Modal from 'toro/components/Modal'
import ModalOverlay from 'toro/components/ModalOverlay'
import ModalContent from 'toro/components/ModalContent'
import ModalCloseButton from 'toro/components/ModalCloseButton'
import useTheme from 'toro/hooks/useTheme'
import notifyMeModalParser from 'toro/components/product/NotifyMeWidget/NotifyMePopUp/parser'
import useViewportType from 'toro/hooks/useViewportType'
import { useIntl } from 'react-intl'
import encodeEmail from 'toro/helpers/encodeEmail'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import { currentLocaleAtom } from 'store/global.atom'
import withCorrId from 'helpers/traceability'
import {
  notifyMeChosenProductIdAtom,
  notifyMeModalDataAtom,
  isNotifyMeModalVisibleAtom,
  setIsNotifyMeModalVisibleAtom,
  notifyMeChosenProductNameAtom,
} from 'store/notifyme.atom'
import usePreferenceNew from 'toro/hooks/usePreference_new'
import SlidingUpPopup from 'toro/components/SlidingUpPopup'
import Box from 'toro/components/Box'
import Checkbox from 'toro/components/Checkbox'
import CloseButton from 'toro/components/CloseButton'
import Hidden from 'toro/components/Hidden'
import Link from 'toro/components/Link'
import NotifyMeProductDetails from 'toro/components/product/NotifyMeWidget/NotifyMeProductDetails'

const NotifyMePopUp = () => {
  const {
    priceSitePreferences: { enableOptInOnNotifyMe },
  } = usePreferenceNew({
    priceSitePreferences: ['enableOptInOnNotifyMe'],
  })
  const { isDesktop, isMobile } = useViewportType()
  const newMobileStyling = enableOptInOnNotifyMe?.newStyling && isMobile
  const styles = useMultiStyleConfig('NotifyMePopUpTheme', {
    variant: newMobileStyling ? 'optInOnNotifyMe' : '',
  })
  const { register, formState, handleSubmit, getValues, reset } = useForm({
    defaultValues: {
      isNotifyMeOptIn: true,
    },
  })
  const theme = useTheme()
  const analytics = useAnalytics()
  const { space } = theme
  const notifyMeChosenProductId = useAtomValue(notifyMeChosenProductIdAtom)
  const notifyMeChosenProductName = useAtomValue(notifyMeChosenProductNameAtom)
  const notifyMeModalData = useAtomValue(notifyMeModalDataAtom)
  const isNotifyMeModalVisible = useAtomValue(isNotifyMeModalVisibleAtom)
  const setIsNotifyMeModalVisible = useUpdateAtom(setIsNotifyMeModalVisibleAtom)

  const { modalHeader, modalMessage, csrfToken } = notifyMeModalData
  const [isSuccess, setIsSuccess] = useState(false)
  const [submittedNotifyModalData, setSubmittedNotifyModalData] = useState()
  const [submitNotifyMeFailure, setSubmitNotifyMeFailure] = useState(false)
  const { formatMessage } = useIntl()
  const locale = useAtomValue(currentLocaleAtom)

  const errorPayload = {
    error: 'Something went wrong with the Notify Me API for the given product',
    context: {
      detail: {
        notifyMeChosenProductId,
      },
    },
  }

  const emailErrorMessage = {
    pattern: formatMessage({
      id: 'footer.newsletter.emailPatternErr',
      defaultMessage: 'Invalid email address format',
    }),
    required: formatMessage({
      id: 'footer.newsletter.emailRequiredErr',
      defaultMessage: 'This field is required',
    }),
  }

  const onClose = useCallback(() => {
    setIsNotifyMeModalVisible(false)
    setSubmitNotifyMeFailure(false)
    setIsSuccess(false)
    reset({ email: '', isNotifyMeOptIn: true })
  }, [])

  const handleClick = useCallback(() => {
    onClose()
    setIsSuccess(false)
    analytics.send('productInteraction', {
      eventLocation: 'product',
      eventAction: 'continue shopping',
      eventLabel: notifyMeChosenProductId,
    })
  }, [onClose, notifyMeChosenProductId])

  const SuccessModalPopUp = () => {
    const isNotifyMeOptInSelected =
      enableOptInOnNotifyMe?.enable && isMobile && getValues('isNotifyMeOptIn')
    const modalHeader = newMobileStyling
      ? formatMessage({
          id: isNotifyMeOptInSelected ? 'pdp.notifyOptinSuccessTitle' : 'pdp.notifyMeSuccessTitle',
          defaultMessage: "We'll be in touch!",
        })
      : submittedNotifyModalData?.modalHeader
    const modalMessage = newMobileStyling
      ? formatMessage({
          id: isNotifyMeOptInSelected
            ? 'pdp.notifyOptinSuccessMessage'
            : 'pdp.notifyMeSuccessMessage',
          defaultMessage: isNotifyMeOptInSelected
            ? "We'll notify you as soon as this item is back in stock, plus we'll also keep you updated with the latest Coach news and exclusive offers. You can unsubscribe at any time."
            : "We'll notify you as soon as this item is back in stock.",
        })
      : submittedNotifyModalData?.modalMessage

    return (
      <Box sx={styles.successModalContainer}>
        {!newMobileStyling && (
          <Text sx={styles.successModalPopUpHeading1(isDesktop)} variant="primary">
            {modalHeader}
          </Text>
        )}
        <Text variant="body-text-secondary" sx={styles.successModalPopUpHeading2(isDesktop)}>
          {modalMessage}
        </Text>
        {!newMobileStyling && (
          <Button
            variant="plain"
            size="lg"
            sx={styles.continueShoppingButton}
            onClick={handleClick}
          >
            {formatMessage({ id: 'pdp.product.notifyPopUpContinueShopping' })}
          </Button>
        )}
      </Box>
    )
  }

  async function fetchResponseNotifyModal(body) {
    try {
      const fetchWithCorrId = withCorrId()
      const result = await fetchWithCorrId(`${API_NOTIFY_ME_SUBMIT}?locale=${locale}`, {
        method: 'POST',
        body,
      })
      return await result.json()
    } catch (e) {
      console.error(e)
      return ''
    }
  }

  const onSubmit = async (e) => {
    const normalizedEmail = e?.email?.toLowerCase()
    analytics.send('emailSubscribe', {
      eventAction: 'notifyme email opt-in',
      eventLocation: 'modal',
      eventLabel: sha256(normalizedEmail),
      emailShort: encodeEmail(e.email),
    })
    if (e.isNotifyMeOptIn) {
      analytics.send('emailSubscribe', {
        eventAction: 'marketing email opt-in',
        eventLocation: 'modal',
        eventLabel: sha256(normalizedEmail),
        emailShort: encodeEmail(e.email),
      })
    }
    const submitValues = JSON.stringify({
      dwfrm_notifyMe_email: e.email,
      dwfrm_notifyMe_pid: notifyMeChosenProductId,
      dwfrm_notifyMe_UserOptin:
        enableOptInOnNotifyMe?.enable && isMobile ? e.isNotifyMeOptIn : false,
      csrf_token: csrfToken,
    })
    const successModalJSON = await fetchResponseNotifyModal(submitValues)
    if (!successModalJSON.successMessage) {
      setSubmitNotifyMeFailure(true)
      console.error(errorPayload)
      return null
    }
    const submittedModalDataObj = notifyMeModalParser(successModalJSON.successMessage)
    setSubmittedNotifyModalData(submittedModalDataObj)
    setSubmitNotifyMeFailure(false)
    setIsSuccess(true)
  }

  /**
   * @type React.FormEventHandler<HTMLFormElement>
   */
  const formHandler = useCallback(
    (e) => {
      handleSubmit(onSubmit)(e)
    },
    [handleSubmit, onSubmit]
  )

  const NotifyMeEmailPopUp = () => {
    const errorType = get(formState.errors.email, 'type')
    const inputError = get(emailErrorMessage, errorType, '')
    const headerText = newMobileStyling
      ? formatMessage(
          {
            id: 'pdp.notifyMePopupTitle',
            defaultMessage: 'Enter your email to be notified when {productName} is back in stock',
          },
          { productName: notifyMeChosenProductName }
        )
      : modalHeader
    return (
      <Box sx={styles.pdpTxtNotifymeFormContainer}>
        {newMobileStyling && <NotifyMeProductDetails styles={styles} />}
        <Text
          sx={styles.pdpTxtNotifymeModalHeader}
          size="xl"
          variant="primary"
          data-qa="pdp_txt_notifyme_modal_hdng1"
        >
          {headerText}
        </Text>
        {!newMobileStyling && (
          <Text
            variant="body-text-secondary"
            sx={styles.pdpTxtNotifymeModalHdng2}
            data-qa="pdp_txt_notifyme_modal_hdng2"
          >
            {modalMessage}
          </Text>
        )}
        <form onSubmit={formHandler}>
          {!newMobileStyling && (
            <Text
              variant="cta-primary"
              sx={styles.pdpTxtNotifymeModalEmailLabel}
              data-qa="pdp_txt_notifyme_modal_email_label"
            >
              {formatMessage({
                id: 'pdp.product.notifyPopUpEmail',
                defaultMessage: 'Email Address*',
              })}
            </Text>
          )}
          <Input
            name="email"
            type="text"
            placeholder={newMobileStyling ? 'Email' : undefined}
            variant="email-input"
            sx={styles.input}
            className={inputError ? 'error-state' : ''}
            {...register('email', {
              required: true,
              pattern: emailPattern,
            })}
            data-qa="pdp_txtbx_notifyme_modal_email"
          />
          {inputError && (
            <Text size="xs" variant="body-text-secondary" sx={styles.emailErrorMessageStyle}>
              {inputError}
            </Text>
          )}

          {enableOptInOnNotifyMe?.enable && (
            <Hidden onNonMobile>
              <Text size="xs" variant="body-text-secondary" sx={styles.pdpTxtNotifymeOptInHeading}>
                {formatMessage({
                  id: 'pdp.notifyMePopupOfferText',
                  defaultMessage: "Plus, don't miss the latest Coach news and offers!",
                })}
              </Text>
              <Checkbox spacing={2} {...register('isNotifyMeOptIn')}>
                {formatMessage(
                  {
                    id: 'pdp.notifyMePopupOptinDetail',
                    defaultMessage:
                      '<c>Sign up to receive marketing emails</c> (you can withdraw your consent at any time). Read our <a>Privacy Policy</a> and <b>Contact Us</b> for more details.',
                  },
                  {
                    a: (str) => (
                      <Link data-qa="notifyme_link_prpolicy" href="/support/privacy-policy">
                        {str}
                      </Link>
                    ),
                    b: (str) => (
                      <Link data-qa="notifyme_link_contactus" href="/contact-us">
                        {str}
                      </Link>
                    ),
                    c: (str) => <strong>{str}</strong>,
                  }
                )}
              </Checkbox>
            </Hidden>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            w="100%"
            sx={styles.pdpBtnNotifymeModalSubmit}
            data-qa="pdp_btn_notifyme_modal_submit"
          >
            <Box as="p">
              {formatMessage({ id: 'pdp.product.notifyPopUpSubmit', defaultMessage: 'Submit' })}
            </Box>
          </Button>
          {submitNotifyMeFailure ? (
            <Text variant="body-primary" size="md" sx={styles.somethingWentWrongMsg}>
              {formatMessage({
                id: 'pdp.product.notifyPopUpTryAgainText',
                defaultMessage: 'Something went wrong. Please try again later',
              })}
            </Text>
          ) : null}
        </form>
      </Box>
    )
  }

  const setFlyoutOpen = useCallback((isOpen) => !isOpen && onClose(), [onClose])

  if (newMobileStyling) {
    const isNotifyMeOptInSelected = enableOptInOnNotifyMe?.enable && getValues('isNotifyMeOptIn')
    return (
      <SlidingUpPopup setFlyoutOpen={setFlyoutOpen} isFlyoutOpen={isNotifyMeModalVisible}>
        <Box display="flex" justifyContent="flex-end" sx={styles.pdpNotifyMeStickyCloseButton}>
          {isSuccess ? (
            <Text sx={styles.successModalPopUpHeading1(isDesktop)} variant="primary">
              {formatMessage({
                id: isNotifyMeOptInSelected
                  ? 'pdp.notifyOptinSuccessTitle'
                  : 'pdp.notifyMeSuccessTitle',
                defaultMessage: "We'll be in touch!",
              })}
            </Text>
          ) : (
            <Text sx={styles.pdpTxtNotifymeModalTitle}>
              {formatMessage({
                id: 'pdp.notifyMeDetailsTitle',
                defaultMessage: 'Notify Me',
              })}
            </Text>
          )}
          <CloseButton size="xl" onClick={onClose} />
        </Box>
        {isSuccess ? <SuccessModalPopUp /> : <NotifyMeEmailPopUp />}
      </SlidingUpPopup>
    )
  }

  return (
    <Modal isOpen={isNotifyMeModalVisible} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent
        sx={styles.pdpModalNotifymeSection(isDesktop)}
        h={!isDesktop && '100%'}
        maxWidth="600px"
        data-qa="pdp_modal_notifyme"
        position="relative"
      >
        {isSuccess ? <SuccessModalPopUp /> : <NotifyMeEmailPopUp />}
        <ModalCloseButton
          name="radhikaistestinghere"
          sx={styles.modalCloseButtonStyles}
          top={space.xxl}
          right={space.xl}
          data-qa="rnr_icon_allrev_x"
        />
      </ModalContent>
    </Modal>
  )
}

export default withErrorBoundaryWrapper(NotifyMePopUp)
