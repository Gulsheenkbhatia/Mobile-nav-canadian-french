import { useMemo, useRef, useEffect } from 'react'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import useAnalytics from 'toro/analytics/useAnalytics'
import Box from 'toro/components/Box'
import Text from 'toro/components/Text'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import useFullProductMedia from 'toro/components/product/mobile/v7/hooks/useFullProductMedia'
import useSelectedVariantData from 'toro/hooks/useSelectedVariantData'
import {
  resolveHeroGalleryTabs,
  useHeroGalleryEntries,
  type ResolvedHeroTab,
} from 'toro/components/product/mobile/v7/helpers/heroGallery'
import { productCarouselActiveIndexAtom, productCarouselGoToSlideRequestAtom } from 'store/pdp.atom'

export type { ResolvedHeroTab }

const AngleNavigator = ({ isDiscoverMode }: { isDiscoverMode?: boolean }) => {
  const styles = useMultiStyleConfig('AngleNavigatorV7', { isDiscoverMode })
  const fullMedias = useFullProductMedia()
  const heroGalleryEntries = useHeroGalleryEntries()
  const activeIdx = useAtomValue(productCarouselActiveIndexAtom)
  const setGoSlideRequest = useUpdateAtom(productCarouselGoToSlideRequestAtom)
  const analytics = useAnalytics()
  const selectedVariantId = useSelectedVariantData('id') || ''

  const resolvedTabs = useMemo(
    () => resolveHeroGalleryTabs(fullMedias, heroGalleryEntries),
    [fullMedias, heroGalleryEntries]
  )

  const activeTabOrder = useMemo(() => {
    const match = resolvedTabs.find((t) => t.mediaIndex === activeIdx)
    return match?.order ?? null
  }, [resolvedTabs, activeIdx])

  const containerRef = useRef<HTMLDivElement | null>(null)
  const itemRefs = useRef<Record<number, HTMLDivElement | null>>({})

  useEffect(() => {
    const container = containerRef.current
    if (activeTabOrder === null) return
    const activeElement = itemRefs.current[activeTabOrder]

    if (!container || !activeElement) return

    const containerRect = container.getBoundingClientRect()
    const itemRect = activeElement.getBoundingClientRect()

    const offset = itemRect.left - containerRect.left - containerRect.width / 2 + itemRect.width / 2
    if (Math.abs(offset) < 1) return
    container.scrollTo({
      left: container.scrollLeft + offset,
      behavior: 'smooth',
    })
  }, [activeTabOrder])

  if (resolvedTabs.length === 0 || resolvedTabs.length <= 1) {
    return null
  }

  return (
    <Box sx={styles.angleWrapper}>
      <Box ref={containerRef} sx={styles.angleScroll}>
        {resolvedTabs.map((item) => {
          const isActive = activeTabOrder === item.order

          return (
            <Box
              as="button"
              type="button"
              key={item.order}
              data-order={item.order}
              data-qa={`angle-tab-${item.order}`}
              ref={(el) => {
                itemRefs.current[item.order] = el
              }}
              onClick={() => {
                if (selectedVariantId) {
                  const cta = item.tabLabel.trim().toLowerCase()
                  analytics.send('swatchInteraction', {
                    eventAction: `P${item.order}:product image navigator click`,
                    eventLabel: selectedVariantId,
                    swatchType: 'product image',
                    swatchValue: `${selectedVariantId}:${cta}`,
                    swatchVariant: selectedVariantId,
                  })
                }
                setGoSlideRequest(item.mediaIndex)
              }}
              sx={{
                ...styles.angleItem,
                ...(isActive ? styles.angleItemActive : styles.angleItemInactive),
              }}
            >
              <Text sx={styles.angleLabel}>{item.tabLabel}</Text>
            </Box>
          )
        })}
      </Box>

      <Box sx={styles.fadeLeft} />
      <Box sx={styles.fadeRight} />
    </Box>
  )
}

export default AngleNavigator
