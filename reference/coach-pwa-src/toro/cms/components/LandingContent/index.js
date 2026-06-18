import { useEffect, useContext, Fragment, useCallback, useState, useRef } from 'react'
import Box from 'toro/components/Box'
import SessionContext from 'toro/components/SessionContext'
import {
  INIT_CALLBACK_NAME,
  applySplideSliders,
  applyProductSwatchesClick,
  getStarSvg,
  getChevronIcon,
} from 'toro/helpers/home'
import useViewportType from 'toro/hooks/useViewportType'
import get from 'lodash/get'
import PWAContext from 'components/common/PWAContext'
import { CONTAINER_ID } from 'toro/constants/appConstants'
import usePreference from 'toro/hooks/usePreference_new'
import { windowResizeVideo as initiateVideoSize, infinityScroll } from 'toro/helpers/mediaAssets'
import useViewportVideoHandler from 'toro/hooks/useViewportVideoHandler'
import LazySlot from 'toro/cms/components/LandingContent/LazySlot'
import useAnalytics from 'toro/analytics/useAnalytics'
import UGCPortal from 'toro/components/UGC/UGCPortal'
import { useAtomValue } from 'jotai/utils'
import menuDataAtom from 'store/menu-data.atom'
import { addToBagButtonOnEventAtom } from 'store/global.atom'
import useMediaAssetContent from 'toro/hooks/useMediaAssetContent'
import dynamic from 'next/dynamic'

const HomepageRecommendationsSlot = dynamic(
  () => import('toro/cms/components/LandingContent/HomepageRecommendationsSlot'),
  { ssr: false }
)

const CLPRecommendedCategories = dynamic(
  () => import('toro/components/product/RecommendedCategories/CLPRecommendedCategories'),
  { ssr: false }
)

const CLPRecommendationsSlot = dynamic(() => import('toro/components/CLPRecommendationsSlot'), {
  ssr: false,
})

const CONTAINER_CLASS = 'mwlc'

const applyStarIcon = () => {
  if (!window.$) {
    return
  }
  window.$('.product .product-tile__ratings .ratings a').each((idx, item) => {
    const $item = window.$(item)
    try {
      $item.find('svg').each((i, ele) => {
        const $el = window.$(ele)
        const newSvg = getStarSvg($el.attr('data-qa'))
        if (newSvg) {
          $el.prepend(newSvg)
        }
      })
      // eslint-disable-next-line no-empty
    } catch (error) {}
  })
}

const applyDrawerIcon = () => {
  if (!window.$) {
    return
  }
  window.$('.drawer-icon svg .open-icon, .drawer-icon svg .close-icon').each((_idx, item) => {
    const $item = window.$(item)
    const currentClasses = $item.attr('class')
    const isOpenIcon = currentClasses.includes('open')
    $item.replaceWith(function () {
      return window.$(getChevronIcon(isOpenIcon ? 'down' : 'up')).addClass(currentClasses)
    })
  })
}

const applyVideoSrc = (isDesktop, videoSrcs) => {
  if (!window.$) {
    return
  }
  const viewport = isDesktop ? 'desktop' : 'mobile'
  const fallbackAttr = 'data-desktop-video-src'
  // This section is for handling videoSrcs from inline script
  window.$('video:not([data-loading="lazy"]):not([src])').each((idx, item) => {
    const $item = window.$(item)

    if (videoSrcs?.length) {
      videoSrcs.forEach((videoItem) => {
        if ($item.attr('id') === videoItem.videoId) {
          const src = get(videoItem, `videoSrc.${viewport}`)
          if (src) {
            $item.attr('src', src)
          }
        }
        // For some video tags still exists src in video tag while append src from inline scripts
        if (!$item.attr('id')) {
          const src = $item.attr(`data-${viewport}-video-src`) || $item.attr(fallbackAttr)
          if (src) {
            $item.attr('src', src)
          }
        }
      })
    } else {
      // This section is just append video src from video tag it self
      const src = $item.attr(`data-${viewport}-video-src`) || $item.attr(fallbackAttr)
      if (src) {
        $item.attr('src', src)
      }
    }
  })
}

