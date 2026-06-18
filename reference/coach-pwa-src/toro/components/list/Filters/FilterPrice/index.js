import React, { memo, useCallback, useContext, useEffect, useRef, useState } from 'react'
import FilterPriceField from 'toro/components/list/Filters/FilterPrice/FilterPriceField'
import Flex from 'toro/components/Flex'
import Text from 'toro/components/Text'
import RangeSlider from 'toro/components/RangeSlider'
import withFilterControl from 'toro/components/list/Filters/withFilterControl'
import clamp from 'toro/helpers/clamp'
import Box from 'toro/components/Box'
import debounce from 'lodash/debounce'
import usePreference from 'toro/hooks/usePreference_new'
import PWAContext from 'components/common/PWAContext'
import { useIntl } from 'react-intl'
import get from 'lodash/get'
import { PRICE_ACTION_LOCATION_NAMES } from 'toro/constants/googleAnalytics'
import getCurrentLocale from 'toro/helpers/getCurrentLocale'
import { useAtomValue } from 'jotai/utils'
import { filtersAtom } from 'store/search-results.atom'
import { isCompletePlpV3DesktopAtom } from 'store/plp.atom'

function FilterPrice({ refinement, handleFilterChange, styles, variant }) {
  const filters = useAtomValue(filtersAtom)
  const isCompletePlpV3Desktop = useAtomValue(isCompletePlpV3DesktopAtom)
  const { formatMessage } = useIntl()
  const { responseDelay: searchDelay = 0, sliderStepSize: stepValue = 1 } = usePreference({
    searchRefinements: ['responseDelay', 'sliderStepSize'],
  })
  const [inputPriceRange, setInputPriceRange] = useState({ min: 0, max: 0 })
  const [sliderPriceRange, setSliderPriceRange] = useState({ min: 0, max: 0 })
  const [priceRangeLimit, setPriceRangeLimit] = useState({ min: 0, max: 0 })
  const [priceFilterOption, setPriceFilterOption] = useState(null)
  const [priceFilterLocation, setPriceFilterLocation] = useState(null)
  const { appData } = useContext(PWAContext)
  const locale = get(appData, 'locale')
  const { currencySymbol, currencySymbolAfterPrice } = getCurrentLocale(locale)

  const debouncedFilterChange = useCallback(debounce(handleFilterChange, searchDelay), [
    searchDelay,
    handleFilterChange,
  ])

  const [zIndexValues, setZIndexValues] = useState([0, 1])
  const prevInputValues = useRef(inputPriceRange)

  useEffect(() => {
    // if cursor is moved in the same place second time, don't update zIndex
    if (
      inputPriceRange?.min === prevInputValues.current?.min &&
      inputPriceRange?.max === prevInputValues.current?.max
    ) {
      return
    }

    if (inputPriceRange?.min === prevInputValues.current?.min) {
      setZIndexValues([0, 1])
    } else {
      setZIndexValues([1, 0])
    }
    prevInputValues.current = inputPriceRange
  }, [inputPriceRange])

  useEffect(() => {
    let _inputPriceRange
    let _sliderPriceRange

    const existingMinPriceFilter = filters.find((f) => f.id === 'pmin')
    const existingMaxPriceFilter = filters.find((f) => f.id === 'pmax')

    if (existingMinPriceFilter || existingMaxPriceFilter) {
      const min = +get(existingMinPriceFilter, 'values.0')
      const max = +get(existingMaxPriceFilter, 'values.0')
      if (min !== null && max !== null) {
        _inputPriceRange = { min, max }
        _sliderPriceRange = { min, max }
      }
    }

    // set price range limits from price options
    if (refinement?.options) {
      const [min, max] = refinement.options
      if (min !== null && max !== null) {
        setPriceRangeLimit({ min, max })
        // set price ranges as default if no price range is defined
        if (_inputPriceRange === undefined) {
          _inputPriceRange = { min, max }
        } else {
          _inputPriceRange = {
            min: clamp(_inputPriceRange.min, min, max),
            max: clamp(_inputPriceRange.max, min, max),
          }
        }
        if (_sliderPriceRange === undefined) {
          _sliderPriceRange = { min, max }
        } else {
          _sliderPriceRange = {
            min: clamp(_sliderPriceRange.min, min, max),
            max: clamp(_sliderPriceRange.max, min, max),
          }
        }
      } else {
        // no products
        _inputPriceRange = { min: 0, max: 0 }
        _sliderPriceRange = { min: 0, max: 0 }
      }
    }

    if (_inputPriceRange && _sliderPriceRange) {
      setInputPriceRange(_inputPriceRange)
      setSliderPriceRange(_sliderPriceRange)
    }
  }, [refinement, filters])

  useEffect(() => {
    if (!priceFilterOption) return

    debouncedFilterChange({
      optionRefValue: priceFilterOption,
      refinement,
      eventLocation: priceFilterLocation,
    })
  }, [priceFilterOption])

  function handlePriceFilterChange({ min, max }, actionLocation) {
    // check if new values are the same as the current filter values
    const existingMinPriceFilter = filters.find((f) => f.id === 'pmin')
    const existingMaxPriceFilter = filters.find((f) => f.id === 'pmax')

    if (existingMinPriceFilter && existingMaxPriceFilter) {
      if (
        min === +get(existingMinPriceFilter, 'values.0') &&
        max === +get(existingMaxPriceFilter, 'values.0')
      ) {
        return
      }
    }
    setPriceFilterLocation(actionLocation)
    setPriceFilterOption(`${min}-${max}`)
  }

  function convertStringToInt(val) {
    const parsed = parseInt(val)
    return isNaN(parsed) ? null : parsed
  }

  function getClampedPrice(val) {
    const parsed = convertStringToInt(val)
    return parsed === null ? null : clamp(parsed, priceRangeLimit.min, priceRangeLimit.max)
  }

  function handleMinPriceChange(val) {
    debouncedFilterChange?.cancel()
    const price = convertStringToInt(val)
    setInputPriceRange({ min: price ?? '', max: inputPriceRange.max })
  }

  function handleMaxPriceChange(val) {
    debouncedFilterChange?.cancel()
    const price = convertStringToInt(val)
    setInputPriceRange({ min: inputPriceRange.min, max: price ?? '' })
  }

  function round(number, increment, offset) {
    const roundedValue = Math.round((number - offset) / increment) * increment + offset
    if (roundedValue === offset) {
      return Math.ceil((number - offset) / increment) * increment + offset
    }
    return roundedValue
  }

  function handleMinPriceBlur(val) {
    let price = getClampedPrice(val)
    let { max } = inputPriceRange
    if (price && price >= max) {
      price = max - stepValue
    } else if (stepValue) {
      price = round(price, stepValue, inputPriceRange.max)
      if (price === inputPriceRange.max) {
        price -= stepValue
      }
    }
    if (price && price >= priceRangeLimit.max) {
      max = priceRangeLimit.max
      price = max - stepValue
    }
    const prices = { min: price ?? priceRangeLimit.min, max }
    setInputPriceRange(prices)
    setSliderPriceRange(prices)
    handlePriceFilterChange(prices, PRICE_ACTION_LOCATION_NAMES.priceInputBox)
  }

  function handleMaxPriceBlur(val) {
    let price = getClampedPrice(val)
    if (price && price <= inputPriceRange.min) {
      price = inputPriceRange?.min + stepValue
    } else if (stepValue) {
      price = round(price, stepValue, inputPriceRange.min)
      if (price === inputPriceRange.min) {
        price += stepValue
      }
    }
    const prices = { min: inputPriceRange.min, max: price ?? priceRangeLimit.max }
    setSliderPriceRange(prices)
    setInputPriceRange(prices)
    handlePriceFilterChange(prices, PRICE_ACTION_LOCATION_NAMES.priceInputBox)
  }

  function handlePriceSliderChange(values) {
    if (!isNaN(values[0]) && !isNaN(values[1])) {
      debouncedFilterChange?.cancel()
      setInputPriceRange({ min: values[0], max: values[1] })
      setSliderPriceRange({ min: values[0], max: values[1] })
    }
  }

  function handlePriceSliderEnd(values) {
    if (!isNaN(values[0]) && !isNaN(values[1])) {
      const prices = { min: values[0], max: values[1] }
      setInputPriceRange(prices)
      setSliderPriceRange(prices)
      handlePriceFilterChange(prices, PRICE_ACTION_LOCATION_NAMES.priceSlider)
    }
  }

  return (
    <Box sx={styles.filterPriceWrapper} data-qa="plpfltr_rdobtn_fltr_price">
      <Flex sx={styles.filterPriceFieldsWrapper}>
        <FilterPriceField
          isMinPrice
          label={formatMessage({ id: 'plp.filterPrice.minPriceLabel' })}
          value={inputPriceRange.min}
          onChange={handleMinPriceChange}
          onBlur={handleMinPriceBlur}
          onSubmit={handleMinPriceBlur}
          currency={currencySymbol}
          currencySymbolAfterPrice={currencySymbolAfterPrice}
          variant={variant}
        />
        {isCompletePlpV3Desktop ? (
          <Box sx={styles.filterPriceSeparator} />
        ) : (
          <Text sx={styles.filterText} size="md" variant="eyebrow-primary">
            {formatMessage({ id: 'plp.filterPrice.to' })}
          </Text>
        )}
        <FilterPriceField
          label={formatMessage({ id: 'plp.filterPrice.maxPriceLabel' })}
          value={inputPriceRange.max}
          onChange={handleMaxPriceChange}
          onBlur={handleMaxPriceBlur}
          onSubmit={handleMaxPriceBlur}
          currency={currencySymbol}
          currencySymbolAfterPrice={currencySymbolAfterPrice}
          variant={variant}
        />
      </Flex>
      <RangeSlider
        values={[sliderPriceRange.min, sliderPriceRange.max]}
        limits={[priceRangeLimit.min, priceRangeLimit.max]}
        inputValues={[inputPriceRange.min, inputPriceRange.max]}
        onChange={handlePriceSliderChange}
        onEnd={handlePriceSliderEnd}
        zIndexValues={zIndexValues}
      />
    </Box>
  )
}

export default withFilterControl(memo(FilterPrice))
