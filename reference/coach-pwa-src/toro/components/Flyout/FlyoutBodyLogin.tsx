import React, { memo, useCallback, useContext, useMemo, useState } from 'react'
import Text from 'toro/components/Text'
import Input from 'toro/components/InputMaterial'
import Box from 'toro/components/Box'
import Flex from 'toro/components/Flex'
import Checkbox from 'toro/components/Checkbox'
import Button from 'toro/components/Button'
import { useForm } from 'react-hook-form'
import useAnalytics from 'toro/analytics/useAnalytics'
import { API_FLYOUT_DO_LOGIN } from 'toro/constants/Urls'
import SessionContext from 'toro/components/SessionContext'
import { mapLoginServerErrorToClient } from 'toro/components/FlyoutDrawer/helpers'
import HtmlContent from 'toro/components/HtmlContent'
import { useUpdateAtom } from 'jotai/utils'
import { setFullscreenLoadingAtom } from 'store/fullscreen-loading.atom'
import { useIntl } from 'react-intl'
import { setFlyoutConfigAtom } from 'store/flyout.atom'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import InputError from 'toro/components/Flyout/InputError'
import useTheme from 'toro/hooks/useTheme'
import withCorrId from 'helpers/traceability'

const INPUTS_NAME = {
  login: 'loginEmail',
  password: 'loginPassword',
  loginRememberMe: 'loginRememberMe',
}

