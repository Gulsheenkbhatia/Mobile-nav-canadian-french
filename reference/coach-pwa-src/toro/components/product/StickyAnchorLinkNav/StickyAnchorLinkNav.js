import React, { Fragment, useState, useEffect, useCallback, useRef, useMemo } from 'react'
import Flex from 'toro/components/Flex'
import Box from 'toro/components/Box'
import throttle from 'lodash/throttle'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import useViewportType from 'toro/hooks/useViewportType'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import {
  getCurrentActiveElement,
  scrollNavLinkIntoView,
  scrollInto,
} from './StickyAnchorLinkHelper'
import PropTypes from 'prop-types'
import useVerticalScrollDirection from 'toro/hooks/useVerticalScrollDirection'
import useHeadroomAtom from 'toro/hooks/useHeadroomAtom'
import useHeaderPositionPref from 'toro/hooks/useHeaderPositionPref'
import useAnalytics from 'toro/analytics/useAnalytics'

const StickyAnchorLinkNav = ({
  navlinks,
  productId,
  domSettleTime = 3000,
  changeDetectionDelay = 125,
  scrollThrottle = 50,
  headroom = 120,
}) => {
  const styles = useMultiStyleConfig('StickyAnchorStyling')
  const { isMobile } = useViewportType()
  const [activeNav, setActiveNav] = useState(0)
  const [isNavClicked, setNavClicked] = useState(true)
  const horizontalScrollContainer = useRef()
  const loopRef = useRef(0)
  const filteredNavlinks = useMemo(() => navlinks?.filter(({ isEnable }) => isEnable), [navlinks])
  const scrollDependencies = [activeNav, isNavClicked, navlinks]
  const { isStickyHeader, isTransparentStickyHeader } = useHeaderPositionPref()
  const analytics = useAnalytics()

  const onScroll = useCallback(
    throttle(() => {
      if (window.scrollY === 0 && activeNav !== 0 && !!navlinks.length) {
        setNavClicked(false)
        setActiveNav(0)
        return
      }
      window.requestAnimationFrame(() => {
        const activeScrollElementIndex = getCurrentActiveElement(filteredNavlinks, headroom)
        if (activeScrollElementIndex > -1) {
          setActiveNav(activeScrollElementIndex)
        }
      })
    }, scrollThrottle),
    scrollDependencies
  )

  useEffect(() => scrollNavLinkIntoView(horizontalScrollContainer.current, activeNav), [activeNav])

  useEffect(() => {
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, scrollDependencies)

  useEffect(() => clearInterval(loopRef.current), [])

  const scanForDomChanges = (anchorElement) => {
    clearInterval(loopRef.current)
    const timestamp = Date.now()
    let last = { offset: anchorElement.offsetTop, timestamp }
    const newLoop = setInterval(() => {
      const now = Date.now()
      if (now - timestamp > domSettleTime) {
        clearInterval(loopRef.current)
      } else if (last.offset !== anchorElement.offsetTop) {
        scrollInto(anchorElement, headroom)
        last.timestamp = now
        last.offset = anchorElement.offsetTop
      }
    }, changeDetectionDelay)
    loopRef.current = newLoop
  }

  const onNavClick = (e, index, elementId) => {
    const anchorElement = document.getElementById(elementId)
    if (anchorElement) {
      scrollInto(anchorElement, headroom)
      scanForDomChanges(anchorElement)
    }
    if (index === activeNav) {
      scrollNavLinkIntoView(horizontalScrollContainer.current, index)
    }
    analytics.send('productInteraction', {
      eventLocation: 'product',
      eventAction: `sticky anchor nav click:${e?.target?.textContent?.toLowerCase()}`,
      eventLabel: productId,
    })
  }
  const { hasTopDirectionScroll, showBanner } = useVerticalScrollDirection()
  const { bannerHeight, isHeaderHeight } = useHeadroomAtom()

  const stickyNavContainerStyles = useMemo(
    () =>
      styles.stickyAnchorLinkNavContainer({
        hasTopDirectionScroll,
        showBanner,
        bannerHeight,
        isHeaderHeight,
        isStickyHeader: isStickyHeader || isTransparentStickyHeader,
      }),
    [
      hasTopDirectionScroll,
      showBanner,
      bannerHeight,
      isHeaderHeight,
      isStickyHeader,
      isTransparentStickyHeader,
    ]
  )
  return (
    isMobile && (
      <Flex
        data-testid="sticky-main-container"
        role="tablist"
        ref={horizontalScrollContainer}
        sx={stickyNavContainerStyles}
      >
        {filteredNavlinks.map(({ elementId, title }, i) => {
          const isActive = activeNav === i
          const id = `sticky-nav-${elementId}`
          return (
            <Fragment key={id}>
              <Box sx={styles.stickyAnchorLinkNavDecor} />
              <Box
                data-testid="nav-elements"
                role="tab"
                id={id}
                aria-selected={isActive ? 'true' : 'false'}
                onClick={(e) => {
                  setNavClicked(true)
                  onNavClick(e, i, elementId)
                }}
                sx={styles.stickyAnchorLinkNavItems({ isActive })}
              >
                {title}
              </Box>
            </Fragment>
          )
        })}
      </Flex>
    )
  )
}

StickyAnchorLinkNav.propTypes = {
  navlinks: PropTypes.array,
}
StickyAnchorLinkNav.defaultProps = {
  navlinks: [],
}

export default withErrorBoundaryWrapper(StickyAnchorLinkNav)
