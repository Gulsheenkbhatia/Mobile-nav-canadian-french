import { useCallback, useContext, useEffect, useRef, useState, memo, useMemo } from 'react'
import { useIntl } from 'react-intl'
import dynamic from 'next/dynamic'
import get from 'lodash/get'
import Headroom from 'react-headroom'
import useViewportType from 'toro/hooks/useViewportType'
import Box from 'toro/components/Box'
import HeaderMainContent from 'toro/components/header/HeaderMainContent'
import usePreference from 'toro/hooks/usePreference_new'
import { useRouter } from 'next/router'
import MainContainer from 'toro/components/MainContainer'
import PromoBanner from 'toro/components/header/PromoBanner'
import ContentSlot from 'toro/cms/components/ContentSlot'
import useGlobalSlotAtomData from 'hooks/useGlobalSlotAtomData'
import EStockroomBanner from 'toro/components/header/EStockroomBanner'
import DesktopNavigation from 'toro/components/header/DesktopNavigation'
import useVerticalScrollDirection from 'toro/hooks/useVerticalScrollDirection'
import HeaderTabs from 'toro/components/header/Tabs'
import PWAContext from 'components/common/PWAContext'
import useToast from 'toro/hooks/useToast'
import Cookies from 'js-cookie'
import ThreadUpModal from 'toro/components/thredUp/ThreadUpModal'
import usePageType from 'toro/hooks/usePageType'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import {
  bannerHeightAtom,
  isHeaderHeightAtom,
  isHeadroomActiveAtom,
  isHeaderHiddenAtom,
  setIsTransparentHeaderAtom,
  isTransparentHeaderAtom,
} from 'store/headroom.atom'
import { exposedSearchStatusAtom } from 'store/search.atom'

import {
  miniCartOpenReasonAtom,
  MiniCartOpenReasons,
  isSWOutletAtom,
  isOneCoachTabbedAtom,
} from 'store/global.atom'
import {
  isTabbedAdaptivePDPEligibleAtom,
  isTabbedAdaptiveDynamicAssetInViewportAtom,
} from 'store/pdp.atom'

import MiniCartPopoverContainer from 'toro/components/header/MiniCart/MiniCartPopover.container'
import useHeaderPositionPref from 'toro/hooks/useHeaderPositionPref'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import useExperiment from 'toro/hooks/useExperiment'
import { EXPERIMENTS } from 'toro/constants/experiments'
import useTemplate from 'toro/hooks/useTemplate'
import Template from 'toro/components/Template'
import { TemplateName } from 'toro/constants/templates'
import { isGoingBackAtom } from 'store/going-back.atom'

const SitePreview = dynamic(() => import('toro/components/SitePreview'), {
  ssr: false,
})

const DesktopCollapsibleRVCarouselContainer = dynamic(
  () =>
    import('toro/components/DesktopCollapsibleRVCarousel/DesktopCollapsibleRVCarouselContainer'),
  { ssr: false }
)

const unfixedStylesWhenTransparencyIsEnabled = {
  top: 0,
  left: 0,
  right: 0,
  position: 'relative',
  transition: 'all .2s',
}

