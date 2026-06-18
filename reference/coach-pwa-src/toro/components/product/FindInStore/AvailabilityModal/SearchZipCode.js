import React, { useCallback, useContext } from 'react'
import InputGroup from 'toro/components/InputGroup'
import Input from 'toro/components/Input'
import Flex from 'toro/components/Flex'
import Text from 'toro/components/Text'
import InputRightElement from 'toro/components/InputRightElement'
import useTheme from 'toro/hooks/useTheme'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import { useForm } from 'react-hook-form'
import Button from 'toro/components/Button'
import useViewportType from 'toro/hooks/useViewportType'
import PWAContext from 'components/common/PWAContext'
import get from 'lodash/get'
import { useIntl } from 'react-intl'
import PropTypes from 'prop-types'
import isCA from 'toro/helpers/isCA'
import { SearchIcon } from 'toro/icons'
import useAnalytics from 'toro/analytics/useAnalytics'

const zipcodeValidations = (locale) => {
  if (locale === 'en-GB') {
    return { min: 6, max: 8, regexValue: /^[A-Za-z][A-Za-z0-9]{1,3} [0-9][A-Za-z]{2}$/ }
  }

  if (locale === 'ja-JP') {
    return { min: 7, max: 8, regexValue: /^\d{3}-?\d{4}$/g, mask: /(\d{3})(\d{4})/ }
  }
  if (isCA()) {
    return { min: 6, max: 7, regexValue: /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/ }
  }
  return { min: 5, max: 5, regexValue: /^[0-9]+$/g }
}

const SearchZipCode = ({ handleSearch, initialZipCodeValue }) => {
  const { appData } = useContext(PWAContext)
  const { viewport } = useViewportType()
  const styles = useMultiStyleConfig('AvailabilityModal', { variant: viewport })
  const { formatMessage } = useIntl()
  const locale = get(appData, 'locale')
  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
    setValue,
  } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: { zipCode: initialZipCodeValue },
    shouldUnregister: true,
  })
  const analytics = useAnalytics()
  const { space, colors } = useTheme()

  const { min, max, regexValue, mask } = zipcodeValidations(locale)

  const onSubmit = ({ zipCode }) => handleSearch(zipCode)

  const onReset = useCallback(() => {
    setValue('zipCode', '')
  }, [])

  const handleOnChange = (e) => {
    let zipValue = e.target.value
    if (mask) {
      zipValue = zipValue.replace(mask, '$1-$2')
    }
    setValue('zipCode', zipValue)
  }

  const submitHandler = (e) => {
    if (!isValid) {
      analytics.send('siteError', {
        eventAction: 'zip',
        eventLocation: 'product',
        eventLabel: 'Please enter a correct zip code',
      })
    }
    handleSubmit(onSubmit)(e)
  }

  return (
    <>
      <form onSubmit={submitHandler} width="100%">
        <Flex justify="space-between">
          <Flex direction="column" mb={space.l} width="100%">
            <InputGroup maxWidth="400px" sx={styles.inputGroup}>
              <Input
                isInvalid={!!errors?.zipCode?.message}
                placeholder={formatMessage({
                  id: 'pdp.product.enterZipCode',
                  defaultMessage: 'Enter a ZIP Code',
                })}
                size="m"
                type="text"
                sx={styles.input}
                {...register('zipCode', {
                  onChange: handleOnChange,
                  required: formatMessage({
                    id: 'pdp.product.fieldIsRequired',
                    defaultMessage: 'This field is required.',
                  }),
                  minLength: {
                    value: min,
                    message: formatMessage({
                      id: 'pdp.product.invalidZipCode',
                      defaultMessage: 'Invalid Zip Code',
                    }),
                  },
                  maxLength: {
                    value: max,
                    message: formatMessage({
                      id: 'pdp.product.invalidZipCode',
                      defaultMessage: 'Invalid Zip Code',
                    }),
                  },
                  pattern: {
                    value: regexValue,
                    message: formatMessage({
                      id: 'pdp.product.invalidZipCode',
                      defaultMessage: 'Invalid Zip Code',
                    }),
                  },
                })}
                maxLength={max}
                height="30px"
                padding="10px 16px"
                data-qa="bm_txtbx_enterzip"
              />
              <Text>
                {formatMessage({
                  id: 'pdp.product.enterZipCode',
                  defaultMessage: 'Enter a ZIP Code',
                })}
              </Text>
              <InputRightElement
                width="auto"
                height="auto"
                sx={styles.rightElement}
                onClick={submitHandler}
                data-qa="bm_icon_enterzip_search"
              >
                <SearchIcon width="24" height="24" />
              </InputRightElement>
            </InputGroup>
            {errors?.zipCode?.message && (
              <Text
                as="div"
                variant="body-primary"
                size="sm"
                color={colors.error.primary}
                pt="s"
                mt="xs"
                sx={styles.errorText}
              >
                {errors?.zipCode?.message}
              </Text>
            )}
          </Flex>
          <Button
            onClick={onReset}
            variant="plain"
            size="md"
            height="21px"
            mt="7px"
            sx={styles.cancelButton}
            data-qa="bm_link_enterzip_search_cancel"
          >
            {formatMessage({
              id: 'pdp.product.cancel',
              defaultMessage: 'Cancel',
            })}
          </Button>
        </Flex>
      </form>
    </>
  )
}
SearchZipCode.propTypes = {
  handleSearch: PropTypes.func,
  initialZipCodeValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}
SearchZipCode.defaultProps = {
  handleSearch: () => {},
  initialZipCodeValue: '',
}

export default SearchZipCode
