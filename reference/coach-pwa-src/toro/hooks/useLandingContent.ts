import { useCallback, useContext, useEffect } from 'react'
import {
  INIT_CALLBACK_NAME,
  applySplideSliders,
  applyProductSwatchesClick,
  getStarSvg,
  getChevronIcon,
} from 'toro/helpers/home'
import { CONTAINER_ID } from 'toro/constants/appConstants'
import {
  addMediaAssetListeners,
  removeMediaAssetListeners,
  windowResizeVideo as initiateVideoSize,
} from 'toro/helpers/mediaAssets'
import PWAContext from 'components/common/PWAContext'
import get from 'lodash/get'
import useViewportType from 'toro/hooks/useViewportType'

const FEATURE_BENEFIT_WITH_CONTENT_SELECTOR = '.feature-benefit-card.with-content'

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

const applyChevronIconForFeatureBenefit = () => {
  if (!window.$) {
    return
  }
  if (window.$(FEATURE_BENEFIT_WITH_CONTENT_SELECTOR).length > 0) {
    return
  }
  window.$('.drawer-icon svg').each((_idx, item) => {
    const $item = window.$(item)
    const featureBenefitCardClasses = $item.closest('.feature-benefit-card').attr('class')
    const currentClasses = $item.attr('class')
    const isExpandedIcon = featureBenefitCardClasses.includes('expanded')
    $item.replaceWith(() =>
      window.$(getChevronIcon(isExpandedIcon ? 'up' : 'down')).addClass(currentClasses)
    )
  })
}

const applyVideoSrc = (isDesktop, videoSrcs = []) => {
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

const onInit = (id, isDesktop, videoSrcs = []) => {
  try {
    applySplideSliders(id)
    applyProductSwatchesClick(id)
    applyStarIcon()
    applyDrawerIcon()
    applyChevronIconForFeatureBenefit()
    applyVideoSrc(isDesktop, videoSrcs)
    handleAccordions(id)
    initiateVideoSize(isDesktop)
  } catch (e) {
    console.error('HomeBody onInit', e)
  }
}

const useLandingContent = () => {
  const { injectJquery } = useContext(PWAContext)
  const { isDesktop } = useViewportType()

  const onMount = useCallback(
    async (desktop) => {
      const onPageInit = () => onInit(CONTAINER_ID, desktop)
      try {
        await injectJquery()
        window[INIT_CALLBACK_NAME] = window[INIT_CALLBACK_NAME] || onPageInit
        window[INIT_CALLBACK_NAME]?.()
      } catch (e) {
        console.log('Error when init home page', e)
      }
    },
    [injectJquery]
  )

  useEffect(() => {
    onMount(isDesktop)
    addMediaAssetListeners(isDesktop)

    return () => {
      removeMediaAssetListeners()
    }
  }, [])
}

export default useLandingContent
