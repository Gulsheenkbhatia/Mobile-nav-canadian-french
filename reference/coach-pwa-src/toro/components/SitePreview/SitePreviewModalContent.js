import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Box, Button, Flex, Input, Select, VStack } from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import Center from 'toro/components/Center'
import isPlainObject from 'lodash/isPlainObject'
import isEmpty from 'lodash/isEmpty'
import { useIntl } from 'react-intl'
import { appendPreviewParams, splitDateTime, stopPreviewHandler } from 'toro/helpers/sitePreview'
import PWAContext from 'components/common/PWAContext'
import { CloseIcon } from 'toro/icons'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import Cookies from 'js-cookie'
import { sitePreviewAtom, setSitePreviewSessionAtom } from 'store/site-preview.atom'
import { COOKIE_SITE_PREVIEW } from 'toro/constants/cookies'
import usePageType from 'toro/hooks/usePageType'

export default function SitePreviewModalContent({
  onClose,
  onOpenSiteClearCacheModal,
  onOpenPreferencesModal,
  openExperimentsModal,
  onOpenProductDetailsTooltipModal,
  onOpenTemplateEditorModal,
}) {
  const { customerGroupsData, sourceCodeGroupsData, sitePreviewConfig } =
    useAtomValue(sitePreviewAtom)
  const setSitePreviewSessionData = useUpdateAtom(setSitePreviewSessionAtom)
  const { register, handleSubmit, reset } = useForm()

  const formRef = useRef()
  const dateInputRef = useRef()
  const timeInputRef = useRef()
  const [dateError, setDateError] = useState('')
  const [timeError, setTimeError] = useState('')
  const { formatMessage } = useIntl()
  const { appData } = useContext(PWAContext)
  const { isCacheClearEnabled = false } = appData
  const { isPDP } = usePageType()

  const isSitePreviewActive = useMemo(
    () => isPlainObject(sitePreviewConfig) && !isEmpty(sitePreviewConfig),
    [sitePreviewConfig]
  )

  useEffect(() => {
    if (isSitePreviewActive) {
      const { date, time } = splitDateTime(sitePreviewConfig.dateTime)
      let currentDate = new Date(date + ' ' + time)
      currentDate.setMinutes(currentDate.getMinutes() - currentDate.getTimezoneOffset())
      timeInputRef.current.valueAsDate = currentDate
      dateInputRef.current.valueAsDate = currentDate
    } else {
      let currentTime = new Date().toLocaleTimeString('en-US').split(':')
      const timeModifer = currentTime[2].split(' ')[1]
      currentTime.pop()
      currentTime = currentTime.join(':')
      currentTime = currentTime + ' ' + timeModifer
      let currentDate = new Date(new Date().toLocaleDateString('en-US') + ' ' + currentTime)
      currentDate.setMinutes(currentDate.getMinutes() - currentDate.getTimezoneOffset())
      timeInputRef.current.valueAsDate = currentDate
      dateInputRef.current.valueAsDate = currentDate
    }
  }, [isSitePreviewActive, sitePreviewConfig])

  const onSubmit = (data) => {
    let date = dateInputRef.current.value
    const time = timeInputRef.current.value
    if (date && time) {
      date = date.replaceAll('-', '')
      const formattedDate = date
      const dateTime = formattedDate + time.replace(':', '')
      const appliedConfig = { ...data, dateTime }
      delete appliedConfig?.date
      delete appliedConfig?.time
      setSitePreviewSessionData(appliedConfig)
      Cookies.set(COOKIE_SITE_PREVIEW, JSON.stringify(appliedConfig), {
        secure: true,
        sameSite: 'None',
      })
      const url = appendPreviewParams(window.location.href, appliedConfig)
      window.location.assign(url)
    } else {
      if (!date) {
        setDateError(
          formatMessage({ id: 'header.sitePreviewDateError', defaultMessage: 'Date Required' })
        )
      }
      if (!time) {
        setTimeError(
          formatMessage({ id: 'header.sitePreviewTimeError', defaultMessage: 'Time Required' })
        )
      }
    }
  }

  const clearSiteCacheClickHandler = useCallback(() => {
    onClose()
    onOpenSiteClearCacheModal()
  }, [onClose, onOpenSiteClearCacheModal])

  const onDateInputChange = useCallback(() => {
    if (dateError && dateInputRef.current.value) {
      setDateError('')
    }
  }, [dateError])

  const onTimeInputChange = useCallback(() => {
    if (timeError && timeInputRef.current.value) {
      setTimeError('')
    }
  }, [timeError])

  const onSubmitButtonClick = useCallback((e) => {
    e.target.blur()
    if (!dateInputRef.current.value) {
      setDateError(
        formatMessage({
          id: 'header.sitePreviewDateError',
          defaultMessage: 'Date Required',
        })
      )
    }

    if (!timeInputRef.current.value) {
      setTimeError(
        formatMessage({
          id: 'header.sitePreviewTimeError',
          defaultMessage: 'Time Required',
        })
      )
    }
  }, [])

  const onClear = useCallback(
    (e) => {
      e.target.blur()
      formRef.current.reset()
      if (dateError) {
        setDateError('')
      }
      if (timeError) {
        setTimeError('')
      }
      reset()
    },
    [dateError, timeError]
  )

  /**
   * @type React.FormEventHandler<HTMLFormElement>
   */
  const formHandler = useCallback(
    (e) => {
      handleSubmit(onSubmit)(e)
    },
    [handleSubmit, onSubmit]
  )

  return (
    <Flex>
      <VStack m="auto">
        <form onSubmit={formHandler} ref={formRef} className="preview-form">
          <Flex justifyContent="space-between" alignItems="center" mb="5">
            <Box p="2" flex="1" fontSize="22px" fontWeight="bold">
              {formatMessage({
                id: 'header.sitePreviewControls',
                defaultMessage: 'Site Preview Controls',
              })}
            </Box>
          </Flex>

          <label htmlFor="Date">
            <strong>
              {formatMessage({ id: 'header.sitePreviewDate', defaultMessage: 'Date/Time' })}
            </strong>
          </label>
          <Flex justifyContent="space-between" alignItems="center">
            <Box>
              <Input
                className="dateInput"
                {...register('date')}
                ref={dateInputRef}
                type="date"
                onChange={onDateInputChange}
              />

              <Box as="p" color="red">
                {dateError}
              </Box>
            </Box>
            <Box>
              <Input
                type="time"
                {...register('time')}
                ref={timeInputRef}
                onChange={onTimeInputChange}
              />
              <Box as="p" color="red">
                {timeError}
              </Box>
            </Box>
          </Flex>

          <Box mt="30px">
            <label htmlFor="source-code">
              <strong>
                {formatMessage({
                  id: 'header.sitePreviewSourceCode',
                  defaultMessage: 'Source Code',
                })}
              </strong>{' '}
            </label>
            <Box>
              <Select width="100%" {...register('source-code')}>
                <option></option>

                {sourceCodeGroupsData?.map((item) => {
                  return isSitePreviewActive && sitePreviewConfig['source-code'] === item.id ? (
                    <option key={item.id} value={item.id} selected>
                      {item.id}
                    </option>
                  ) : (
                    <option value={item.id}>{item.id}</option>
                  )
                })}
              </Select>
            </Box>
          </Box>

          <Box mt="20px">
            <label htmlFor="customer-group">
              <strong>
                {formatMessage({
                  id: 'header.sitePreviewCustomerGroup',
                  defaultMessage: 'Customer Group',
                })}
              </strong>{' '}
            </label>

            <Box border="1px solid var(--color-inactive)">
              <select multiple size="10" {...register('customer-group')}>
                <option></option>
                {customerGroupsData?.map((item) => {
                  return isSitePreviewActive &&
                    sitePreviewConfig['customer-group']?.includes(item.id) ? (
                    <option key={item.id} value={item.id} selected>
                      {item.id}
                    </option>
                  ) : (
                    <option value={item.id}>{item.id}</option>
                  )
                })}
              </select>
            </Box>
          </Box>

          <Flex py="20px">
            <Button
              type="submit"
              bg="black"
              mx="2"
              color="white"
              onClick={onSubmitButtonClick}
              w="50%"
            >
              {formatMessage({ id: 'header.sitePreviewSubmit', defaultMessage: 'Submit' })}
            </Button>
            <Button bg="red" color="white" flex="1" onClick={onClear}>
              {formatMessage({ id: 'header.sitePreviewClear', defaultMessage: 'CLEAR' })}
            </Button>
          </Flex>
          <Center>
            {isSitePreviewActive ? (
              <Button
                onClick={(e) => {
                  stopPreviewHandler(e)
                }}
                bg="black"
                color="white"
                mb="20px"
              >
                {formatMessage({ id: 'header.sitePreviewStop', defaultMessage: 'Stop Preview' })}
              </Button>
            ) : null}
          </Center>
        </form>
        <Button width="100%" mb="2" onClick={openExperimentsModal}>
          AB tests
        </Button>
        <Button width="100%" mb="2" onClick={onOpenPreferencesModal}>
          Preferences
        </Button>
        <Button width="100%" mb="2" onClick={onOpenProductDetailsTooltipModal}>
          Product details tooltip
        </Button>
        {isPDP && (
          <Button width="100%" mb="2" onClick={onOpenTemplateEditorModal}>
            PDP Template Editor
          </Button>
        )}
        {isCacheClearEnabled && (
          <Button bg="red" width="100%" onClick={clearSiteCacheClickHandler}>
            {formatMessage({
              id: 'header.sitePreview.clearSiteCacheModal.btnText',
              defaultMessage: 'CLEAR SITE CACHE',
            })}
          </Button>
        )}
      </VStack>
      <CloseIcon height="24px" width="24px" onClick={onClose} />
    </Flex>
  )
}
