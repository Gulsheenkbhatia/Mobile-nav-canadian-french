import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import useTheme from 'toro/hooks/useTheme'
import Box from 'toro/components/Box'
import Flex from 'toro/components/Flex'
import Text from 'toro/components/Text'
import FiltersAccordion from 'toro/components/list/Filters/FiltersAccordion'
import useViewportType from 'toro/hooks/useViewportType'
import getKeyboardHandler from 'helpers/getKeyboardHandler'
import usePreference from 'toro/hooks/usePreference_new'
import useAnimationFrame from 'toro/hooks/useAnimationFrame'
import { useRouter } from 'next/router'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import useHeadroomAtom from 'toro/hooks/useHeadroomAtom'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import {
  refinementsIdAtom,
  setRefinementsIdAtom,
  visibleRefinementsAtom,
  expandedAccordionRefinementsAtom,
  setExpandedAccordionRefinementsAtom,
} from 'store/search-results.atom'
import useFilterToggle from 'toro/hooks/useFilterToggle'
import { useIntl } from 'react-intl'
import { ClearAllFiltersButton } from 'toro/components/list/Filters/ClearAllFiltersButton'
import { scrollToHeader } from 'toro/helpers/filters'
import { isPlpV3Atom } from 'store/plp.atom'
import { useRefinementsToRender } from 'toro/hooks/useRefinementsToRender'

const defaultExpandedRefinements = []

