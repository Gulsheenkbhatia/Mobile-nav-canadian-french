import React, { useState, useRef, useCallback, useMemo } from 'react'
import { useIntl } from 'react-intl'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import Box from 'toro/components/Box'
import Popover from 'toro/components/Popover'
import PopoverBody from 'toro/components/PopoverBody'
import PopoverContent from 'toro/components/PopoverContent'
import PopoverTrigger from 'toro/components/PopoverTrigger'
import Text from 'toro/components/Text'
import CountrySelectorDropdownList from 'toro/components/LanguageSelector/ModalBasedCountrySelector/CountrySelectorDropdownList'
import getKeyboardHandler from 'helpers/getKeyboardHandler'
import { ChevronBoldUpIcon, ChevronBoldDownIcon } from 'toro/icons'
import { CountryItem, CountrySelectorDropdownProps } from 'toro/components/LanguageSelector/types'

const CountrySelectorDropdown: React.FC<CountrySelectorDropdownProps> = ({
  countryList,
  selectedCountry,
  setSelectedCountry,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const { selectInputLabel, selectInput, dropdownContentWrap } = useMultiStyleConfig(
    'LanguageSelector',
    { variant: 'modalBased' }
  )
  const { formatMessage } = useIntl()
  const DropdownIcon = useMemo(() => (isOpen ? ChevronBoldUpIcon : ChevronBoldDownIcon), [isOpen])

  const handleCountrySelect = useCallback(
    (country: CountryItem) => {
      setSelectedCountry(country)
      setIsOpen(false)
    },
    [setSelectedCountry]
  )

  const handlePopoverClose = () => setIsOpen(false)

  const handlePopoverKeyDown = getKeyboardHandler(['Escape'], (e: React.KeyboardEvent) => {
    e.stopPropagation()
    handlePopoverClose()
  })

  return (
    <Box position="relative" width="100%">
      <Popover
        isLazy
        placement="bottom-start"
        matchWidth
        isOpen={isOpen}
        initialFocusRef={inputRef}
        returnFocusOnClose={true}
        onOpen={() => setIsOpen(true)}
        onClose={handlePopoverClose}
        closeOnBlur={true}
        offset={[0, 30]}
      >
        <Box>
          <Text as="label" sx={selectInputLabel} id="country-selector-label">
            {formatMessage({
              id: 'header.languageSelector.chooseNewLocation',
              defaultMessage: 'Choose a new location',
            })}
          </Text>
          <PopoverTrigger>
            <Box
              as="button"
              sx={selectInput}
              tabIndex={0}
              aria-expanded={isOpen}
              aria-labelledby="country-selector-label"
            >
              <Text aria-live="polite" className="selected-country-label">
                {selectedCountry?.label ||
                  formatMessage({
                    id: 'header.languageSelector.defaultSelectCountryMessage',
                    defaultMessage: 'Select a country',
                  })}
              </Text>
              <Box as="span">
                <DropdownIcon width="18" height="18" />
              </Box>
            </Box>
          </PopoverTrigger>
        </Box>
        <PopoverContent onKeyDown={handlePopoverKeyDown} sx={dropdownContentWrap}>
          <PopoverBody p={0}>
            <CountrySelectorDropdownList
              ref={inputRef}
              list={countryList}
              selectedFlag={selectedCountry?.flag}
              onSelection={handleCountrySelect}
            />
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Box>
  )
}

export default CountrySelectorDropdown
