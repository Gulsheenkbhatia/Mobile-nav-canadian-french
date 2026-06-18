import React, { memo, useCallback, useContext, useState } from 'react'
import Text from 'toro/components/Text'
import Input from 'toro/components/InputMaterial'
import Box from 'toro/components/Box'
import Flex from 'toro/components/Flex'
import Checkbox from 'toro/components/Checkbox'
import Button from 'toro/components/Button'
import { useForm } from 'react-hook-form'
import useAnalytics from 'toro/analytics/useAnalytics'
import { API_FLYOUT_DO_REGISTER } from 'toro/constants/Urls'
import SessionContext from 'toro/components/SessionContext'
import { mapRegisterServerErrorsToClient } from 'toro/components/FlyoutDrawer/helpers'
import HtmlContent from 'toro/components/HtmlContent'
import useTheme from 'toro/hooks/useTheme'
import { useAtom } from 'jotai'
import { setFullscreenLoadingAtom } from 'store/fullscreen-loading.atom'
import get from 'lodash/get'
import EnterpriseReCaptcha from 'toro/components/FlyoutDrawer/enterprise-recaptchav3'
import ReCaptchaV3 from 'toro/components/FlyoutDrawer/recaptchav3'
import usePreference from 'toro/hooks/usePreference_new'
import { useIntl } from 'react-intl'
import { FormErrorOutlineIcon as AlertIcon, CheckValidationIcon } from 'toro/icons'
import InputError from 'toro/components/Flyout/InputError'
import withCorrId from 'helpers/traceability'

const INPUTS_NAME = {
  firstName: 'dwfrm_profile_customer_firstname',
  lastName: 'dwfrm_profile_customer_lastname',
  email: 'dwfrm_profile_customer_email',
  password: 'dwfrm_profile_login_password',
}

