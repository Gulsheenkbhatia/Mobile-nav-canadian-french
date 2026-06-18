import React, { useRef } from 'react'
import Box from 'toro/components/Box'
import Input from 'toro/components/Input'
import useTheme from 'toro/hooks/useTheme'
import PropTypes from 'prop-types'
import Flex from 'toro/components/Flex'
import Text from 'toro/components/Text'
import { useForm } from 'react-hook-form'
import { digitsOnly } from 'helpers/validationPatterns'
import getKeyboardHandler from 'helpers/getKeyboardHandler'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import { useIntl } from 'react-intl'
import isCA from 'toro/helpers/isCA'
import { useAtomValue } from 'jotai/utils'
import { isCompletePlpV3DesktopAtom, isPlpV3Atom } from 'store/plp.atom'

function FilterPriceField({
  label,
  currency,
  value,
  onChange,
  onBlur,
  onSubmit,
  isMinPrice,
  currencySymbolAfterPrice,
  variant,
}) {
  const isPlpV3 = useAtomValue(isPlpV3Atom)
  const styles = useMultiStyleConfig('Filters', { variant: variant || (isPlpV3 && 'plpV3') })
  const theme = useTheme()
  const inputRef = useRef()
  const { formatMessage } = useIntl()
  const { register, formState, setValue } = useForm({ mode: 'onChange' })
  const { dirtyFields, errors } = formState
  const isCALocale = isCA()
  const isCompletePlpV3Desktop = useAtomValue(isCompletePlpV3DesktopAtom)

  const { ...formRegisterProps } = register('price', {
    pattern: {
      value: digitsOnly,
      message: formatMessage({
        id: 'plp.filter.priceError',
        defaultMessage: 'Please type in a number.',
      }),
    },
    required: {
      value: true,
      message: formatMessage({
        id: 'plp.filter.priceError',
        defaultMessage: 'Please type in a number.',
      }),
    },
  })

  function handleInputChange(e) {
    const val = e.target.value.trim()
    setValue('price', val)
    onChange && onChange(val)
  }

  function handleInputBlur(e) {
    onBlur && onBlur(e.target.value.trim())
  }

  const handleInputKeyPress = getKeyboardHandler(['Enter'], () => {
    inputRef?.current && onSubmit && onSubmit(inputRef.current.value.trim())
  })
  const afterPriceCurrencyLeftPosition = `${35 + Math.max(String(value).length, 2) * 5.5}px`

  return (
    <Flex direction="column">
      <Box position="relative" display="flex">
        <Box
          sx={styles.priceInputHeading}
          position="absolute"
          top="6px"
          left="6px"
          data-qa={isMinPrice ? 'plpfltr_min_price_txtlbl' : 'plpfltr_max_price_txtlbl'}
        >
          {label}
        </Box>
        <Box
          sx={styles.priceCurrency(dirtyFields, currencySymbolAfterPrice)}
          position="absolute"
          bottom="4px"
          left={!currencySymbolAfterPrice ? '6px' : afterPriceCurrencyLeftPosition}
        >
          {currency}
        </Box>
        <Input
          sx={styles.priceInputBox(dirtyFields, null, currency.length)}
          name="price"
          variant="filter-input"
          isInvalid={!!errors?.price}
          {...formRegisterProps}
          ref={inputRef}
          value={value}
          type="number"
          inputMode="numeric"
          pl={isCALocale ? (isCompletePlpV3Desktop ? '34px !important' : '25px') : '14px'}
          data-qa={isMinPrice ? 'plpfltr_min_price_input' : 'plpfltr_max_price_input'}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyPress={handleInputKeyPress}
        />
      </Box>
      {errors?.price && (
        <Text
          sx={styles.priceErrorMessage}
          variant="body-primary"
          size="sm"
          color={theme.colors.error.primary}
          mt="s"
        >
          {errors.price.message}
        </Text>
      )}
    </Flex>
  )
}

FilterPriceField.propTypes = {
  label: PropTypes.string,
  currency: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onChange: PropTypes.func,
}

FilterPriceField.defaultProps = {
  label: 'price',
  currency: '$',
  value: 0,
}

export default FilterPriceField
