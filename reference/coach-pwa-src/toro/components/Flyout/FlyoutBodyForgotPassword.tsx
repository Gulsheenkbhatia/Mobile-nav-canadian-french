import React, { memo, useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import Box from 'toro/components/Box'
import Text from 'toro/components/Text'
import Input from 'toro/components/InputMaterial'
import { RenderError } from 'toro/components/FlyoutDrawer/helpers'
import Button from 'toro/components/Button'
import Flex from 'toro/components/Flex'
import { API_FLYOUT_DO_FORGOT_PASSWORD } from 'toro/constants/Urls'
import pick from 'lodash/pick'
import { useAtom } from 'jotai'
import { setFullscreenLoadingAtom } from 'store/fullscreen-loading.atom'
import withCorrId from 'helpers/traceability'

function FlyoutBodyForgotPassword({ data, onClose, setDrawerHeader }) {
  const [, setFullscreenLoading] = useAtom(setFullscreenLoadingAtom)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'onTouched' })
  const { messageContainer, form, inputEmail, buttonSubmit, divider, buttonContinue } = data || {}
  const [responseMessage, setResponseMessage] = useState('')

  const handleClose = () => {
    onClose?.()
  }

  const onSubmit = async (data, e) => {
    setFullscreenLoading(true)
    const fetchWithCorrId = withCorrId()
    const action = e.target.action
    const actionUrl = new URL(action)
    const query = actionUrl.searchParams.toString()
    const url = `${API_FLYOUT_DO_FORGOT_PASSWORD}?${query}`
    const response = await fetchWithCorrId(url, {
      method: 'POST',
      body: JSON.stringify(data),
    })
    const result = await response.json()
    if (result.success) {
      setFullscreenLoading(false)
      const { receivedMsgBody, receivedMsgHeading } = pick(result, [
        'receivedMsgBody',
        'receivedMsgHeading',
      ])
      setDrawerHeader({ text: receivedMsgHeading })
      setResponseMessage(receivedMsgBody)
    } else {
      setFullscreenLoading(false)
    }
  }

  const formHandler: React.FormEventHandler<HTMLFormElement> = useCallback(
    (e) => {
      handleSubmit(onSubmit)(e)
    },
    [handleSubmit, onSubmit]
  )

  return (
    <Box>
      {!responseMessage ? (
        <form {...form?.attribs} onSubmit={formHandler} noValidate>
          <Box>
            <Text
              as="p"
              {...messageContainer?.p?.attribs}
              variant="body-primary"
              size="md"
              mb="14px"
            >
              {messageContainer?.p?.text}
            </Text>
          </Box>
          <Box mb="m">
            <Input
              variant="flyout"
              isInvalid={!!errors.loginEmail}
              {...inputEmail?.input?.attribs}
              {...register('loginEmail', {
                required: inputEmail?.input?.attribs?.['data-missing-error'],
                pattern: {
                  value: new RegExp(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.])*[a-zA-Z0-9]{1,}$/),
                  message: inputEmail?.input?.attribs?.['data-missing-error'],
                },
              })}
            />
            {RenderError(errors, 'loginEmail', inputEmail?.error?.attribs)}
          </Box>
          <Box pt="s" pb="l">
            <Button {...buttonSubmit?.button?.attribs} variant="primary" size="lg" w="100%">
              {buttonSubmit?.button?.text}
            </Button>
          </Box>
        </form>
      ) : (
        <Flex mb="l">
          <Text variant="body-primary" size="md">
            {responseMessage}
          </Text>
        </Flex>
      )}
      <Flex justifyContent="center" mb="l">
        <Text variant="body-primary" size="sm">
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

export default memo(FlyoutBodyForgotPassword)
