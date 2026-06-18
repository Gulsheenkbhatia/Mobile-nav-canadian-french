import React, { memo, useCallback, useMemo, useRef, useState } from 'react'
import Tag from 'toro/components/Tag'
import withFilterControl from 'toro/components/list/Filters/withFilterControl'
import Button from 'toro/components/Button'
import Box from 'toro/components/Box'
import useViewportType from 'toro/hooks/useViewportType'
import Flex from 'toro/components/Flex'
import getKeyboardHandler from 'helpers/getKeyboardHandler'
import { useIntl } from 'react-intl'
import useHeadroomAtom from 'toro/hooks/useHeadroomAtom'
import { scrollToHeader } from 'toro/helpers/filters'
import useGetCurrencyOptions from 'toro/hooks/useGetCurrencyOptions'
import { useAtomValue } from 'jotai/utils'
import { activeFiltersAtom } from 'store/search-results.atom'
import {
  getActiveFiltersQAAttributes,
  getFilterDisplayName,
} from 'toro/helpers/activeFiltersHelper'
import dynamic from 'next/dynamic'
import ScrollableContent from 'toro/components/ScrollableContent'
import { isPlpV3Atom } from 'store/plp.atom'
const CloseIcon = dynamic(() => import('toro/icons/header-icons').then((m) => m.Close))

const eventLocation = 'filter bar'

const ActiveFiltersV2 = ({ handleFilterChange, clearFilters, styles }) => {
  const { toggleHeadroom } = useHeadroomAtom()
  const [isKeyboardScrolling, setIsKeyboardScrolling] = useState(false)
  const canStartKeyboardScrollRef = useRef(false)
  const { isDesktop } = useViewportType()
  const { formatMessage } = useIntl()
  const getCurrencyOptions = useGetCurrencyOptions()
  const currencyOptions = getCurrencyOptions()
  const activeFilters = useAtomValue(activeFiltersAtom)
  const isPlpV3 = useAtomValue(isPlpV3Atom)

  function handleMobileClearClick() {
    scrollToHeader(toggleHeadroom)('#product-category-header')
    clearFilters({ eventLocation })
  }

  const handleHostKeyDown = getKeyboardHandler(['ArrowLeft', 'ArrowRight'], () => {
    canStartKeyboardScrollRef.current = true
    setIsKeyboardScrolling(true)
  })

  const handleHostKeyUp = getKeyboardHandler(['ArrowLeft', 'ArrowRight'], () => {
    canStartKeyboardScrollRef.current = false
    setIsKeyboardScrolling(false) // in case we reach the end and we're still holding down the key
  })

  const handleFilterChangeWithLocation = useCallback(
    (props) => handleFilterChange({ eventLocation, ...props }),
    [handleFilterChange]
  )

  const dataQa = useMemo(() => getActiveFiltersQAAttributes(isDesktop ? 'd' : 'm'), [isDesktop])

  return (
    <Flex alignItems="center" justify="space-between" minHeight="12px">
      {!!activeFilters?.length && (
        <>
          <ScrollableContent
            mr="s"
            wrapperClassNames={
              isDesktop
                ? `custom-scrollbar-x ${isKeyboardScrolling ? 'is-keyboard-scrolling ' : ''}`
                : ''
            }
            wrapperStyles={styles.activeFilters}
            fadeColor={isPlpV3 ? '#F0F0F0' : '#fff'}
            onKeyUp={handleHostKeyUp}
            onKeyDown={handleHostKeyDown}
          >
            {activeFilters.map((activeFilter) => (
              <Tag
                key={activeFilter.refvalue}
                variant={isPlpV3 ? 'tagV3' : 'tagV2'}
                text={getFilterDisplayName(activeFilter, currencyOptions, formatMessage)}
                data={activeFilter}
                sx={styles.activeFiltersStyles}
                data-qa="m_plpfltr_link_aplyd_fltr_label"
                dataQa={dataQa}
                handleFilterChange={handleFilterChangeWithLocation}
                iconComponent={
                  <Box ml="3px">
                    <CloseIcon height="12px" width="12px" />
                  </Box>
                }
              />
            ))}
          </ScrollableContent>
          {!isDesktop && !isPlpV3 && activeFilters.length >= 1 && (
            <Button
              onClick={handleMobileClearClick}
              variant="plain"
              size="sm"
              data-qa={dataQa.appliedFilterClearAll}
              sx={styles.clearAllStyles}
            >
              {formatMessage({ id: 'plp.activeFilters.clearAll' })}
            </Button>
          )}
        </>
      )}
    </Flex>
  )
}

export default withFilterControl(memo(ActiveFiltersV2))
