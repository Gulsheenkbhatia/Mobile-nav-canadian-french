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
import PromoBanner from 'toro/components/header/PromoBanner'
import ContentSlot from 'toro/cms/components/ContentSlot'
import useGlobalSlotAtomData from 'hooks/useGlobalSlotAtomData'
import EStockroomBanner from 'toro/components/header/EStockroomBanner'
import useVerticalScrollDirection from 'toro/hooks/useVerticalScrollDirection'
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
import withFeatureFlag from 'toro/hocs/withFeatureFlag'
import {
  miniCartOpenReasonAtom,
  MiniCartOpenReasons,
  isSWOutletAtom,
  isOneCoachTabbedAtom,
  hslColorAdaptivePDPAtom,
  isHeaderMountedAtom,
} from 'store/global.atom'
import {
  isTabbedAdaptivePDPEligibleAtom,
  isTabbedAdaptiveDynamicAssetInViewportAtom,
} from 'store/pdp.atom'
import { PARALLAX_THRESHOLD } from 'toro/components/product/TabbedAdaptivePDP/TabbedAdaptivePDPUpper'
import HeaderTabs from 'toro/components/header/Tabs'

import _MobilePromoBannerNotch from 'toro/components/header/MobilePromoBannerNotch/MobilePromoBannerNotch'

const MobilePromoBannerNotch = withFeatureFlag(_MobilePromoBannerNotch, {
  ToggleSiteFeatures: ['enableCollapsiblePromoBar'],
})

import useHeaderPositionPref from 'toro/hooks/useHeaderPositionPref'
import useExperiment from 'toro/hooks/useExperiment'
import { EXPERIMENTS } from 'toro/constants/experiments'
import MobileMenu from 'toro/components/header/MobileMenu'
import MobileMenuPlainLinks from 'toro/components/header/MobileMenuPlainLinks'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import useProductImageHeight from 'toro/hooks/useProductImageHeight'
import { thinkPLPAtom } from 'store/think-plp.atom'

const SitePreview = dynamic(() => import('toro/components/SitePreview'), {
  ssr: false,
})

const unfixedStylesWhenTransparencyIsEnabled = {
  top: 0,
  left: 0,
  right: 0,
  position: 'relative',
  transition: 'all .2s',
}