const flyoutDoRegister = async (action, data) => {
  const fetchWithCorrId = withCorrId()
  const actionUrl = new URL(action)
  const query = actionUrl.searchParams.toString()
  const url = `${API_FLYOUT_DO_REGISTER}?${query}`
  const response = await fetchWithCorrId(url, {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return await response.json()
}

function FlyoutBodyRegister({ data, onClose }) {
  const [isSubmitClicked, setIsSubmitClicked] = useState(false)
  const { actions } = useContext(SessionContext)
  const analytics = useAnalytics()
  const [token, setToken] = useState()

  const {
    recaptcha: {
      // Preferences for Recaptcha V3
      enableCaptchaValidation: isEnableCaptchaValidation = [],
      googleCaptchaSiteKey: captchaSiteKey = [],
      // Preferences for Enterprise Recaptcha V3
      enableEnterpriseCaptchaValidation: isEnableEnterpriseCaptchaValidation = [],
      captchaEnterpriseSiteKey: enterpriseCaptchaSiteKey = [],
    },
  } = usePreference({
    recaptcha: [
      'enableCaptchaValidation',
      'googleCaptchaSiteKey',
      'enableEnterpriseCaptchaValidation',
      'captchaEnterpriseSiteKey',
    ],
  })

  const { fetchSession } = actions || {}
  const [, setFullscreenLoading] = useAtom(setFullscreenLoadingAtom)
  const theme = useTheme()
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    setError,
    watch,
  } = useForm({ mode: 'onTouched' })
  const [toastError, setToastError] = useState('')
  const {
    form,
    inputFirstName,
    inputLastName,
    inputEmail,
    inputPassword,
    passwordValidationMinLength,
    passwordValidationAlphanumeric,
    checkboxNewletter,
    inputCsrf,
    buttonSubmit,
    disclaimer,
  } = data || {}

  const handleClose = useCallback(() => {
    onClose?.()
  }, [onClose])

  const handleClick = useCallback(() => {
    setIsSubmitClicked(true)
  }, [])

  const handleNewsletterCheckboxChange = useCallback((e) => {
    const checked = e.target.checked
    setValue('dwfrm_profile_customer_addtoemaillist', checked)
  }, [])

  const onSubmit = useCallback(
    async (data, e) => {
      const registerData = {
        ...data,
        'g-recaptcha-response': token,
        dwfrm_profile_customer_token: token,
      }
      setFullscreenLoading(true)
      const result = await flyoutDoRegister(e.target.action, registerData)
      if (result.success) {
        await fetchSession?.()
        setFullscreenLoading(false)
        handleClose()
        const {
          email_short,
          eventAction,
          eventLabel,
          eventLoc,
          is_bsaved,
          is_psaved,
          newsletter_optin,
        } = result?.gtmData || {}
        analytics.send('signUp', {
          eventAction,
          eventLocation: eventLoc,
          eventLabel,
          emailShort: email_short,
          is_bsaved,
          is_psaved,
          newsletter_optin,
        })
      } else {
        setFullscreenLoading(false)
        // only the email field should be present on error, because that's the only unique one
        const fields = get(result, 'fields', {})
        const error = get(fields, INPUTS_NAME.email, '')

        if (error) {
          analytics.send('siteError', {
            eventAction: 'SIGN UP',
            eventLocation: 'account info',
            eventLabel: error,
          })
          setToastError(error) // TODO: add close handle or 'toast' so we can clear this
        }
        mapRegisterServerErrorsToClient(setError)(fields)
      }
    },
    [token, analytics]
  )

  const formHandler: React.FormEventHandler<HTMLFormElement> = useCallback(
    (e) => {
      handleSubmit(onSubmit)(e)
    },
    [handleSubmit, onSubmit]
  )

  return (
    <Box position="relative">
      <form {...form?.attribs} onSubmit={formHandler} noValidate>
        {toastError && (
          <Flex
            data-qa="cbs_err_alert_restrictions"
            background={theme.colors.main.lightGray}
            p="xs"
            mb="xs"
          >
            <AlertIcon width="16px" height="16px" />
            <Text ml="xs" variant="body-primary-with-links">
              <HtmlContent content={toastError} />
            </Text>
          </Flex>
        )}
        <Box mb="m">
          <Input
            variant="flyout"
            isInvalid={!!errors[INPUTS_NAME.firstName]}
            {...inputFirstName?.input?.attribs}
            {...register(INPUTS_NAME.firstName, {
              required: inputFirstName?.input?.attribs?.['data-missing-error'],
              maxLength: {
                value: inputFirstName?.input?.attribs?.maxLength,
                message: inputFirstName?.input?.attribs?.['data-missing-error'],
              },
            })}
          />
          <InputError
            error={errors?.[INPUTS_NAME.firstName]?.message}
            color={theme.colors.error.primary}
            {...inputFirstName?.error?.attribs}
          />
        </Box>
        <Box mb="m">
          <Input
            variant="flyout"
            isInvalid={!!errors[INPUTS_NAME.lastName]}
            {...inputLastName?.input?.attribs}
            {...register(INPUTS_NAME.lastName, {
              required: inputLastName?.input?.attribs?.['data-missing-error'],
              maxLength: {
                value: inputLastName?.input?.attribs?.maxLength,
                message: inputLastName?.input?.attribs?.['data-missing-error'],
              },
            })}
          />
          <InputError
            error={errors?.[INPUTS_NAME.lastName]?.message}
            color={theme.colors.error.primary}
            {...inputFirstName?.error?.attribs}
          />
        </Box>
        <Box mb="m">
          <Input
            variant="flyout"
            isInvalid={!!errors[INPUTS_NAME.email]}
            {...inputEmail?.input?.attribs}
            {...register(INPUTS_NAME.email, {
              required: inputEmail?.input?.attribs?.['data-missing-error'],
              maxLength: inputEmail?.input?.attribs?.maxLength,
              pattern: {
                value: new RegExp(inputEmail?.input?.attribs?.pattern),
                message: inputEmail?.input?.attribs?.['data-missing-error'],
              },
            })}
          />
          <InputError
            error={errors?.[INPUTS_NAME.email]?.message}
            color={theme.colors.error.primary}
            {...inputFirstName?.error?.attribs}
          />
        </Box>
        <Box mb="xl">
          <Input
            variant="flyout"
            isInvalid={!!errors[INPUTS_NAME.password]}
            {...inputPassword?.input?.attribs}
            {...register(INPUTS_NAME.password, {
              required: inputPassword?.input?.attribs?.['data-missing-error'],
              minLength: {
                value: inputPassword?.input?.attribs?.minLength,
                message: inputPassword?.input?.attribs?.['data-missing-error'],
              },
              maxLength: {
                value: inputPassword?.input?.attribs?.maxLength,
                message: inputPassword?.input?.attribs?.['data-missing-error'],
              },
              pattern: {
                value: /^(?=.*?[A-Za-z])(?=.*?[0-9]).{8,}$/,
                message: inputPassword?.input?.attribs?.['data-missing-error'],
              },
            })}
          />
          {watch(INPUTS_NAME.password)?.length === 0 && (
            <InputError
              error={errors?.[INPUTS_NAME.password]?.message}
              color={theme.colors.error.primary}
              {...inputFirstName?.error?.attribs}
            />
          )}
          <Box mt="6">
            <Validatable
              isValid={watch(INPUTS_NAME.password)?.length >= 8}
              data={passwordValidationMinLength}
            />
            <Validatable
              isValid={watch(INPUTS_NAME.password)?.match(/^(?=.*?[A-Za-z])(?=.*?[0-9])/)}
              data={passwordValidationAlphanumeric}
            />
          </Box>
        </Box>
        <Box mb="6">
          {isEnableCaptchaValidation && (
            <ReCaptchaV3 captchaSiteKey={captchaSiteKey} setToken={setToken} />
          )}
          {isEnableEnterpriseCaptchaValidation && (
            <>
              <EnterpriseReCaptcha
                enterpriceSiteKey={enterpriseCaptchaSiteKey}
                setToken={setToken}
                // isInvalid={!!errors['dwfrm_enterpriseRecaptcha']}
              />
              <Box mt="6">
                <CaptchaValidation
                  token={token}
                  isSubmitClicked={isSubmitClicked}
                  color={theme.colors.error.primary}
                />
              </Box>
            </>
          )}
        </Box>
        <Checkbox
          {...checkboxNewletter?.checkbox?.attribs}
          defaultChecked={true}
          alignItems="start"
          m="0"
          p="0"
          spacing="4"
          {...register('dwfrm_profile_customer_addtoemaillist', {
            value: checkboxNewletter?.checkbox?.attribs?.checked !== undefined,
          })}
          onChange={handleNewsletterCheckboxChange}
        >
          {checkboxNewletter?.label?.text}
        </Checkbox>
        <Input {...inputCsrf?.input?.attribs} {...register('csrf_token')} />
        <Box py="l">
          <Button
            {...buttonSubmit?.button?.attribs}
            onClick={handleClick}
            variant="primary"
            size="lg"
            w="100%"
          >
            {buttonSubmit?.button?.text}
          </Button>
          <Text variant="eyebrow-primary" size="md" mt="l" color={theme.colors.main.gray}>
            <HtmlContent content={disclaimer?.html} />
          </Text>
        </Box>
      </form>
    </Box>
  )
}

function Validatable({ isValid, data }: { isValid: boolean; data: any }) {
  return (
    <Flex alignItems="center" mb="1">
      <Box mr="2">
        <CheckValidationIcon
          fill={isValid ? '#2d9d78' : '#d8d8d8'}
          width="16"
          height="16"
          {...(isValid ? data?.iconValid?.attribs : data?.iconInvalid?.attribs)}
        />
      </Box>
      <Text variant="flyout-validation">{data?.div?.text}</Text>
    </Flex>
  )
}

function CaptchaValidation({ token, isSubmitClicked, color }) {
  const { formatMessage } = useIntl()

  return !token && isSubmitClicked ? (
    <Text as="div" variant="body-primary" size="sm" color={color} pt="s" mt="xs">
      {formatMessage({
        id: 'header.flyoutDrawer.completeCaptchaText',
        defaultMessage: 'Please complete the reCAPTCHA challenge.',
      })}
    </Text>
  ) : null
}

export default memo(FlyoutBodyRegister)
