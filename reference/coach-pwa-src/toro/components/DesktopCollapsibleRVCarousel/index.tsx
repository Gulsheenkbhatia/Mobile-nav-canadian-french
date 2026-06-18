import { memo, useCallback, useEffect, useRef, useState } from 'react'
import Collapse from 'toro/components/Collapse'
import { useInView } from 'react-intersection-observer'
import { useAtomValue } from 'jotai/utils'
import get from 'lodash/get'
import Box from 'toro/components/Box'
import Flex from 'toro/components/Flex'
import Text from 'toro/components/Text'
import Image from 'toro/components/Image'
import { ChevronBoldDownIcon } from 'toro/icons'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import useRVRecommendations from 'toro/hooks/useRVRecommendations'
import { getProductImageSrc } from 'toro/helpers/productImages'
import useAnalytics from 'toro/analytics/useAnalytics'
import usePreference from 'toro/hooks/usePreference_new'
import { isSubBrandActiveAtom } from 'store/global.atom'
import { bannerHeightAtom } from 'store/headroom.atom'
import { activeMenuItemsAtom } from 'store/menu-data.atom'
import CollapsibleRVItem from 'toro/components/CollapsibleRVRecommendationsCarousel/CollapsibleItem'
import scrollListener from 'toro/helpers/scrollListener'
import type { CertonaSchemeType } from 'store/certona-schemes.atoms'

const MAX_THUMBNAIL_PRODUCTS = 3
const RV_HEADER_HEIGHT = 60

type Props = {
  location?: 'HP' | 'PLP'
  isHidden?: boolean
  headerHeight?: number
  defaultExpanded?: boolean
}

const DesktopCollapsibleRVCarousel = ({
  location = 'HP',
  isHidden = false,
  headerHeight,
  defaultExpanded = false,
}: Props) => {
  const isSubBrandActive = useAtomValue(isSubBrandActiveAtom)
  const bannerHeight = useAtomValue(bannerHeightAtom)
  const activeMenuItems = useAtomValue(activeMenuItemsAtom)
  const isNavFlyoutOpen = !!activeMenuItems?.t1 || !!activeMenuItems?.t2
  const {
    toggleSiteFeatures: { recentlyViewConfiguration },
  } = usePreference({
    ToggleSiteFeatures: ['recentlyViewConfiguration'],
  })
  const isPLP = location === 'PLP'
  const pageKey = isPLP ? 'plp' : 'home'

  const getConfigValue = (path: string) =>
    get(recentlyViewConfiguration, isSubBrandActive ? `subBrand.${path}` : `brand.${path}`, false)

  const isRecentlyViewedEnabledFromConfig = getConfigValue(`${pageKey}.enable`)
  const rvScheme: CertonaSchemeType = getConfigValue(`${pageKey}.recommender`)

  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  const carouselRef = useRef<HTMLElement>(null)
  const hasTrackedImpression = useRef(false)
  const [bodyMaxHeight, setBodyMaxHeight] = useState<string>(
    `calc(100vh - ${headerHeight}px - ${RV_HEADER_HEIGHT}px)`
  )
  const styles = useMultiStyleConfig('DesktopCollapsibleRVCarousel', {
    variant: isPLP ? 'plp' : undefined,
  })
  const analytics = useAnalytics()
  const {
    title,
    products,
    display,
    handleClick,
    experienceId,
    addImpression,
    selectRecommItem,
    vendorScheme,
  } = useRVRecommendations({
    location,
    certonaScheme: rvScheme,
    enableBadging: false,
    carouselRef,
  })

  useEffect(() => {
    if (isHidden) {
      setIsExpanded(false)
    }
  }, [isHidden])

  useEffect(() => {
    if (!isExpanded) {
      return
    }
    const visibleBannerHeight = window.scrollY > 0 ? 0 : bannerHeight
    const offsetHeight = headerHeight + visibleBannerHeight + RV_HEADER_HEIGHT

    setBodyMaxHeight(`calc(100vh - ${offsetHeight}px)`)

    const onScroll = () => {
      setIsExpanded(false)
    }
    return scrollListener.add(onScroll)
  }, [isExpanded, headerHeight, bannerHeight])

  const { ref: inViewRef } = useInView({
    triggerOnce: false,
    threshold: 0.1,
    onChange: (inView) => {
      if (inView && !hasTrackedImpression.current) {
        hasTrackedImpression.current = true
        analytics.send('listInteraction', {
          eventAction: 'recommendation dropdown module impression',
          eventLabel: title?.toLowerCase() || 'recently viewed',
        })
      }
    },
  })

  const containerRef = useCallback(
    (node: HTMLElement | null) => {
      carouselRef.current = node
      inViewRef(node)
    },
    [inViewRef]
  )

  const toggleExpanded = () => {
    const next = !isExpanded
    setIsExpanded(next)

    if (display && products.length > 0) {
      analytics.send('listInteraction', {
        eventLocation: location,
        eventAction: next
          ? 'recommendation dropdown module open'
          : 'recommendation dropdown module close',
        eventLabel: title?.toLowerCase() || 'recently viewed',
      })
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      toggleExpanded()
    }
  }

  const thumbnailProducts = products.slice(0, MAX_THUMBNAIL_PRODUCTS)

  if (!isRecentlyViewedEnabledFromConfig || !products.length || !display) {
    return null
  }

  return (
    <Box
      id="rv_desktop_collapsible_container"
      sx={{
        ...styles.container,
        ...(isNavFlyoutOpen && { zIndex: 0 }),
        ...(isHidden && { display: 'none' }),
      }}
      onClick={handleClick}
      ref={containerRef}
    >
      <Box
        sx={styles.header}
        onClick={toggleExpanded}
        role="button"
        aria-expanded={isExpanded}
        aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${title}`}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        data-qa="rv-desktop-collapsible-header"
      >
        <Flex sx={styles.thumbnailsContainer}>
          {thumbnailProducts.map((product) => (
            <Box key={product.ID} sx={styles.thumbnailImage}>
              <Image
                sx={styles.thumbnailImageInner}
                src={getProductImageSrc(product.imageURL, 'desktop', 'plp', {
                  isSwatchImage: true,
                })}
                alt={product.name}
                data-qa="rv-desktop-thumbnail-image"
              />
            </Box>
          ))}
        </Flex>

        <Box sx={styles.titleContainer}>
          <Text sx={styles.title}>{title}</Text>
          <Box
            sx={{
              ...styles.chevronIcon,
              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          >
            <ChevronBoldDownIcon width="16px" height="16px" />
          </Box>
        </Box>
      </Box>

      <Collapse in={isExpanded}>
        <Box
          sx={{
            ...styles.bodyWrapper,
            maxHeight: bodyMaxHeight,
          }}
          id="rv_desktop_collapsible_body"
        >
          <Box sx={styles.productGrid}>
            {products.map((product, idx) => (
              <CollapsibleRVItem
                key={`rv-desktop-product-${product.ID}`}
                product={product}
                idx={idx}
                scheme={vendorScheme}
                experienceId={experienceId}
                title={title}
                styles={styles}
                addImpression={addImpression}
                selectRecommItem={selectRecommItem}
                showATBBelow
                recommendationVariant={
                  isPLP ? 'DesktopCollapsibleRVItemPLP' : 'DesktopCollapsibleRVItem'
                }
              />
            ))}
          </Box>
        </Box>
      </Collapse>
    </Box>
  )
}

export default memo(DesktopCollapsibleRVCarousel)
