import { forwardRef, KeyboardEvent, useEffect, useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import debounce from 'lodash/debounce'
import Text from 'toro/components/Text'
import List from 'toro/components/CustomList'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import ListItem from 'toro/components/ListItem'
import Input from 'toro/components/Input'
import getKeyboardHandler from 'helpers/getKeyboardHandler'
import { CountrySelectorDropdownListProps } from 'toro/components/LanguageSelector/types'

const CountrySelectorDropdownList = forwardRef<HTMLInputElement, CountrySelectorDropdownListProps>(
  ({ list, selectedFlag, onSelection }, ref) => {
    const [searchTerm, setSearchTerm] = useState('')
    const [highlightedIndex, setHighlightedIndex] = useState(-1) // initially on search input

    const { dropdownSearchInput, dropdownContentList, dropdownContentListItem } =
      useMultiStyleConfig('LanguageSelector', { variant: 'modalBased' })

    const { formatMessage } = useIntl()

    const listRef = useRef<HTMLUListElement>(null)
    const itemsRef = useRef<HTMLLIElement[]>([])

    // on unmount clear the search
    useEffect(() => {
      return () => setSearchTerm('')
    }, [])

    useEffect(() => {
      // Reset highlighted index when search term changes
      const updateItemsRef = debounce(() => {
        if (!listRef.current) return
        itemsRef.current = Array.from(listRef.current.querySelectorAll('li'))
      }, 300)

      setHighlightedIndex(-1) // immediate focus on search input
      updateItemsRef()

      return () => {
        updateItemsRef.cancel()
      }
    }, [searchTerm])

    // for accessibility, the dropdown should scroll smoothly
    useEffect(() => {
      if (highlightedIndex >= 0) {
        const currentIndexed = itemsRef.current[highlightedIndex]
        if (currentIndexed) {
          currentIndexed.scrollIntoView({ block: 'nearest', inline: 'start' })
        }
      }
    }, [highlightedIndex])

    const filteredList = useMemo(() => {
      const trimmedSearch = searchTerm.trim().toLocaleLowerCase()
      return trimmedSearch !== ''
        ? list.filter(({ label }) => label.toLowerCase().includes(trimmedSearch))
        : list
    }, [searchTerm, list])

    const handleInputKeyDown = getKeyboardHandler(
      ['ArrowDown', 'ArrowUp', 'Enter', 'Escape'],
      (evt: KeyboardEvent<HTMLInputElement>) => {
        const listLength = filteredList.length
        const lastIndex = listLength - 1

        if (listLength === 0) return

        switch (evt.key) {
          case 'ArrowDown':
            evt.preventDefault()
            setHighlightedIndex((prev) => (prev < lastIndex ? prev + 1 : 0))
            break
          case 'ArrowUp':
            evt.preventDefault()
            setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : lastIndex))
            break
          case 'Enter':
            if (highlightedIndex >= 0) {
              onSelection(filteredList[highlightedIndex])
            }
            break
          case 'Escape':
            setHighlightedIndex(-1)
            break
        }
      }
    )

    return (
      <>
        <Input
          ref={ref}
          size="md"
          role="combobox"
          value={searchTerm}
          placeholder={formatMessage({
            id: 'header.languageSelector.searchForCountryPlaceholder',
            defaultMessage: 'Search for country...',
          })}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleInputKeyDown}
          sx={dropdownSearchInput}
          aria-expanded="true"
          aria-autocomplete="list"
          aria-controls="country-list"
          aria-activedescendant={
            highlightedIndex >= 0
              ? `country-opt-${filteredList[highlightedIndex]?.flag}`
              : undefined
          }
        />
        <List ref={listRef} id="country-list" role="listbox" sx={dropdownContentList} tabIndex={-1}>
          {filteredList.map((country, index) => (
            <ListItem
              key={country.flag}
              id={`country-opt-${country.flag}`}
              sx={dropdownContentListItem}
              tabIndex={-1}
              role="option"
              data-state={selectedFlag === country.flag ? 'checked' : 'unchecked'} // as per chakra attribute
              {...(highlightedIndex === index && { 'aria-selected': 'true' })}
              onClick={() => onSelection(country)}
            >
              <Text>{country.label}</Text>
            </ListItem>
          ))}
          {!filteredList.length && (
            <ListItem role="option" tabIndex={-1} sx={dropdownContentListItem}>
              <Text align="center">
                {formatMessage({
                  id: 'header.languageSelector.noCountryFoundInList',
                  defaultMessage: 'No Country Data Available',
                })}
              </Text>
            </ListItem>
          )}
        </List>
      </>
    )
  }
)

export default CountrySelectorDropdownList
