import { memo, useMemo, useRef, useState } from 'react'
import { useAtomValue } from 'jotai/utils'
import { useIntl } from 'react-intl'
import Tag from 'toro/components/Tag'
import Button from 'toro/components/Button'
import useViewportType from 'toro/hooks/useViewportType'
import Flex from 'toro/components/Flex'
import withFilterControl from 'toro/components/list/Filters/withFilterControl'
import getKeyboardHandler from 'helpers/getKeyboardHandler'
import useGetCurrencyOptions from 'toro/hooks/useGetCurrencyOptions'
import { scrollToHeader } from 'toro/helpers/filters'
import useHeadroomAtom from 'toro/hooks/useHeadroomAtom'
import { activeFiltersAtom } from 'store/search-results.atom'
import {
  getFilterDisplayName,
  getActiveFiltersQAAttributes,
} from 'toro/helpers/activeFiltersHelper'
import { isPlpV3Atom } from 'store/plp.atom'
import Box from 'toro/components/Box'
import { Close as CloseIcon } from 'toro/icons/header-icons'

function ActiveFilters({
  handleFilterChange,
  clearFilters,
  styles,
  showClearAll = false,
  ...props
}) {
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
    clearFilters()
  }

  function handleHostScroll() {
    if (canStartKeyboardScrollRef.current && !isKeyboardScrolling) {
      setIsKeyboardScrolling(true)
    } else if (!canStartKeyboardScrollRef.current && isKeyboardScrolling) {
      setIsKeyboardScrolling(false)
    }
  }

  const handleHostKeyDown = getKeyboardHandler(['ArrowLeft', 'ArrowRight'], () => {
    canStartKeyboardScrollRef.current = true
    setIsKeyboardScrolling(true)
  })

  const handleHostKeyUp = getKeyboardHandler(['ArrowLeft', 'ArrowRight'], () => {
    canStartKeyboardScrollRef.current = false
    setIsKeyboardScrolling(false)
  })

  const dataQa = useMemo(() => getActiveFiltersQAAttributes(isDesktop ? 'd' : 'm'), [isDesktop])
  return (
    <Flex
      alignItems="center"
      pb="m"
      whiteSpace="nowrap"
      className={
        isDesktop ? `custom-scrollbar-x ${isKeyboardScrolling ? 'is-keyboard-scrolling' : ''}` : ''
      }
      overflowX={!isDesktop ? 'auto' : activeFilters.length >= 5 ? null : 'hidden'}
      onKeyUp={handleHostKeyUp}
      onKeyDown={handleHostKeyDown}
      onScroll={handleHostScroll}
      {...props}
      data-qa={dataQa.appliedFilterSection}
      sx={styles?.activeFiltersWrapper}
    >
      {!isDesktop && activeFilters.length > 1 && (
        <Button
          onClick={handleMobileClearClick}
          variant="plain"
          size="sm"
          mr="m"
          data-qa={dataQa.appliedFilterClearAll}
          sx={styles?.clearAllStyles}
        >
          {formatMessage({ id: 'plp.activeFilters.clearAll' })}
        </Button>
      )}
      {activeFilters.map((activeFilter) => (
        <Tag
          key={activeFilter.refvalue}
          text={getFilterDisplayName(activeFilter, currencyOptions, formatMessage)}
          data={activeFilter}
          sx={styles.activeFiltersStyles}
          data-qa="m_plpfltr_link_aplyd_fltr_label"
          handleFilterChange={handleFilterChange}
          iconComponent={
            isPlpV3 ? (
              <Box ml="3px">
                <CloseIcon height="19px" width="19px" strokeWidth="0.5" />
              </Box>
            ) : null
          }
          dataQa={dataQa}
          variant={isPlpV3 ? 'tagV3' : undefined}
        />
      ))}
      {showClearAll && activeFilters.length > 0 && (
        <Button
          onClick={handleMobileClearClick}
          variant="plain"
          size="sm"
          mr="m"
          data-qa={dataQa.appliedFilterClearAll}
          sx={styles?.clearAllStyles}
        >
          {formatMessage({ id: 'plp.activeFilters.clearAll' })}
        </Button>
      )}
    </Flex>
  )
}

export default memo(withFilterControl(ActiveFilters))
