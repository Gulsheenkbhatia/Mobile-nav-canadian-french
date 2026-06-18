import React, { forwardRef, useCallback, useEffect, useMemo, useRef } from 'react'
import Box from 'toro/components/Box'
import Text from 'toro/components/Text'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import { activePdpNavTabAtom } from 'store/pdp.atom'
import { useAtom } from 'jotai'
import useAnalytics from 'toro/analytics/useAnalytics'
import useProductData from 'toro/hooks/useProductData'
import { useIntroBrowserSession } from 'toro/hooks/useIntroBrowserSession'
import { usePdpV7AnchorNavTabVisibility } from 'toro/components/product/mobile/v7/hooks/usePdpV7AnchorNavTabVisibility'
import { isPdpV7AnchorTabInStrip } from 'toro/components/product/mobile/v7/helpers/isPdpV7AnchorTabInStrip'
import { scrollPdpV7AnchorElementIntoView } from 'toro/components/product/mobile/v7/helpers/pdpV7AnchorScroll'
import {
  usePdpV7SessionAnchorNavState,
  type AnchorTab,
} from 'toro/components/product/mobile/v7/hooks/usePdpV7SessionAnchorNavState'

type PDPAnchorNavV7InnerProps = {
  anchorNavMinTabs: number
  anchorNavs: AnchorTab[]
  forwardedRef: React.Ref<HTMLDivElement>
}

function assignRef<T>(ref: React.Ref<T> | null | undefined, value: T | null) {
  if (ref == null) return
  if (typeof ref === 'function') ref(value)
  else (ref as React.MutableRefObject<T | null>).current = value
}

const PDPAnchorNavV7Inner = ({
  anchorNavMinTabs,
  anchorNavs,
  forwardedRef,
}: PDPAnchorNavV7InnerProps) => {
  const productId = useProductData('id')

  const analytics = useAnalytics()

  const styles = useMultiStyleConfig('PdpAnchorNavV7')
  const { isFirstIntroBrowserSessionActive } = useIntroBrowserSession()

  const [activeTab, setActiveTab] = useAtom(activePdpNavTabAtom)
  const anchorTabVisibility = usePdpV7AnchorNavTabVisibility()

  const visibleAnchorNavs = useMemo(
    () => anchorNavs.filter((tab) => isPdpV7AnchorTabInStrip(tab.id, anchorTabVisibility)),
    [anchorNavs, anchorTabVisibility]
  )

  const scrollRef = useRef<HTMLDivElement | null>(null)

  const lazyLayoutScrollFixTimeoutRef = useRef<number | null>(null)

  const clearLazyLayoutScrollFixTimeout = useCallback(() => {
    if (lazyLayoutScrollFixTimeoutRef.current != null) {
      window.clearTimeout(lazyLayoutScrollFixTimeoutRef.current)
      lazyLayoutScrollFixTimeoutRef.current = null
    }
  }, [])

  const setContainerRef = useCallback(
    (node: HTMLDivElement | null) => {
      assignRef(forwardedRef, node)
    },
    [forwardedRef]
  )

  useEffect(() => () => clearLazyLayoutScrollFixTimeout(), [clearLazyLayoutScrollFixTimeout])

  const handleClick = ({ id, label }: AnchorTab) => {
    analytics.send('productInteraction', {
      eventAction: `tabbed nav click:${label.toLowerCase()}`,
      eventLabel: productId,
      eventLocationForced: 'product',
    })

    setActiveTab(id)

    clearLazyLayoutScrollFixTimeout()

    const scrollToId = () => {
      scrollPdpV7AnchorElementIntoView(document.getElementById(id))
    }

    scrollToId()
    lazyLayoutScrollFixTimeoutRef.current = window.setTimeout(scrollToId, 500)
  }

  useEffect(() => {
    const wrap = scrollRef.current
    if (!wrap || !activeTab) return

    const activeEl = wrap.querySelector(`[data-id="${activeTab}"]`) as HTMLElement | null
    if (!activeEl) return

    const tabRect = activeEl.getBoundingClientRect()
    const wrapRect = wrap.getBoundingClientRect()
    if (tabRect.left < wrapRect.left || tabRect.right > wrapRect.right) {
      activeEl.scrollIntoView({
        behavior: 'auto',
        inline: 'nearest',
        block: 'nearest',
      })
    }
  }, [activeTab])

  if (isFirstIntroBrowserSessionActive || visibleAnchorNavs.length < anchorNavMinTabs) {
    return null
  }

  return (
    <Box ref={setContainerRef} data-pdp-v7-anchor-nav sx={styles.container}>
      <Box sx={styles.scrollWrapper} ref={scrollRef}>
        {visibleAnchorNavs.map((tab) => {
          const isActive = activeTab === tab.id

          return (
            <Box
              key={tab.id}
              as="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={tab.id}
              tabIndex={isActive ? 0 : -1}
              data-id={tab.id}
              onClick={() => handleClick(tab)}
              sx={{
                ...styles.tab,
                ...(isActive ? styles.tabActive : styles.tabInactive),
              }}
            >
              <Text sx={styles.tabLabel}>{tab.label}</Text>
              {isActive && <Box sx={styles.activeIndicator} />}
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}

const PDPAnchorNavV7 = forwardRef<HTMLDivElement>((_, forwardedRef) => {
  const { anchorNavMinTabs, enabledAnchorNavs, shouldShowAnchorNav } =
    usePdpV7SessionAnchorNavState()
  if (!shouldShowAnchorNav) return null
  return (
    <PDPAnchorNavV7Inner
      anchorNavMinTabs={anchorNavMinTabs}
      anchorNavs={enabledAnchorNavs}
      forwardedRef={forwardedRef}
    />
  )
})

PDPAnchorNavV7.displayName = 'PDPAnchorNavV7'

export default PDPAnchorNavV7
