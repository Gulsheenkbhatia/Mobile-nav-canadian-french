import React, { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import get from 'lodash/get'
import { useUpdateAtom } from 'jotai/utils'
import { emailPattern } from 'helpers/validationPatterns'
import useTheme from 'toro/hooks/useTheme'
import { API_EMAIL_SIGN_UP } from 'toro/constants/Urls'
import Box from 'toro/components/Box'
import Input from 'toro/components/Input'
import Button from 'toro/components/Button'
import useAnalytics from 'toro/analytics/useAnalytics'
import Flex from 'toro/components/Flex'
import Text from 'toro/components/Text'
import useToast from 'toro/hooks/useToast'

import encodeEmail from 'toro/helpers/encodeEmail'
import { hashEmail } from 'toro/helpers/hashEmail'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import { useIntl } from 'react-intl'
import CustomSlot from 'toro/cms/components/CustomSlot'
import EmailSignupText from 'toro/components/footer/EmailSignupText'
import Checkbox from 'toro/components/Checkbox'
import FooterEmailConsentText from 'toro/components/footer/FooterEmailConsent/index'
import withCorrId from 'helpers/traceability'
import { xgenAlternateUserIdAtom } from 'store/xgen-recommendations.atom'

function getErrorMessage(value, apiErrorMessage) {
  let result = apiErrorMessage
  if (apiErrorMessage === 'is already signed up') {
    result = `${value} ${apiErrorMessage}`
  }
  return result
}

const EmailSignupForm = ({
  isToroCaEmailSignupTextEnabled,
  isTermsAndConditionTextEnabled,
  isSignupTextWithCheckbox,
  isDesktop,
  footerData,
  locale,
}) => {
  const { register, formState, handleSubmit, reset } = useForm()
  const successToast = useToast()
  const { formatMessage } = useIntl()
  const analytics = useAnalytics()
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState(null)
  const setXgenAlternateUserId = useUpdateAtom(xgenAlternateUserIdAtom)

  const sendGAError = (message) => {
    const eventLabel = message?.includes('is already signed up')
      ? `email ${message}`
      : 'email is invalid'

    analytics.send('siteError', {
      eventAction: 'SIGN UP',
      eventLocation: 'Footer',
      eventLabel,
    })
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

  const onError = (errors) => {
    const errorType = get(errors, 'email.type', '')
    const errorMessage = get(emailErrorMessage, errorType, '')
    if (errorMessage) {
      sendGAError(errorMessage)
    }
  }

  const onSubmit = async ({ email }) => {
    setLoading(true)
    setApiError(null)
    setXgenAlternateUserId(hashEmail(email))
    try {
      const fetchWithCorrId = withCorrId()
      const payload = JSON.stringify({ emailId: email })
      const rawResult = await fetchWithCorrId(
        `${API_EMAIL_SIGN_UP}?locale=${locale}&source=Footer`,
        {
          method: 'POST',
          body: payload,
        }
      )
      const result = await rawResult.json()

      if (result.error) {
        const apiErrorMessage = get(result, 'serverErrors[0]', '')
        setApiError(getErrorMessage(email, apiErrorMessage))
        sendGAError(apiErrorMessage)
      } else {
        analytics.send('emailSubscribe', {
          eventAction: 'marketing email opt-in',
          eventLocation: 'footer',
          eventLabel: hashEmail(email),
          emailShort: encodeEmail(email),
        })
        successToast({ description: result.successMessage })
        reset()
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const { onChange, ...restRegisterProps } = register('email', {
    required: true,
    pattern: emailPattern,
  })

  const termProps = register('termsAndCondition', {
    required:
      isTermsAndConditionTextEnabled &&
      isSignupTextWithCheckbox &&
      formatMessage({
        id: 'footer.newsletter.checkboxRequiredErr',
        defaultMessage: 'PLEASE SELECT THIS BOX TO RECEIVE EMAILS',
      }),
  })

  const onInputChange = useCallback((e) => {
    setApiError(null)
    onChange(e)
  }, [])

  const errorType = get(formState, 'errors.email.type')
  const termsAndConditionErrorMessage = get(formState, 'errors.termsAndCondition.message', '')
  const theme = useTheme()
  const styles = useMultiStyleConfig('EmailSignupForm')

  /**
   * @type React.FormEventHandler<HTMLFormElement>
   */
  const formHandler = useCallback(
    (e) => {
      handleSubmit(onSubmit, onError)(e)
    },
    [handleSubmit, onSubmit, onError]
  )

  return (
    <Box>
      <form name="subscription" onSubmit={formHandler}>
        <Box sx={styles.signupFormWrapper}>
          <Flex sx={styles.signupFormEmailBorder}>
            <Input
              type="text"
              placeholder={formatMessage({
                id: 'footer.emailInput',
                defaultMessage: 'Enter Email',
              })}
              sx={styles.signupFormEmailInput(isDesktop)}
              height={theme.space.xxl}
              onChange={onInputChange}
              flexGrow="1"
              className={apiError || errorType ? 'input-error' : ''}
              data-qa="ftr_inp_field_email"
              {...restRegisterProps}
            />
            <Button
              type="submit"
              disabled={loading}
              sx={styles.signupFormButton}
              data-qa="ftr_btn_signup"
            >
              {formatMessage({ id: 'footer.emailSignUp', defaultMessage: 'SIGN UP' })}
            </Button>
          </Flex>
          <Text
            size="xs"
            variant="body-text-secondary"
            sx={styles.signupFormErrorText}
            data-qa={
              errorType == 'required'
                ? 'ftr_errmsg_email'
                : errorType == 'pattern'
                ? 'ftr_errmsg_email'
                : 'ftr_errmsg_email'
            }
          >
            {apiError || get(emailErrorMessage, errorType, '')}
          </Text>
        </Box>
        <Box>
          {isTermsAndConditionTextEnabled ? (
            isSignupTextWithCheckbox ? (
              <Flex sx={styles.checkboxWrapper}>
                <Checkbox
                  sx={styles.checkboxButton}
                  spacing={3}
                  {...termProps}
                  data-qa="ftr_gdpr_recv_email_optin_chekbox"
                >
                  <CustomSlot
                    content={get(footerData, 'contentSlots["footer-email-consent"]', '')}
                    Component={FooterEmailConsentText}
                  />
                </Checkbox>
                {termsAndConditionErrorMessage && (
                  <Text
                    size="xs"
                    variant="body-text-secondary"
                    sx={styles.signupFormErrorText}
                    data-qa="ftr_gdpr_recv_email_slctcheckbox_alertmsg"
                  >
                    {termsAndConditionErrorMessage}
                  </Text>
                )}
              </Flex>
            ) : (
              <CustomSlot
                content={get(footerData, 'contentSlots["footer-email-consent"]', '')}
                Component={FooterEmailConsentText}
              />
            )
          ) : (
            isToroCaEmailSignupTextEnabled && (
              <CustomSlot
                content={get(footerData, 'contentSlots["toro-ca-footer-emailssignuptext"]', '')}
                Component={EmailSignupText}
              />
            )
          )}
        </Box>
      </form>
    </Box>
  )
}

export default withErrorBoundaryWrapper(EmailSignupForm)