const HeaderMobile = () => {
  const successToast = useToast()
  const router = useRouter()
  const { isDesktop, isTablet, isMobile } = useViewportType()
  const { formatMessage } = useIntl()
  const setHeaderMounted = useUpdateAtom(isHeaderMountedAtom)
  const [isScrolled, setIsScrolled] = useState(false)
  const { appData } = useContext(PWAContext)
  const { isProductPassport, isHP } = usePageType()

  const isSitePreviewEnabled = get(appData, 'isSitePreviewEnabled', false)

  const promoBannerData = useGlobalSlotAtomData('header-banner-m')
  const isPDPv3 = useExperiment(EXPERIMENTS.PDP_V3)
  const {
    isStickyHeader,
    isTransparentStickyHeader,
    isTransparentSlidingHeader,
    isStaticHeader,
    isSlidingNavHeader,
    isSlidingCarouselHeader,
  } = useHeaderPositionPref()

  useEffect(() => {
    setHeaderMounted(true)
  }, [])

  const hslColors = useAtomValue(hslColorAdaptivePDPAtom)

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
  const [, setIsHoveredOnMiniCart] = useState(false)
  const [, setIsMiniCartRef] = useState()
  const [fixed, setFixed] = useState(true)
  const [headerActualHeight, setHeaderActualHeight] = useState(0)
  const [promoBannerIsHidden, setPromoBannerIsHidden] = useState(false)
  const [headerExposedSearchHeight, setHeaderExposedSearchHeight] = useState(0)
  const [transparentStickyFadeIn, setTransparentStickyFadeIn] = useState(false)
  const [isTransparentHeaderEnable, setIsTransparentHeaderEnable] = useState(transparentHeader)
  const setIsTransparentHeader = useUpdateAtom(setIsTransparentHeaderAtom)
  const isTransparentHeaderValue = useAtomValue(isTransparentHeaderAtom)
  const { isThinkPage, enableTransparentHeader } = useAtomValue(thinkPLPAtom)
  const headroomActualHeight = get(wrapperRef, 'current.inner.clientHeight', 0)
  const isReducedHeader = get(appData, 'isReducedHeaderAndFooter', false)
  const headerBannerScript = get(promoBannerData, 'scripts', [])
  const headerBannerModalContent = get(promoBannerData, 'modalContent')
  const headerBannerPopupContent = get(promoBannerData, 'popupContent')

  const isPDP = router.pathname.includes('/product')
  const isTransparentStickyHeaderOnPDP =
    isTransparentStickyHeader && isPDP && (isPDPv3 || isTabbedAdaptivePDPEligible) && isMobile

  const isHeadroomDisabled = useMemo(() => {
    if (isTransparentStickyHeaderOnPDP) {
      return true
    }

    const isSlidingHeader =
      isSlidingNavHeader || isSlidingCarouselHeader || isTransparentSlidingHeader || !isPDP

    return isStaticHeader || isStickyHeader || !isSlidingHeader || !isHeadroomActive
  }, [
    isTransparentStickyHeaderOnPDP,
    isStaticHeader,
    isStickyHeader,
    isSlidingNavHeader,
    isSlidingCarouselHeader,
    isTransparentSlidingHeader,
    isHeadroomActive,
    isPDP,
  ])

  const variant = useMemo(() => {
    if (isTransparentStickyHeaderOnPDP) {
      if (isTabbedAdaptivePDPEligible) {
        return 'transparentStickyHeaderFullBleed'
      }
      return 'transparentStickyHeader'
    }

    if (enableNewGlobalHeader) {
      return 'globalHeaderV2'
    }

    return null
  }, [isTransparentStickyHeaderOnPDP, enableNewGlobalHeader, isTabbedAdaptivePDPEligible])

  const styles = useMultiStyleConfig('HeaderPage', { variant })

  const isTransparentHeader = useMemo(() => {
    if (isTransparentSlidingHeader) {
      return true
    }
    if (isThinkPage) {
      return enableTransparentHeader
    }
    const isTransparentHeaderOnHP = transparentHeader && isHP
    return enableNewGlobalHeader
      ? isTransparentHeaderOnHP && !isDesktop
      : isTransparentHeaderOnHP && isTransparentHeaderEnable
  }, [
    transparentHeader,
    isHP,
    isDesktop,
    enableNewGlobalHeader,
    enableTransparentHeader,
    isTransparentHeaderEnable,
    isThinkPage,
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
  }, [isPDP, isTransparentStickyHeader])

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
    }
  }, [])

  const handleUnfix = useCallback(() => {
    setFixed(true)
    if (isTransparentHeader) setIsTransparentHeaderEnable(true)
  }, [])

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
      isTransparentHeaderValue,
    }),
  }

  useEffect(() => {
    setBannerHeight(get(bannerRef, 'current.offsetHeight') + (isMobile ? 0 : 1))
  }, [isDesktop, isTablet, isMobile])

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
        setBannerHeight(get(entr, '[0].target.offsetHeight') + (isMobile ? 0 : 1))
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

  const heightOfImage = useProductImageHeight()

  useEffect(() => {
    if (!isPDP || !isOneCoachTabbedHeaderActive) {
      return
    }

    setIsScrolled(window.scrollY > PARALLAX_THRESHOLD && window.scrollY < heightOfImage)
    const event = window.scrollListener.add(() =>
      setIsScrolled(window.scrollY > PARALLAX_THRESHOLD && window.scrollY < heightOfImage)
    )
    return event
  }, [isPDP, isOneCoachTabbedHeaderActive])

  const isTabHeaderVisible = get(appData, 'isTabHeaderVisible', false)
  const showDefaultTabs = isTabHeaderVisible && !(isMobile && enableNewGlobalHeader)

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
          !isTabbedAdaptiveDynamicAssetInViewport &&
          !isOneCoachTabbedHeaderActive
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
              {isMobile && (
                <MobilePromoBannerNotch
                  promoBannerIsHidden={promoBannerIsHidden}
                  setPromoBannerIsHidden={setPromoBannerIsHidden}
                  bannerRef={bannerRef.current}
                />
              )}
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
            <Box
              sx={{
                ...styles.headerPageInnerContainer({
                  transparentStickyFadeIn,
                  isOneCoachTabbedHeaderActive,
                  isMobile,
                }),
                ...(isTabbedAdaptiveDynamicAssetInViewport
                  ? styles.headerDynamicAssetContrast
                  : {}),
                ...(isOneCoachTabbedHeaderActive
                  ? {
                      backgroundColor: hslColors.second,
                      boxShadow: 'none !important',
                      ...styles.coachOneTabPDPMobile,
                    }
                  : {}),
              }}
              className={`${
                isTransparentHeader && isOnTop
                  ? `transparentHeader ${headerV2FadeIn ? 'headerV2FadeIn' : ''}`
                  : ''
              } ${isScrolled && isTabbedAdaptivePDPEligible ? 'scrolled-header' : ''}`}
              style={isTransparentHeader ? unfixedStylesWhenTransparencyIsEnabled : {}}
              data-qa="hdr_container_section"
            >
              <Box ref={headerRef}>
                {/* TODO: decouple into: [desktop, mobile, shared] */}
                <HeaderMainContent
                  setIsMiniCartRef={setIsMiniCartRef}
                  setIsHoveredOnMiniCart={setIsHoveredOnMiniCart}
                />
              </Box>
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
      <MobileMenu />
      <MobileMenuPlainLinks />
    </>
  )
}

export default memo(HeaderMobile)
