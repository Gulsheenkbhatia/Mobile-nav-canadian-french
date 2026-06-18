import { useEffect, useRef, useState, useCallback } from 'react'
import useOutsideClick from 'toro/hooks/useOutsideClick'
import Box from 'toro/components/Box'
import useViewportType from 'toro/hooks/useViewportType'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import { isSizeGuidePopUpOpenAtom } from 'store/pdp.atom'
import { useAtomValue } from 'jotai/utils'
import { observe, useInView } from 'react-intersection-observer'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'

function StickyContainer({
  children,
  isFlyoutOpen,
  setFlyoutOpen,
  isBundleProduct,
  isStickyAddToCartBelowTheFoldEnabled,
  isStickyAddToBagUponLandEnabled,
  stickyAddToCartPriceEnabled,
  variant,
  isPlp = false,
  ...props
}) {
  const isSizeGuidePopUpOpen = useAtomValue(isSizeGuidePopUpOpenAtom)
  const styles = useMultiStyleConfig('StickyContainer', { variant })
  const containerRef = useRef(null)
  const [isStickyCTAVisible, setIsStickyCTAVisible] = useState(false)
  const [isATCbuttonVisible, setIsATCbuttonVisible] = useState(false)
  const [isFooterVisible, setIsFooterVisible] = useState(false)
  const [isAccessorizeItVisible, setIsAccessorizeItVisible] = useState(false)
  const [isPortraitMode, setPortraitMode] = useState(false)
  const { isDesktop, isMobile } = useViewportType()
  const isMobilePortraitMode = isMobile && isPortraitMode

  const onChange = useCallback(
    (inView, entry) => {
      setIsATCbuttonVisible(inView)
      if (!isMobilePortraitMode && !isDesktop) {
        return
      }
      // When PDP has almost no cotent between product information and footer,
      // sticky ATC should be hidden
      if (isFooterVisible || isAccessorizeItVisible) {
        setIsStickyCTAVisible(false)
        return
      }
      if (isStickyAddToCartBelowTheFoldEnabled && !isStickyAddToBagUponLandEnabled) {
        if (window.scrollY <= entry.boundingClientRect.top) {
          setIsStickyCTAVisible(false)
          return
        }
      }
      setIsStickyCTAVisible(!inView)
    },
    [isMobilePortraitMode, isATCbuttonVisible, isFooterVisible, isAccessorizeItVisible]
  )

  const onChangeFooter = useCallback(
    (inView, entry) => {
      setIsFooterVisible(inView)
      if (window.scrollY <= entry.boundingClientRect.top) {
        return
      }
      // When PDP has almost no cotent between product information and footer,
      // sticky ATC should be hidden
      if (isATCbuttonVisible) {
        setIsStickyCTAVisible(false)
        return
      }
      setIsStickyCTAVisible(!inView)
    },
    [isFooterVisible, isATCbuttonVisible]
  )

  const onChangeAccessorizeIt = useCallback(
    (inView, entry) => {
      setIsAccessorizeItVisible(inView)
      if (window.scrollY <= entry.boundingClientRect.top) {
        return
      }
      // When AccessorizeIt is visible, sticky ATC should be hidden
      if (inView) {
        setIsStickyCTAVisible(false)
        return
      }
      setIsStickyCTAVisible(!inView)
    },
    [isAccessorizeItVisible]
  )

  useEffect(() => {
    //orientation check
    const portraitOrientation = matchMedia('(orientation: portrait)')
    setPortraitMode(portraitOrientation.matches)
    if (!isMobilePortraitMode && !isDesktop) {
      return
    }
    //observers and listeners register if it's suitable device and orientation
    const bundleButtonElement = document.querySelector('.bundleProductBtn')
    const accessorizeItElement = document.querySelector('#accessorize-it-container')
    const destroyFooterObserver = observe(
      document.querySelector('.footerContainer'),
      onChangeFooter
    )
    let destroyBundleButtonObserver = null
    let destroyAccessorizeItObserver = null
    portraitOrientation.addEventListener('change', setPortraitMode)
    if (bundleButtonElement) {
      destroyBundleButtonObserver = observe(bundleButtonElement, onChange)
    }
    if (accessorizeItElement) {
      destroyAccessorizeItObserver = observe(accessorizeItElement, onChangeAccessorizeIt)
    }

    return () => {
      destroyFooterObserver?.()
      destroyBundleButtonObserver?.()
      destroyAccessorizeItObserver?.()
      portraitOrientation.removeEventListener('change', setPortraitMode)
    }
  }, [isPortraitMode, isATCbuttonVisible, isFooterVisible, isAccessorizeItVisible])

  useEffect(() => {
    const chatButton = document?.querySelector(
      '.embeddedServiceHelpButton .helpButton .helpButtonEnabled'
    )
    const backToTop = document?.querySelector('#backToTopBtn')

    if (chatButton) {
      document?.body?.classList?.toggle('chat-stickyVisible', isStickyCTAVisible)
    }
    if (backToTop) {
      document?.body?.classList?.toggle('backtotop-stickyVisible', isStickyCTAVisible)
    }
  }, [isStickyCTAVisible])

  const { ref: outerContainerRef } = useInView({
    skip: !isMobilePortraitMode && !isDesktop,
    onChange,
  })

  useOutsideClick({
    ref: containerRef,
    enabled: !isSizeGuidePopUpOpen,
    handler: (e) => {
      if (isFlyoutOpen) {
        setFlyoutOpen(false)
        e.preventDefault()
      }
    },
  })

  const overlayStylingProps =
    isFlyoutOpen && (isStickyCTAVisible || isPlp || isBundleProduct)
      ? styles.overlayContainer
      : styles.overlayContainerHidden

  const stickyContainerStylingProps =
    isStickyCTAVisible || isPlp || (isBundleProduct && isFlyoutOpen)
      ? styles.stickyContainer(stickyAddToCartPriceEnabled, isFlyoutOpen)
      : {
          display: 'none',
        }

  return (
    <Box {...props} data-qa="pdp_sticky-container" ref={outerContainerRef}>
      <Box {...overlayStylingProps} id="drawer-bottom">
        <Box
          data-qa="m_pdp_section_variant_drawer"
          ref={containerRef}
          id="pdp-sticky-container"
          sx={stickyContainerStylingProps}
        >
          {children}
        </Box>
      </Box>
    </Box>
  )
}

export default withErrorBoundaryWrapper(StickyContainer)
