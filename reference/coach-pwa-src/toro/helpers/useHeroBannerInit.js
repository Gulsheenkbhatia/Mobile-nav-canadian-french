import { useState, useEffect } from 'react'
import { useAtomValue } from 'jotai/utils'
import router from 'next/router'
import { isHeaderHeightAtom, bannerHeightAtom } from 'store/headroom.atom'

/**
 * Applies header height CSS variables to hero banners.
 * Sets both desktop and mobile variables to the total header height.
 * CSS media queries determine which variable is used at each breakpoint.
 *
 * Total height = isHeaderHeightAtom (headroom/nav) + bannerHeightAtom (promo bar)
 * These atoms are already updated by the header components, eliminating
 * the need for duplicate ResizeObservers or polling.
 */
const applyHeaderHeightToBanners = (heroBanners, headerHeight) => {
  if (!heroBanners?.length || !headerHeight) return

  const heightValue = `${headerHeight}px`

  heroBanners.forEach((banner) => {
    banner.style.setProperty('--header-height-desktop', heightValue)
    banner.style.setProperty('--header-height-mobile', heightValue)
  })
}

const heroBannerInit = (node) => {
  if (!node) {
    return
  }
  const heroBannerMedia = [...node.querySelectorAll('.mol-banner a.at-media-asset')]
  const heroYoutubeMedia = [...node.querySelectorAll('.mol-banner .at-youtube-video')]
  const inlineBannerWithPosition = [
    ...node.querySelectorAll('.mol-banner.inline .banner-container.position-text'),
  ]

  inlineBannerWithPosition.forEach((banner) => {
    const headerBlock = banner.querySelector('.mol-header-block-container')
    const headerBlockWidth = headerBlock?.offsetWidth

    if (headerBlockWidth) {
      const promoText = banner.querySelector('.promo-line-text')
      const bylineText = banner.querySelector('.byline-text')
      if (promoText) {
        promoText.style.width = `${headerBlockWidth}px`
      }
      if (bylineText) {
        bylineText.style.width = `${headerBlockWidth}px`
      }
    }
  })

  const cleanupHeroBannerMedia = heroBannerMedia.map((elem) => {
    const currentBanner = elem.closest('.mol-banner')
    const targetUrl = elem.getAttribute('href')
    if (targetUrl) {
      const heroBannerMediaHandler = (e) => {
        if (!e.target.closest('a') && !e.target.closest('button')) {
          router.push(targetUrl)
        }
      }

      currentBanner.addEventListener('click', heroBannerMediaHandler)

      return () => currentBanner.removeEventListener('click', heroBannerMediaHandler)
    }
    return undefined
  })

  const cleanupHeroYoutubeMedia = heroYoutubeMedia.map((elem) => {
    const currentBanner = elem.closest('.mol-banner')
    const currentHeaderBlock = currentBanner.querySelector('.mol-header-block-container')

    const heroYoutubeMediaHandler = (e) => {
      if (
        (e.target === currentHeaderBlock || e.target.closest('.mol-header-block-container')) &&
        !e.target.closest('a') &&
        !e.target.closest('button')
      ) {
        e.target.closest('.mol-banner')?.querySelector('.at-youtube-video')?.click()
      }
    }

    currentBanner.addEventListener('click', heroYoutubeMediaHandler)

    return () => currentBanner.removeEventListener('click', heroYoutubeMediaHandler)
  })

  const cleanupHeroBannerInit = () => {
    ;[...cleanupHeroBannerMedia, ...cleanupHeroYoutubeMedia].forEach((fn) => fn?.())
  }

  return cleanupHeroBannerInit
}

export const useHeroBannerInit = () => {
  const [node, setNode] = useState(null)
  const headroomHeight = useAtomValue(isHeaderHeightAtom)
  const bannerHeight = useAtomValue(bannerHeightAtom)

  // Total header height = headroom (nav bar) + banner (promo bar)
  const totalHeaderHeight = headroomHeight + bannerHeight

  // Initialize hero banner event handlers
  useEffect(() => {
    const cleanupHeroBannerInit = heroBannerInit(node)

    return () => {
      cleanupHeroBannerInit && cleanupHeroBannerInit()
    }
  }, [node])

  // Apply header height to hero banners when it changes
  // This reuses the existing atoms which are updated by the header components
  useEffect(() => {
    if (!node || !totalHeaderHeight) return

    const heroBanners = [
      ...node.querySelectorAll('.mol-banner.hero-banner[data-hero-banner="true"]'),
    ]
    applyHeaderHeightToBanners(heroBanners, totalHeaderHeight)
  }, [node, totalHeaderHeight])

  return setNode
}
