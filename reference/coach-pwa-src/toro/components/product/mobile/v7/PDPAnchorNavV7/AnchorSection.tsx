import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { useUpdateAtom } from 'jotai/utils'

import Box from 'toro/components/Box'
import {
  getPdpV7AnchorScrollOffsetPx,
  PDP_V7_ANCHOR_NAV_SELECTOR,
  PDP_V7_ANCHOR_SCROLL_EXTRA_PX,
} from 'toro/components/product/mobile/v7/helpers/pdpV7AnchorScroll'
import useSafeLayoutEffect from 'toro/hooks/useSafeLayoutEffect'
import useStickyHeaderHeight from 'toro/hooks/useStickyHeaderHeight'
import { usePdpV7SessionAnchorNavState } from 'toro/components/product/mobile/v7/hooks/usePdpV7SessionAnchorNavState'

import { activePdpNavTabAtom } from 'store/pdp.atom'

type Props = {
  id: string
  children: React.ReactNode
  offset?: number
}

const AnchorSection = ({ id, children, offset: offsetProp }: Props) => {
  const { shouldShowAnchorNav } = usePdpV7SessionAnchorNavState()
  const setActiveTab = useUpdateAtom(activePdpNavTabAtom)
  const stickyHeaderHeight = useStickyHeaderHeight()
  const [computedOffset, setComputedOffset] = useState(0)

  useSafeLayoutEffect(() => {
    if (offsetProp !== undefined) {
      return
    }
    const nav = document.querySelector<HTMLElement>(PDP_V7_ANCHOR_NAV_SELECTOR)
    setComputedOffset(
      getPdpV7AnchorScrollOffsetPx(nav, stickyHeaderHeight, PDP_V7_ANCHOR_SCROLL_EXTRA_PX)
    )
  }, [stickyHeaderHeight, offsetProp])

  const offset = offsetProp !== undefined ? offsetProp : computedOffset

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: `-${offset}px 0px -70% 0px`,
    skip: !shouldShowAnchorNav,
  })

  useEffect(() => {
    if (!shouldShowAnchorNav) {
      return
    }
    if (inView) {
      setActiveTab(id)
    } else {
      setActiveTab((prev) => (prev === id ? '' : prev))
    }
  }, [shouldShowAnchorNav, inView, id, setActiveTab])

  return (
    <Box
      ref={ref}
      id={id}
      data-anchor
      sx={{
        scrollMarginTop: `${offset}px`,
        '&:empty': { display: 'none' },
      }}
    >
      {children}
    </Box>
  )
}

export default AnchorSection