function Filters({ disableScroll = false, ...props }) {
  const { formatMessage } = useIntl()
  const isPlpV3 = useAtomValue(isPlpV3Atom)
  const styles = useMultiStyleConfig('Filters', { variant: isPlpV3 ? 'plpV3' : null })
  const refinementsId = useAtomValue(refinementsIdAtom)
  const setRefinementId = useUpdateAtom(setRefinementsIdAtom)
  const expandedAccordionRefinements = useAtomValue(expandedAccordionRefinementsAtom)
  const setExpandedAccordionRefinements = useUpdateAtom(setExpandedAccordionRefinementsAtom)
  const router = useRouter()
  const theme = useTheme()
  const { isMobile } = useViewportType()
  const { clearFilters } = useFilterToggle()
  const { toggleHeadroom } = useHeadroomAtom()
  const refinementsToRender = useRefinementsToRender({
    routerAsPath: router.asPath,
    routerQuery: router.query,
  })

  const [isKeyboardScrolling, setIsKeyboardScrolling] = useState(false)
  const [scrollTarget, setScrollTarget] = useState(null) // the element to scroll to
  const [expandedRefinementIndexes, setExpandedRefinementIndexes] = useState(
    expandedAccordionRefinements
  )

  const accordionRef = useRef()
  const lastFocusedRef = useRef()
  const prevExpandedIndexesRef = useRef([])
  const expandedRefinementIdsRef = useRef([refinementsId])
  const canStartKeyboardScrollRef = useRef(false)
  const scrollContainerRef = useRef() // Accordion on Desktop, Drawer body on Mobile

  const visibleRefinements = useAtomValue(visibleRefinementsAtom)

  const {
    searchRefinements: { searchRefinementScrollSize },
  } = usePreference({
    searchRefinements: ['searchRefinementScrollSize'],
  })

  const scrollSize = useMemo(() => {
    const defaultValue = 96
    const parsed = parseInt(searchRefinementScrollSize)

    return !isNaN(parsed) ? parsed : defaultValue
  }, [searchRefinementScrollSize])

  // use refs here, no states, to avoid stale renders
  const animate = (deltaTime) => {
    const visibleHeight = getVisibleHeight(scrollTarget)
    // keep scrolling for the duration of the Accordion expand
    if (scrollSize > visibleHeight) {
      const scrollDelta = scrollSize - visibleHeight
      const scrollValue = Math.ceil((scrollDelta * deltaTime) / 100)
      scrollContainerRef.current.scrollTop += scrollValue
      /*
        When the last Accordion item expands, the Accordion container scroll height will increases
        as well. However, during expanding, the scroll height can be smaller than the previously
        set 'scrollTop', so the container will only scroll to its maximum height at that point in
        time. To make sure we scroll until as much of the element is visible as we want, we have
        to let this function be called again next frame, in order to get the new height values of
        the scrolling container, after the DOM updates.
       */
    }
  }

  const startScrollAnimation = useAnimationFrame(animate, 250) // Chakra's Accordion collapse animation duration is 200ms

  useEffect(() => {
    const handleRouteChangeComplete = () => {
      // clear and collapse filters on PLP change
      expandedRefinementIdsRef.current = []
      prevExpandedIndexesRef.current = []
      setExpandedRefinementIndexes(defaultExpandedRefinements)
      setExpandedAccordionRefinements(defaultExpandedRefinements)
    }

    router.events.on('routeChangeComplete', handleRouteChangeComplete)

    return () => {
      router.events.off('routeChangeComplete', handleRouteChangeComplete)
    }
  }, [])

  useEffect(() => {
    if (scrollTarget !== null) {
      const visibleHeight = getVisibleHeight(scrollTarget)
      if (scrollSize > visibleHeight) {
        startScrollAnimation()
      }
    }
  }, [scrollSize, scrollTarget])

  useEffect(() => {
    if (!isMobile) {
      // for desktop we scroll the Accordion, the actual host of the filters
      scrollContainerRef.current = accordionRef.current
    } else {
      // for mobile we'll scroll the drawer, which is a modal
      scrollContainerRef.current = accordionRef?.current?.closest('.chakra-modal__body')
    }
  }, [isMobile])

  useEffect(() => {
    const refinementIds = []
    const refinementIndexes = []

    if (visibleRefinements) {
      for (let i = 0; i < visibleRefinements.length; i++) {
        const r = visibleRefinements[i]
        if (expandedRefinementIdsRef.current.includes(r.id)) {
          refinementIds.push(r.id)
          refinementIndexes.push(i)
        }
      }
      expandedRefinementIdsRef.current = refinementIds
      if (
        refinementIndexes.length &&
        refinementIndexes.some((idx) => !expandedRefinementIndexes.includes(idx))
      ) {
        prevExpandedIndexesRef.current = refinementIndexes
        setExpandedRefinementIndexes(refinementIndexes)
      }
    }
  }, [visibleRefinements])

  function handleClearFiltersClick() {
    isMobile
      ? scrollToHeader(toggleHeadroom)('#product-category-header')
      : scrollToHeader(toggleHeadroom)('#product-search-results')
    clearFilters()
    expandedRefinementIdsRef.current = []
    prevExpandedIndexesRef.current = []
    setExpandedRefinementIndexes(defaultExpandedRefinements)
    setExpandedAccordionRefinements(defaultExpandedRefinements)
    setRefinementId(null)
  }

  const handleHostKeyDown = getKeyboardHandler(['ArrowUp', 'ArrowDown'], () => {
    canStartKeyboardScrollRef.current = true
    setIsKeyboardScrolling(true)
  })

  const handleHostKeyUp = getKeyboardHandler(['ArrowUp', 'ArrowDown'], () => {
    canStartKeyboardScrollRef.current = false
    setIsKeyboardScrolling(false) // in case we reach the end and we're still holding down the key
    if (lastFocusedRef.current) {
      lastFocusedRef.current?.focus({ preventScroll: true })
      lastFocusedRef.current = null
    }
  })

  /**
   * For the Accordion, Chakra uses the keydown event and checks if the keys are 'Arrow up',
   * 'Arrow down', 'Home' and 'End' to handle navigation between Accordion items. This prevents
   * page scroll with the arrow keys. To make scrolling work again we have to prevent Chakra's
   * handling and blur the target element.
   * In order for the browser to allow keyboard control for scrolling, the element that can scroll
   * (the one with the scrollbar) must be focused. Therefore we blur out the active element set by
   * Chakra's keydown event and focus the Accordion element which is the scrollable one in our case.
   */
  const handleAccordionButtonKeyDown = useCallback(
    getKeyboardHandler(['ArrowUp', 'ArrowDown'], (e) => {
      e.preventDefault()
      if (accordionRef.current && document.activeElement !== accordionRef.current) {
        canStartKeyboardScrollRef.current = true
        lastFocusedRef.current = e.target
        accordionRef.current?.focus({ preventScroll: true })
      }
    }),
    []
  )

  const handleAccordionScroll = useCallback(() => {
    if (canStartKeyboardScrollRef.current && !isKeyboardScrolling) {
      setIsKeyboardScrolling(true)
    } else if (!canStartKeyboardScrollRef.current && isKeyboardScrolling) {
      setIsKeyboardScrolling(false)
    }
  }, [isKeyboardScrolling])

  function getLastExpandedIndex(currentExpandedIndexes) {
    return currentExpandedIndexes.find((i) => !prevExpandedIndexesRef.current.includes(i))
  }

  function getVisibleHeight(element) {
    const rect = element.getBoundingClientRect()
    return !isMobile ? window.innerHeight - rect.top : window.innerHeight - rect.top - 72 // 72px for the Drawer button at the bottom
  }

  const handleAccordionChange = useCallback(
    (indexes) => {
      const lastExpandedIndex = getLastExpandedIndex(indexes)
      prevExpandedIndexesRef.current = [...indexes]

      const refinementIds = []
      for (const idx of indexes) {
        refinementIds.push(visibleRefinements[idx].id)
      }
      expandedRefinementIdsRef.current = refinementIds
      setExpandedRefinementIndexes(indexes)

      if (lastExpandedIndex === undefined) {
        setScrollTarget(null)
        return
      }
      setScrollTarget(accordionRef?.current?.children[lastExpandedIndex])
    },
    [visibleRefinements]
  )

  return (
    <Box
      {...props}
      p="mar"
      height="100%"
      width="96.5%"
      direction="column"
      sx={styles.filterSection}
      onKeyUp={handleHostKeyUp}
      onKeyDown={handleHostKeyDown}
      data-qa="d_plpfltr_sctn_fltr_panel"
    >
      <Flex alignItems="center" mb={theme.space.m}>
        <Text
          size="md"
          variant="eyebrow-primary"
          textTransform="uppercase"
          sx={styles.FilterByText}
          letterSpacing={theme.letterSpacings.lg}
          data-qa="plpfltr_txt_fltrby"
        >
          {formatMessage({ id: 'plp.filters.filterBy', defaultMessage: 'Filter by' })}
        </Text>
        <ClearAllFiltersButton
          isMobile={isMobile}
          formatMessage={formatMessage}
          styles={styles.ClearAllButton}
          handleClearFiltersClick={handleClearFiltersClick}
        />
      </Flex>
      <FiltersAccordion
        styles={styles}
        isMobile={isMobile}
        accordionRef={accordionRef}
        disableScroll={disableScroll}
        refinementsToRender={refinementsToRender}
        isKeyboardScrolling={isKeyboardScrolling}
        handleAccordionChange={handleAccordionChange}
        handleAccordionScroll={handleAccordionScroll}
        expandedRefinementIndexes={expandedRefinementIndexes}
        handleAccordionButtonKeyDown={handleAccordionButtonKeyDown}
      />
    </Box>
  )
}

export default withErrorBoundaryWrapper(Filters)
