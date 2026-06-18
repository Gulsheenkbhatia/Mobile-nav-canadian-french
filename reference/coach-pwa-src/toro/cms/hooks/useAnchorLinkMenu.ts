import { useEffect, useState, useRef } from 'react'
import { useAtomValue } from 'jotai/utils'
import { bannerHeightAtom, isHeaderHeightAtom, isHeaderHiddenAtom } from 'store/headroom.atom'
import {
  COMPONENT_SPACING_FROM_HEADER_DESKTOP,
  COMPONENT_SPACING_FROM_HEADER_MOBILE,
  MENU_TOP_DESKTOP_CLASS,
  MENU_TOP_MOBILE_CLASS,
  MOL_ANCHOR_LINK_MENU,
  NAVBAR_NAV_CLASS,
} from 'toro/cms/constants'
import useViewportType from 'toro/hooks/useViewportType'
import useVerticalScrollDirection from 'toro/hooks/useVerticalScrollDirection'

const calculateTop = (
  isHeaderHidden: boolean,
  showBanner: boolean,
  headerHeight: number,
  bannerHeight: number,
  isMobile: boolean,
  dynamicSubNavHeight: number,
  isOnTop: boolean
) => {
  let spacing = !isMobile
    ? COMPONENT_SPACING_FROM_HEADER_DESKTOP
    : COMPONENT_SPACING_FROM_HEADER_MOBILE

  if (!isHeaderHidden && showBanner) {
    spacing += headerHeight + bannerHeight
  } else if (!isHeaderHidden) {
    spacing += headerHeight
  }

  if (isMobile && dynamicSubNavHeight && isOnTop) {
    spacing += dynamicSubNavHeight
  }

  return `${spacing}px`
}

const useSetHeaderHeightToAnchorMenu = () => {
  const scrollableRef = useRef<HTMLElement | null>(null)
  const [node, setNode] = useState<ParentNode | null>(null)
  const headerHeight = useAtomValue(isHeaderHeightAtom)
  const bannerHeight = useAtomValue(bannerHeightAtom)
  const isHeaderHidden = useAtomValue(isHeaderHiddenAtom)
  const { isMobile, isDesktop } = useViewportType()
  const { showBanner, isOnTop } = useVerticalScrollDirection()
  const dynamicSubNavHeight = useRef<number>(0)

  // Horizontal scroll handler
  const handleScroll = () => {
    const el = scrollableRef.current
    if (!el) return

    const { scrollLeft, scrollWidth, clientWidth } = el
    el.classList.remove('left-fade-hidden', 'right-fade-hidden')

    if (scrollLeft === 0) {
      el.classList.add('left-fade-hidden')
    } else if (Math.round(scrollLeft + clientWidth) >= scrollWidth) {
      el.classList.add('right-fade-hidden')
    }
  }

  useEffect(() => {
    if (!node) return

    const anchorMenuNavbar = node.querySelector<HTMLElement>(
      `.${MOL_ANCHOR_LINK_MENU} .${NAVBAR_NAV_CLASS}`
    )
    if (!anchorMenuNavbar) return

    scrollableRef.current = anchorMenuNavbar

    if (anchorMenuNavbar.scrollWidth > anchorMenuNavbar.clientWidth) {
      anchorMenuNavbar.addEventListener('scroll', handleScroll)
      handleScroll()
    } else {
      anchorMenuNavbar.classList.add('no-scroll')
    }

    return () => {
      anchorMenuNavbar.removeEventListener('scroll', handleScroll)
    }
  }, [node])

  useEffect(() => {
    if (!node) return

    const anchorMenu = node.querySelector<HTMLElement>(`.${MOL_ANCHOR_LINK_MENU}`)
    if (!anchorMenu) return

    const isDesktopMenu = anchorMenu.classList.contains(MENU_TOP_DESKTOP_CLASS)
    const isMobileMenu = anchorMenu.classList.contains(MENU_TOP_MOBILE_CLASS)

    if ((isDesktop && !isDesktopMenu) || (isMobile && !isMobileMenu)) {
      return
    }

    if (isMobile && !dynamicSubNavHeight.current) {
      dynamicSubNavHeight.current =
        document.querySelector<HTMLElement>('#dynamicNav')?.getBoundingClientRect().height || 0
    }

    const top = calculateTop(
      isHeaderHidden,
      showBanner,
      headerHeight,
      bannerHeight,
      isMobile,
      dynamicSubNavHeight.current,
      isOnTop
    )
    anchorMenu.style.top = top
  }, [isHeaderHidden, showBanner, bannerHeight, headerHeight, node, isMobile, isDesktop, isOnTop])

  return setNode
}

export default useSetHeaderHeightToAnchorMenu
