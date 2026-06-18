import useSafeLayoutEffect from 'toro/hooks/useSafeLayoutEffect'
import { useRouter } from 'next/router'
import { applySplideSlidersForNode } from 'toro/helpers/home'

function findParent(el, selector) {
  if (!el) return null
  while ((el = el.parentNode) && el !== document) {
    if (!selector || el.matches(selector)) return el
  }
  return null
}

export const TABBED_CONTENT_HTML_IDENTIFIER = '.mol-tabbed-content'

function handleNavScroll(navContainer, fadeContainer) {
  if (!navContainer || !fadeContainer) {
    return
  }
  const { scrollLeft, scrollWidth, clientWidth } = navContainer
  fadeContainer.classList.remove('left-fade-hidden', 'right-fade-hidden')
  if (scrollLeft === 0) {
    fadeContainer.classList.add('left-fade-hidden')
  }
  if (Math.round(scrollLeft + clientWidth) >= scrollWidth) {
    fadeContainer.classList.add('right-fade-hidden')
  }
}

export function initTabbedContent(tabbedElement, tabLinkId = '') {
  if (tabbedElement.dataset.init === 'true') return
  const navigationLinks = Array.from(tabbedElement.querySelectorAll('.nav-link'))
  const tabContent = tabbedElement.querySelector('.tab-content')
  const navContainer = tabbedElement.querySelector('.nav-tabs')
  const fadeContainer = tabbedElement.querySelector('.tabs-list.horizontal-scroll')
  const autoSelectInterval = tabbedElement.dataset['timeInterval']
  let currentIndex = navigationLinks.findIndex((link) => link.classList.contains('active'))
  if (currentIndex === -1) {
    currentIndex = 0
    const firstLink = navigationLinks[0]
    if (firstLink) {
      const targetId = firstLink.getAttribute('data-target')
      const target = tabbedElement.querySelector(targetId)
      firstLink.classList.add('active')
      target?.classList.add('active', 'show')
    }
  }

  let timer
  let isInView = false
  const startTimer = () => {
    if (tabbedElement.dataset.timeIntervalAttached === 'true' || !isInView) {
      return
    }
    cleanupTimer()
    tabbedElement.dataset.timeIntervalAttached = 'true'
    timer = setInterval(() => {
      if (isInView) {
        currentIndex = (currentIndex + 1) % navigationLinks.length
        handleTabElSwitch(navigationLinks[currentIndex])
      }
    }, autoSelectInterval)
  }

  const stopTimer = () => {
    cleanupTimer()
  }

  let intersectionObserver
  if (autoSelectInterval) {
    intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.target === tabContent) {
          isInView = entry.isIntersecting

          if (isInView) {
            startTimer()
          } else {
            stopTimer()
          }
        }
      })
    })
    intersectionObserver.observe(tabContent)
  }

  function navScrollHandler() {
    handleNavScroll(navContainer, fadeContainer)
  }
  if (navContainer && fadeContainer && navContainer.scrollWidth > navContainer.clientWidth) {
    navContainer.addEventListener('scroll', navScrollHandler)
    // Initial check
    handleNavScroll(navContainer, fadeContainer)
  } else if (fadeContainer) {
    fadeContainer.classList.add('no-scroll')
  }

  const cleanUpActiveElements = (target) => {
    const tabNavContainer = findParent(target, '.nav')
    const tabbedLinks = Array.from(tabNavContainer?.querySelectorAll('.nav-link') || [])
    const navActiveItem = Array.from(tabNavContainer?.querySelectorAll('.nav-item') || [])
    const tabContent = tabNavContainer?.parentNode?.querySelector('.tab-content')
    const tabbedPanes = Array.from(tabContent?.querySelectorAll(':scope > .tab-pane') || [])
    const tabbedContentElements = [...tabbedPanes, ...tabbedLinks, ...navActiveItem]
    // Pause all videos in the inactive tab
    const videosInInactiveTab = tabNavContainer?.parentNode?.querySelectorAll(
      '.tab-content .tab-pane.active .at-media-asset video'
    )
    videosInInactiveTab?.forEach((video) => {
      if (!video.paused) {
        video.classList.add('video-stopped')
        video.pause()
      }
    })

    tabbedContentElements.forEach((el) => {
      el.classList.remove('active', 'show', 'active-item')
    })
    tabNavContainer?.parentNode?.style.removeProperty('background-color')
  }

  const handleTabElSwitch = (tabLinkEl, tabActiveItem) => {
    const isActive = tabLinkEl.classList?.contains?.('active')
    // if user clicked on already active tab
    if (isActive) return
    const targetElementId = tabLinkEl.getAttribute('data-target')
    if (!targetElementId) return
    const targetElement = tabbedElement.querySelector(targetElementId)
    if (!targetElement) return
    cleanUpActiveElements(tabLinkEl)
    targetElement.classList.add('active', 'show')
    tabLinkEl.classList.add('active')
    tabActiveItem?.classList.add('active-item')
    const newIndex = navigationLinks.indexOf(tabLinkEl)
    if (newIndex !== -1) {
      currentIndex = newIndex
    }
    const hasSplideContent = Boolean(targetElement?.querySelectorAll('.splide__list').length)
    if (hasSplideContent) {
      requestAnimationFrame(() => {
        applySplideSlidersForNode(targetElement)
      })
    }

    // Autoplay all videos in the active tab that were paused
    const videosInActiveTab = tabLinkEl
      ?.closest(TABBED_CONTENT_HTML_IDENTIFIER)
      .querySelectorAll('.tab-content .tab-pane.active .at-media-asset video.video-stopped')
    videosInActiveTab?.forEach((video) => {
      video.classList.remove('video-stopped')
      video.play()
    })

    // Change background color of the parent .mol-tabbed-content
    const bgColor = tabLinkEl.getAttribute('data-bg-color')
    if (bgColor) {
      tabbedElement.style.backgroundColor = bgColor
    } else {
      // Reset to default color if no data-bg-color is present
      tabbedElement.style.backgroundColor = ''
    }

    // Set CSS variable on fadeContainer
    if (fadeContainer) {
      if (bgColor) {
        fadeContainer.style.setProperty('--tab-bg-color', bgColor)
      } else {
        fadeContainer.style.removeProperty('--tab-bg-color')
      }
    }
  }
  function cleanupTimer() {
    tabbedElement.dataset.timeIntervalAttached = 'false'
    clearInterval(timer)
  }
  const handleSwitchContent = (ev) => {
    const tabLinkEl = ev.target
    const tabActiveItem = ev.target.closest('li.nav-item')
    handleTabElSwitch(tabLinkEl, tabActiveItem)
    if (autoSelectInterval && isInView) {
      startTimer()
    }
  }

  navigationLinks.forEach((el) => {
    const title = el.getAttribute('title')
    const promotionName = el.getAttribute('data-promotion-name')
    if (title == '' && promotionName != '') {
      el.setAttribute('title', promotionName)
    }
  })

  navigationLinks.forEach((navLink) => {
    navLink.addEventListener('click', handleSwitchContent)
  })
  if (tabLinkId) {
    tabLinkId = `${tabLinkId}-tab`
    const tabLinkEl = navigationLinks.find((link) => link.id === tabLinkId)
    if (tabLinkEl) {
      handleTabElSwitch(tabLinkEl)
    }
  } else {
    const activeTabLinkEl = navigationLinks.find(
      (link) => link.classList.contains('active') && link.getAttribute('data-bg-color')
    )
    if (activeTabLinkEl) {
      const bgColor = activeTabLinkEl.getAttribute('data-bg-color')
      if (bgColor) {
        tabbedElement.style.backgroundColor = bgColor
        if (fadeContainer) {
          fadeContainer.style.setProperty('--tab-bg-color', bgColor)
        }
      } else {
        if (fadeContainer) {
          fadeContainer.style.removeProperty('--tab-bg-color')
        }
      }
    }
  }
  if (autoSelectInterval) {
    startTimer()
  }
  tabbedElement.dataset.init = 'true'
  return () => {
    cleanupTimer()
    intersectionObserver?.disconnect()
    delete tabbedElement.dataset.init
    navigationLinks.forEach((navLink) => {
      navLink.removeEventListener('click', handleSwitchContent)
    })
    if (navContainer) {
      navContainer.removeEventListener('scroll', navScrollHandler)
    }
  }
}

export const useTabbedContent = () => {
  const router = useRouter()
  const tabLinkId = router?.query?.world

  useSafeLayoutEffect(() => {
    const tabbedContent = Array.from(document.querySelectorAll(TABBED_CONTENT_HTML_IDENTIFIER))
    const cleanUpFunctions = tabbedContent.length
      ? tabbedContent.map((tabbedElement) => initTabbedContent(tabbedElement, tabLinkId))
      : undefined

    return () => {
      cleanUpFunctions?.forEach((cleanUpFn) => cleanUpFn?.())
    }
  }, [])
}