const flyoutDoLogin = async (action, data) => {
  const fetchWithCorrId = withCorrId()
  const actionUrl = new URL(action)
  const query = actionUrl.searchParams.toString()
  const url = `${API_FLYOUT_DO_LOGIN}?${query}`
  const response = await fetchWithCorrId(url, {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return await response.json()
}

function FlyoutBodyLogin({ data, onClose }) {
  const setFlyoutConfig = useUpdateAtom(setFlyoutConfigAtom)
  const { actions } = useContext(SessionContext)
  const { fetchSession } = actions || {}
  const analytics = useAnalytics()
  const { formatMessage } = useIntl()
  const setFullscreenLoading = useUpdateAtom(setFullscreenLoadingAtom)
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    setError,
  } = useForm({ mode: 'onTouched' })
  const [toastError, setToastError] = useState('')
  const [passwordVisible, setPasswordVisible] = useState(false)
  const {
    form,
    inputEmail,
    inputPassword,
    checkboxRememberMe,
    buttonForgotPassword,
    inputCsrf,
    buttonSubmit,
    buttonRegister,
    divider,
    buttonContinue,
  } = data || {}

  const styles = useMultiStyleConfig('Flyout')
  const theme = useTheme()

  const handleClose = useCallback(() => {
    onClose?.()
  }, [onClose])

  const handlePasswordVisibility = useCallback(() => {
    setPasswordVisible((prev) => !prev)
  }, [])

  const handleRegisterClick = useCallback((e) => {
    const url = e.target.getAttribute('data-action-url') || e.target.getAttribute('data-url')
    const tokens = url.split('?')
    const searchParams = new URLSearchParams(tokens[1])
    const options = {}
    searchParams.forEach((val, key) => {
      options[key] = val
    })
    setFlyoutConfig({ type: 'register', options })
  }, [])

  const handleForgotPasswordClick = useCallback(() => {
    setFlyoutConfig({ type: 'forgot-password', options: { resetPasswordFlyout: true } })
  }, [])

  const handleRememberMeCheckboxChange = useCallback((e) => {
    const checked = e.target.checked
    setValue(INPUTS_NAME.loginRememberMe, checked ? 'on' : 'off')
  }, [])

  const onSubmit = async (data, e) => {
    setFullscreenLoading(true)
    const isRememberMeChecked = data?.[INPUTS_NAME.loginRememberMe] === 'on'
    const result = await flyoutDoLogin(e.target.action, data)
    if (result.success) {
      await fetchSession?.()
      setFullscreenLoading(false)
      handleClose()
      const { email_short, eventAction, eventLabel, eventLoc, remember_me, remember_me_option } =
        result?.gtmData || {}
      analytics.send('loginData', {
        eventAction,
        eventLocation: eventLoc,
        eventLabel,
        emailShort: email_short,
        rememberMe: isRememberMeChecked ? remember_me : 'unpopulated',
        rememberMeOption: isRememberMeChecked ? remember_me_option : 'unchecked',
      })
    } else {
      setFullscreenLoading(false)
      const error = result?.error[0]
      if (error) {
        analytics.send('siteError', {
          eventAction: 'SIGN IN',
          eventLocation: 'account info',
          eventLabel: error,
        })
        setToastError(error) // TODO: add close handle or 'toast' so we can clear this
        mapLoginServerErrorToClient(setError)([INPUTS_NAME.login, INPUTS_NAME.password])
      }
    }
  }

  const passwordVisibilityMessage = useMemo(
    () =>
      formatMessage(
        passwordVisible
          ? {
              id: 'header.flyoutDrawer.hidePasswordText', // need to add this prop to amplience localeMessages
              defaultMessage: 'Hide',
            }
          : {
              id: 'header.flyoutDrawer.showPasswordText', // need to add this prop to amplience localeMessages
              defaultMessage: 'Show',
            }
      ),
    [passwordVisible]
  )

  const invalidLoginMessage = useMemo(
    () =>
      formatMessage({
        id: 'header.flyoutDrawer.loginEmail',
        defaultMessage: 'Please enter a valid email address.',
      }), // Not available in the Login-ShowFlyout response
    []
  )

  const formHandler: React.FormEventHandler<HTMLFormElement> = useCallback(
    (e) => {
      handleSubmit(onSubmit)(e)
    },
    [handleSubmit, onSubmit]
  )

  return (
    <Box>
      <form {...form?.attribs} onSubmit={formHandler} noValidate>
        {toastError && (
          <Box data-qa="cbs_err_alert_restrictions">
            <Text variant="body-primary-with-links">
              <HtmlContent content={toastError} />
            </Text>
          </Box>
        )}
        <Box mb="m">
          <Input
            variant="flyout"
            isInvalid={!!errors[INPUTS_NAME.login]}
            {...inputEmail?.input?.attribs}
            {...register(INPUTS_NAME.login, {
              required: inputEmail?.input?.attribs?.['data-missing-error'],
              maxLength: inputEmail?.input?.attribs?.maxLength,
              pattern: {
                value: new RegExp(inputEmail?.input?.attribs?.pattern),
                message: invalidLoginMessage,
              },
            })}
          />
          <InputError
            error={errors?.[INPUTS_NAME.login]?.message}
            color={theme.colors.error.primary}
            {...inputEmail?.error?.attribs}
          />
        </Box>
        <Box mb="l">
          <Input
            variant="flyout"
            isInvalid={!!errors[INPUTS_NAME.password]}
            {...inputPassword?.input?.attribs}
            type={passwordVisible ? 'text' : 'password'}
            {...register(INPUTS_NAME.password, {
              required: inputPassword?.input?.attribs?.['data-missing-error'],
            })}
          />
          <Button
            variant="plain"
            onClick={handlePasswordVisibility}
            sx={styles?.passwordVisibilityButton}
          >
            {passwordVisibilityMessage}
          </Button>
          <InputError
            error={errors?.[INPUTS_NAME.password]?.message}
            color={theme.colors.error.primary}
            {...inputPassword?.error?.attribs}
          />
        </Box>
        <Flex>
          <Checkbox
            {...checkboxRememberMe?.checkbox?.attribs}
            defaultChecked={true}
            p="0"
            m="0"
            spacing="12px"
            {...register(INPUTS_NAME.loginRememberMe, {
              value: checkboxRememberMe?.checkbox?.attribs?.checked !== undefined ? 'on' : 'off',
            })}
            onChange={handleRememberMeCheckboxChange}
          >
            {checkboxRememberMe?.label?.text}
          </Checkbox>
          <Button
            {...buttonForgotPassword?.button?.attribs}
            variant="plain"
            size="md"
            ml="auto"
            onClick={handleForgotPasswordClick}
          >
            {buttonForgotPassword?.button?.text}
          </Button>
        </Flex>
        <Input {...inputCsrf?.input?.attribs} {...register('csrf_token')} />
        <Box py="l">
          <Button {...buttonSubmit?.button?.attribs} variant="primary" size="lg" w="100%">
            {buttonSubmit?.button?.text}
          </Button>
        </Box>
      </form>
      <Flex {...buttonRegister?.parent?.attribs} alignItems="baseline">
        <Text variant="body-primary" size="md">
          {buttonRegister?.parent?.text}&nbsp;
        </Text>
        <Button
          {...buttonRegister?.button?.attribs}
          variant="plain"
          size="md"
          onClick={handleRegisterClick}
        >
          {buttonRegister?.button?.text}
        </Button>
      </Flex>
      <Flex justifyContent="center" my="l">
        <Text variant="body-primary" size="md">
          {divider?.div?.text}
        </Text>
      </Flex>
      <Flex justifyContent="center">
        <Button
          {...buttonContinue?.button?.attribs}
          variant="plain"
          size="md"
          onClick={handleClose}
        >
          {buttonContinue?.button?.text}
        </Button>
      </Flex>
    </Box>
  )
}

export default memo(FlyoutBodyLogin)