const handleAccordions = (id) => {
  // TM-10110
  if (!window.$) {
    return
  }
  window.$(`#${id}`).on('click', 'a[data-parent="#accordion"]', (e) => {
    e.preventDefault()
    const $panelButton = window.$(e.currentTarget)
    const $panel = $panelButton.parents('.panel')
    const $panelCollapse = $panel.find('.panel-collapse')
    $panelCollapse.animate({ height: 'toggle' })
  })
}

const onInit = (id, isDesktop, videoSrcs) => {
  try {
    applySplideSliders(id)
    applyProductSwatchesClick(id)
    applyStarIcon()
    applyDrawerIcon()
    applyVideoSrc(isDesktop, videoSrcs)
    handleAccordions(id)
    initiateVideoSize(isDesktop)
  } catch (e) {
    console.error('HomeBody onInit', e)
  }
}

export default function LandingContent({
  slots,
  videoSrcs,
  isHome,
  children,
  slotsBottom,
  hasVideoContent = false,
  isComparablePriceEnabledCategory = false,
}) {
  const { isDesktop, isMobile } = useViewportType()
  const { session } = useContext(SessionContext)
  const { injectJquery } = useContext(PWAContext)
  const { appData } = useContext(PWAContext)
  const analytics = useAnalytics()
  const siteId = get(appData, 'siteId')
  const brand = get(appData, 'brand')
  const signedIn = !!get(session, 'user.userEmail')
  const [wyngContent, setWyngContent] = useState(null)
  const wyngSlotId = useRef(null)
  const slotsCleanUpFunctions = useRef([])
  const menuData = useAtomValue(menuDataAtom)
  const addToBagButtonOnEvent = useAtomValue(addToBagButtonOnEventAtom)
  const viewportVideoHandlerRef = useViewportVideoHandler(hasVideoContent)
  useMediaAssetContent()

  const corespondingClass = isHome ? CONTAINER_CLASS : ''
  const {
    pixleeUgc: { enablePixleeUGCHome },
    wyng: { isEnableWyngOnHomePage },
  } = usePreference({
    wyng: ['isEnableWyngOnHomePage'],
    pixleeUGC: ['enablePixleeUGCHome'],
  })

  const onMount = useCallback(
    async (desktop) => {
      const onPageInit = () => onInit(CONTAINER_ID, desktop, videoSrcs)
      try {
        await injectJquery()
        window[INIT_CALLBACK_NAME] = onPageInit
        window[INIT_CALLBACK_NAME]?.()
      } catch (e) {
        console.log('Error when init home page', e)
      }
    },
    [injectJquery]
  )

  useEffect(() => {
    onMount(isDesktop)

    return () => {
      if (slotsCleanUpFunctions.current.length) {
        slotsCleanUpFunctions.current.forEach((cleanupFn) => cleanupFn?.())
        slotsCleanUpFunctions.current = []
      }
    }
  }, [isDesktop])

  useEffect(() => {
    if (signedIn) {
      coachInsidersSlotLogic()
    }
  }, [signedIn])

  const handleWyngContent = useCallback((node) => {
    if (node) {
      setWyngContent(node)
    }
  }, [])

  const handleSubNavClick = (node) => {
    const subNavLinkHandler = (e) => {
      const subNavLink = e?.target?.closest('.mini-nav__links')
      const categories = Object.values(menuData).filter(
        (category) => category?.url === subNavLink?.pathname
      )
      if (categories.length) {
        const targetCategory = categories[categories.length - 1]
        const navigationItemData = { parentCategoryTree: targetCategory.parentCategoryTree }
        analytics.send('navClick', {
          eventLocation: 'sub nav',
          navigationItemData,
        })
      }
    }

    const subNavLinks = node.querySelectorAll('.mini-nav__links')
    subNavLinks.forEach((link) => link.addEventListener('click', subNavLinkHandler))

    return () => subNavLinks.forEach((link) => link.removeEventListener('click', subNavLinkHandler))
  }

  const handleContent = useCallback((node) => {
    if (!node) return
    infinityScroll(node)
    if (isHome) {
      const subNavLinkHandlerCleanup = handleSubNavClick(node)
      slotsCleanUpFunctions.current = [...slotsCleanUpFunctions.current, subNavLinkHandlerCleanup]
    }
    forcedScrollInitializer(node).then((cleanUpFunction) => {
      if (cleanUpFunction) {
        slotsCleanUpFunctions.current.push(cleanUpFunction)
      }
    })
    horizontalAccordionInitializer(node).then((cleanUpFunction) => {
      if (cleanUpFunction) {
        slotsCleanUpFunctions.current.push(cleanUpFunction)
      }
    })
  }, [])

  const updateCiButton = (selector, name, url) => {
    if (!selector || !name || !url) {
      return
    }
    const button = document.querySelector(selector)
    if (!button) {
      return
    }

    button.setAttribute('title', name)
    button.setAttribute('data-promotion-name', name)
    button.setAttribute('href', url)
    button.innerHTML = name
  }

  const coachInsidersSlotLogic = () => {
    // TM-7963 Coach Insider Home Body Slot
    const basePath = window?.location?.origin
    if (!basePath) {
      return
    }
    updateCiButton(
      "[data-promotion-id=id-1108-insider-hp-banner][title='SIGN IN TO CUSTOMIZE']",
      'EXPLORE CUSTOMIZATION',
      `${basePath}/shop/customization/for-her/all`
    )
    updateCiButton(
      "[data-promotion-id=id-1108-insider-hp-banner][title='BECOME AN INSIDER']",
      'EXPLORE MONOGRAM STYLES',
      `${basePath}/shop/customization/the-monogram-shop`
    )
  }

  const renderSlot = (slot, idx) => {
    if (slot.clpRecommendations?.enabled) {
      return (
        <Fragment key={`clp-recommendations-${idx}`}>
          <LazySlot slot={slot} idx={idx} lazyLoadImages lazyLoadVideos />
          <CLPRecommendationsSlot schema={slot.clpRecommendations.schema} />
        </Fragment>
      )
    }

    if (slot.isRecommendationsSlot) {
      return (
        <Fragment key={`certona-homepage-${idx}`}>
          <LazySlot slot={slot} idx={idx} lazyLoadImages lazyLoadVideos />
          <HomepageRecommendationsSlot siteId={siteId} brand={brand} />
        </Fragment>
      )
    }

    if (slot.hasRecommendedCategories) {
      return (
        <Fragment key={`recommended-categories-${idx}`}>
          <LazySlot slot={slot} idx={idx} lazyLoadImages lazyLoadVideos />
          <CLPRecommendedCategories
            isComparablePriceEnabledCategory={isComparablePriceEnabledCategory}
          />
        </Fragment>
      )
    }

    if (!slot.html) {
      return null
    }

    const key = `slot-${idx}`

    if (slot.wyngSlot && (isEnableWyngOnHomePage || enablePixleeUGCHome)) {
      if (wyngSlotId.current && wyngSlotId.current !== slot.id) return // wyngSlot should be uniq
      wyngSlotId.current = slot.id
      return (
        <Fragment key={key}>
          <LazySlot ref={handleWyngContent} slot={slot} idx={idx} lazyLoadImages lazyLoadVideos />
          <UGCPortal
            content={wyngContent}
            pageType="home"
            variant={isMobile ? 'wyngMobileNotCentered' : 'home'}
          />
        </Fragment>
      )
    }
    return (
      <LazySlot ref={handleContent} key={key} slot={slot} idx={idx} lazyLoadImages lazyLoadVideos />
    )
  }

  return (
    <Box
      ref={hasVideoContent ? viewportVideoHandlerRef : null}
      w="100%"
      maxWidth="100vw"
      h={slots?.length ? 'auto' : '100vh'}
      id={CONTAINER_ID}
      className={`cms-slot ${corespondingClass}`}
    >
      {slots?.map(renderSlot)}
      {children}
      {slotsBottom?.map(renderSlot)}
      {addToBagButtonOnEvent}
    </Box>
  )
}

async function forcedScrollInitializer(node) {
  if (!node?.querySelector('[data-forced-scroll]')) return

  const { initAllForcedScrolls } = await import('toro/helpers/initForcedScroll')

  const cleanUpFunction = initAllForcedScrolls(node)

  return cleanUpFunction
}

async function horizontalAccordionInitializer(node) {
  if (!node?.querySelector('[data-horizontal-accordion]')) return

  const { initAllHorizontalAccordions } = await import('toro/helpers/initHorizontalAccordion')

  const cleanUpFunction = initAllHorizontalAccordions(node)

  return cleanUpFunction
}