const HeaderDesktop = () => {
  const { appData } = useContext(PWAContext)
  const successToast = useToast()
  const router = useRouter()
  const { isDesktop, isTablet, isMobile } = useViewportType()
  const { formatMessage } = useIntl()
  const { isProductPassport, isHP } = usePageType()
  const isSitePreviewEnabled = get(appData, 'isSitePreviewEnabled', false)

  const promoBannerData = useGlobalSlotAtomData('header-banner-m')
  const {
    isStickyHeader,
    isTransparentStickyHeader,
    isTransparentSlidingHeader,
    isStaticHeader,
    isSlidingNavHeader,
    isSlidingCarouselHeader,
  } = useHeaderPositionPref()

  const { hasTopDirectionScroll, showBanner, scrollPosition, isOnTop } =
    useVerticalScrollDirection()

  const {
    storefrontConfigs: { transparentHeader },
    generalConfiguration: { enableNewGlobalHeader, enableExposedSearchHeader },
  } = usePreference({
    'Storefront Configs': ['transparentHeader'],
    generalConfiguration: ['enableNewGlobalHeader', 'enableExposedSearchHeader'],
  })

  const wrapperRef = useRef()
  const headerRef = useRef()
  const timeoutRef = useRef()
  const bannerRef = useRef()

  const isSWOutlet = useAtomValue(isSWOutletAtom)
  const isTabbedAdaptivePDPEligible = useAtomValue(isTabbedAdaptivePDPEligibleAtom)
  const isTabbedAdaptiveDynamicAssetInViewport = useAtomValue(
    isTabbedAdaptiveDynamicAssetInViewportAtom
  )
  const isSearchStatusActive = useAtomValue(exposedSearchStatusAtom)
  const isHeadroomActive = useAtomValue(isHeadroomActiveAtom)
  const bannerHeight = useAtomValue(bannerHeightAtom)
  const isHeaderHidden = useAtomValue(isHeaderHiddenAtom)
  const setBannerHeight = useUpdateAtom(bannerHeightAtom)
  const setHeaderHeight = useUpdateAtom(isHeaderHeightAtom)
  const setIsHeaderHidden = useUpdateAtom(isHeaderHiddenAtom)
  const miniCartOpenReason = useAtomValue(miniCartOpenReasonAtom)
  const isOneCoachTabbedHeaderActive = useAtomValue(isOneCoachTabbedAtom)
  const setIsTransparentHeader = useUpdateAtom(setIsTransparentHeaderAtom)
  const isTransparentHeaderValue = useAtomValue(isTransparentHeaderAtom)
  const isGoingBack = useAtomValue(isGoingBackAtom)

  const [isClicked, setIsClicked] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isHoveredOnMiniCart, setIsHoveredOnMiniCart] = useState(false)
  const [isMiniCartRef, setIsMiniCartRef] = useState()
  const [fixed, setFixed] = useState(true)
  const [headerActualHeight, setHeaderActualHeight] = useState(0)
  const [promoBannerIsHidden] = useState(false)
  const [headerExposedSearchHeight, setHeaderExposedSearchHeight] = useState(0)
  const [transparentStickyFadeIn, setTransparentStickyFadeIn] = useState(false)
  const [isTransparentHeaderEnable, setIsTransparentHeaderEnable] = useState(transparentHeader)

  const headerData = get(appData, 'header', {})
  const siteId = get(appData, 'siteId')
  const headroomActualHeight = get(wrapperRef.current?.inner?.getBoundingClientRect(), 'height', 0)
  const brand = get(appData, 'brand')
  const isOutlet = brand === 'coach-outlet'

  const isReducedHeader = get(appData, 'isReducedHeaderAndFooter', false)
  const isTabHeaderVisible = get(appData, 'isTabHeaderVisible', false)
  const headerBannerScript = get(promoBannerData, 'scripts', [])
  const headerBannerModalContent = get(promoBannerData, 'modalContent')
  const headerBannerPopupContent = get(promoBannerData, 'popupContent')

  const isPDP = router.pathname.includes('/product')

  const isPDPv5Template = useTemplate([TemplateName.pdpv5])
  const isHeadroomDisabled = useMemo(() => {
    const isSlidingHeader =
      isSlidingNavHeader || isSlidingCarouselHeader || isTransparentSlidingHeader || !isPDP

    return isStaticHeader || isStickyHeader || !isSlidingHeader || !isHeadroomActive || isGoingBack
  }, [
    isStaticHeader,
    isStickyHeader,
    isSlidingNavHeader,
    isSlidingCarouselHeader,
    isTransparentSlidingHeader,
    isHeadroomActive,
    isPDP,
    isGoingBack,
  ])

  const variant = useMemo(() => {
    if (isPDPv5Template) {
      return 'withBackdrop'
    }

    if (isTabbedAdaptivePDPEligible) {
      return 'transparentStickyHeaderFullBleed'
    }

    if (enableNewGlobalHeader) {
      return 'globalHeaderV2'
    }

    return null
  }, [enableNewGlobalHeader, isTabbedAdaptivePDPEligible, isPDPv5Template])

  const styles = useMultiStyleConfig('HeaderPage', { variant })

  const isTransparentHeader = useMemo(() => {
    if (isTransparentSlidingHeader) {
      return true
    }
    const isTransparentHeaderOnHP = transparentHeader && isHP
    return enableNewGlobalHeader
      ? isTransparentHeaderOnHP
      : isTransparentHeaderOnHP && isTransparentHeaderEnable
  }, [
    transparentHeader,
    isHP,
    enableNewGlobalHeader,
    isTransparentHeaderEnable,
    isTransparentSlidingHeader,
  ])

  useEffect(() => {
    setIsTransparentHeader(isTransparentHeader && isOnTop)
  }, [isTransparentHeader, isOnTop])

  const [height, setHeight] = useState(isTransparentHeader ? 0 : null)

  useEffect(() => {
    if (isPDP && isTransparentStickyHeader && isHeaderHidden) {
      setIsHeaderHidden(false)
    }
  }, [isPDP, isTransparentStickyHeader, isHeaderHidden])

  useEffect(() => {
    if (isTransparentHeader) {
      setHeight(fixed ? 0 : null)
      setHeaderActualHeight(get(headerRef, 'current.clientHeight'))
    } else {
      setHeight(null)
    }
  }, [fixed, isTransparentHeader])

  useEffect(() => {
    const onScroll = () => {
      setTransparentStickyFadeIn(window.scrollY > headroomActualHeight + bannerHeight)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [headroomActualHeight, bannerHeight])

  useEffect(() => {
    const onScroll = () => {
      const { scrollY } = window
      const isScrolledAfterHeader = scrollY > bannerHeight + headerActualHeight

      if (isTransparentHeader && isClicked && isStaticHeader && isScrolledAfterHeader) {
        setIsClicked(false)
        setIsHovered(false)
      }
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [bannerHeight, isClicked, isTransparentHeader])

  const styleForUpperRows = useMemo(() => {
    return styles.styleForUpperRows({ fixed, showBanner, isProductPassport, promoBannerIsHidden })
  }, [fixed, showBanner, isProductPassport, promoBannerIsHidden])

  const handleUnpin = useCallback(() => {
    setFixed(false)
    setIsHeaderHidden(true)
  }, [])

  const handlePin = useCallback(() => {
    setIsHeaderHidden(false)
    if (isTransparentHeader) {
      setIsTransparentHeaderEnable(false)
      setIsClicked(false)
      setIsHovered(false)
    }
  }, [])

  const handleUnfix = useCallback(() => {
    setFixed(true)
    if (isTransparentHeader) setIsTransparentHeaderEnable(true)
  }, [])

  const handleHeaderClick = () => {
    setIsClicked(true)
  }

  const handleMouseEnter = () => {
    setIsTransparentHeader(false)
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsTransparentHeader(isTransparentHeader)
    setIsHovered(false)
  }

  const miniCartPopUpPosition = {
    ...styles.miniCartPopUpPosition(isDesktop, isStaticHeader),
  }

  const headerV2FadeIn = useMemo(() => {
    return hasTopDirectionScroll && (scrollPosition > headroomActualHeight || !isOnTop)
  }, [hasTopDirectionScroll, isOnTop, headroomActualHeight])

  const styleForStickyHeader = {
    ...styles.styleForStickyHeader({
      isStickyHeader: isStickyHeader || isTransparentStickyHeader,
      bannerHeight,
      hasTopDirectionScroll,
      isProductPassport,
      showBanner,
      isHeaderHidden,
      isTransparentHeader: isTransparentHeaderValue,
    }),
  }

  useEffect(() => {
    setBannerHeight(get(bannerRef, 'current.offsetHeight') + 1)
  }, [isDesktop, isTablet])

  useEffect(() => {
    setHeaderHeight(headroomActualHeight)
  }, [headroomActualHeight])

  useEffect(() => {
    const isNeedToPinHeadroom =
      (miniCartOpenReason === MiniCartOpenReasons.AddToBag ||
        miniCartOpenReason === MiniCartOpenReasons.PickUpInStore) &&
      !fixed
    if (miniCartOpenReason && isNeedToPinHeadroom && wrapperRef.current) {
      wrapperRef.current.pin()
    }
  }, [miniCartOpenReason])

  useEffect(() => {
    const verifiedBannerToastMsg = Cookies.get('cc-vst')
    if (verifiedBannerToastMsg) {
      const msgVerifiedBannerToast = formatMessage({
        id: 'header.myAccount.verifiedBannerText',
        defaultMessage: verifiedBannerToastMsg,
      })
      successToast({ description: msgVerifiedBannerToast })
      Cookies.remove('cc-vst')
    }
  }, [])

  useEffect(() => {
    if (enableExposedSearchHeader) {
      setHeaderExposedSearchHeight(get(headerRef, 'current.clientHeight') + bannerHeight)
    }
  }, [isSearchStatusActive, headerActualHeight, headroomActualHeight, enableExposedSearchHeader])

  const styleForExposedSearch = useMemo(() => {
    if (!enableExposedSearchHeader) {
      return {}
    }
    if (isSearchStatusActive) {
      return {
        ...styles.scrollableHeaderContainer,
      }
    }
    return {}
  }, [enableExposedSearchHeader, isSearchStatusActive, headerExposedSearchHeight])

  useEffect(() => {
    if (bannerRef.current) {
      const obs = new ResizeObserver((entr) => {
        setBannerHeight(get(entr, '[0].target.offsetHeight') + 1)
      })

      obs.observe(bannerRef.current)
      return () => obs.disconnect()
    }
  }, [isMobile])

  const promoBannerContainerRefSetter = useCallback(
    (node) => {
      if (node) {
        bannerRef.current = node
        setBannerHeight(get(node, 'offsetHeight'))
      }
    },
    [promoBannerIsHidden]
  )

  const showDefaultTabs = useMemo(
    () => isTabHeaderVisible,
    [isTabHeaderVisible, enableNewGlobalHeader]
  )

  const isPDPv3 = useExperiment(EXPERIMENTS.PDP_V3)
  const isTransparentStickyHeaderOnPDP =
    isTransparentStickyHeader && isPDP && (isPDPv3 || isTabbedAdaptivePDPEligible) && isMobile

  return (
    <>
      <Box
        as="header"
        sx={{
          ...styles.headerPageContainer,
          ...styleForStickyHeader,
          ...styleForExposedSearch,
          ...(isTabbedAdaptivePDPEligible &&
          isTransparentStickyHeaderOnPDP &&
          !transparentStickyFadeIn &&
          !isTabbedAdaptiveDynamicAssetInViewport
            ? styles.headerFullBleed
            : {}),
        }}
      >
        {isSitePreviewEnabled && <SitePreview />}

        <EStockroomBanner />

        <Box ref={promoBannerContainerRefSetter} sx={styleForUpperRows} id="header-banner-content">
          {!isSWOutlet && !isReducedHeader && (
            <>
              <ContentSlot content={promoBannerData} Component={PromoBanner} />
            </>
          )}

          {showDefaultTabs && <HeaderTabs />}

          {headerBannerPopupContent && (
            <Box
              dangerouslySetInnerHTML={{
                __html: headerBannerPopupContent,
              }}
            />
          )}
        </Box>

        <Box
          style={{
            minHeight:
              router?.asPath === '/' && headroomActualHeight
                ? headroomActualHeight - headerActualHeight
                : headroomActualHeight,
          }}
        >
          {isStaticHeader && (
            <MainContainer position="absolute">
              <MiniCartPopoverContainer
                timeoutRef={timeoutRef}
                triggerRef={isMiniCartRef}
                isHoveredOnMiniCart={isHoveredOnMiniCart}
                miniCartPopUpPosition={miniCartPopUpPosition}
                // countryCode={countryCode} // TO DO - Once country detection POC is done
              />
            </MainContainer>
          )}

          <Headroom
            ref={wrapperRef}
            onUnpin={handleUnpin}
            onUnfix={handleUnfix}
            onPin={handlePin}
            style={{
              height,
              zIndex: 15, // above category header and image PLP badge
              transition: 'all 150ms ease 0s',
              ...(isSearchStatusActive && !fixed ? { position: 'absolute' } : {}),
            }}
            pinStart={bannerHeight}
            disable={isHeadroomDisabled}
          >
            <MainContainer position="relative">
              {!isStaticHeader && (
                <MiniCartPopoverContainer
                  timeoutRef={timeoutRef}
                  triggerRef={isMiniCartRef}
                  isHoveredOnMiniCart={isHoveredOnMiniCart}
                  miniCartPopUpPosition={miniCartPopUpPosition}
                  // countryCode={countryCode} // TO DO - Once country detection POC is done
                />
              )}
            </MainContainer>

            <Box
              sx={{
                ...styles.headerPageInnerContainer({
                  transparentStickyFadeIn,
                  isOneCoachTabbedHeaderActive,
                }),
                ...(isTabbedAdaptiveDynamicAssetInViewport
                  ? styles.headerDynamicAssetContrast
                  : {}),
              }}
              className={`${
                isTransparentHeader && (!isClicked || isHP) && !isHovered && isOnTop
                  ? `transparentHeader ${headerV2FadeIn ? 'headerV2FadeIn' : ''}`
                  : ''
              } ${isPDPv5Template ? 'withBackdrop' : ''} headerPageInnerContainer`}
              style={isTransparentHeader ? unfixedStylesWhenTransparencyIsEnabled : {}}
              data-qa="hdr_container_section"
            >
              <Box
                ref={headerRef}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleHeaderClick}
              >
                <HeaderMainContent
                  setIsMiniCartRef={setIsMiniCartRef}
                  setIsHoveredOnMiniCart={setIsHoveredOnMiniCart}
                />

                {!isSWOutlet && !isReducedHeader && (
                  <DesktopNavigation
                    menuData={headerData.menuData}
                    flyoutContent={headerData.flyoutContent}
                    siteId={siteId}
                    isHeaderHidden={isHeaderHidden}
                    isOutlet={isOutlet}
                  />
                )}
                <Template forIDs={[TemplateName.pdpv5]}>
                  <Box className="desktop-menu-overlay" />
                </Template>
              </Box>

              <DesktopCollapsibleRVCarouselContainer
                headerHeight={headerActualHeight || headroomActualHeight}
                isHidden={isHeaderHidden || (isHP && isTransparentHeader && !isHovered && isOnTop)}
              />
            </Box>
          </Headroom>
        </Box>

        {headerBannerScript.length > 0 &&
          headerBannerScript.map((item, idx) => {
            return (
              <Box
                key={idx}
                dangerouslySetInnerHTML={{
                  __html: item,
                }}
              />
            )
          })}
      </Box>

      <Box
        dangerouslySetInnerHTML={{
          __html: headerBannerModalContent,
        }}
      />

      <ThreadUpModal />
    </>
  )
}

export default memo(HeaderDesktop)
