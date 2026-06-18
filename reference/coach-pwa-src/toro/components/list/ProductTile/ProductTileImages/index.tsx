import React, { memo, useState, useCallback, ReactNode } from 'react'
import Box from 'toro/components/Box'
import Link from 'toro/components/Link'
import Hidden from 'toro/components/Hidden'
import ProductTileCarousel from 'toro/components/list/ProductTile/ProductTileCarousel'
import ProductTileImageDesktop from 'toro/components/list/ProductTile/ProductTileImageDesktop'
import ProductTileImageV3 from 'toro/components/list/ProductTile/ProductTileImageDesktop/ProductTileImageV3'
import { useAtomValue } from 'jotai/utils'
import { lazyIndexAtom, preloadImageSrcAtom } from 'store/search-results.atom'
import { isPlpV3Atom } from 'store/plp.atom'
import { Color, ListingProduct, MediaImage } from 'toro/types/productTypes'
import { AnalyticsData } from 'toro/hooks/useAddToCart'
import { SystemStyleObject } from '@chakra-ui/react'

const tileLinkQa = 'm_plp_link_pt_img'
const desktopTilesQa = 'd_plp_link_pt_img'

interface ProductTileImagesProps {
  id: string
  name: string
  color?: Color
  onImageLoad: () => void
  index: number
  displayedThumbnails: MediaImage[]
  styles: Record<string, SystemStyleObject>
  activeUrl: string
  onPpdLinkClick: (eventLocation: string, gaBadges?: AnalyticsData) => void
  onSlide: (idx: number, isForcedScroll: boolean) => void
  prefetchProps: {
    prefetch: boolean
    prefetchUrl: string
    pageData: ListingProduct
  }
  isTileVisible: boolean
  video?: string
  children?: ReactNode
  cta?: ReactNode
  onCarouselArrowClick: (direction: 'left' | 'right', activeSlideIndex: number) => void
}

const ProductTileImages = memo<ProductTileImagesProps>(
  ({
    id,
    name,
    color,
    onImageLoad,
    index,
    displayedThumbnails,
    styles,
    activeUrl,
    onPpdLinkClick,
    onSlide,
    prefetchProps,
    isTileVisible,
    video,
    children,
    cta,
    onCarouselArrowClick,
  }) => {
    const isPlpV3 = useAtomValue(isPlpV3Atom)
    const lazyIndex = useAtomValue(lazyIndexAtom)
    const preloadImageSrc = useAtomValue(preloadImageSrcAtom)

    const [isBoxHovered, setIsBoxHovered] = useState(false)
    const handleShowCta = useCallback(() => setIsBoxHovered(true), [])
    const handleHideCta = useCallback(() => setIsBoxHovered(false), [])

    const [isQuickViewHovered, setIsQuickViewHovered] = useState(false)
    const handleMouseEnterQuickView = useCallback(() => setIsQuickViewHovered(true), [])
    const handleMouseLeaveQuickView = useCallback(() => setIsQuickViewHovered(false), [])

    const handleClickLink = useCallback(() => {
      onPpdLinkClick('image')
    }, [onPpdLinkClick])

    return (
      <Box
        onMouseEnter={handleShowCta}
        onMouseLeave={handleHideCta}
        onFocus={handleShowCta}
        onBlur={handleHideCta}
        className={`product-thumbnail ${isPlpV3 ? 'plpv3' : ''}${
          isBoxHovered ? ' is-thumbnail-hovered' : ''
        }`}
        sx={styles.productThumbnail}
      >
        <Link
          aria-label={name}
          href={activeUrl}
          data-qa={tileLinkQa}
          onClick={handleClickLink}
          tabIndex="0"
          {...prefetchProps}
        >
          <Hidden onDesktop w="100%" h="100%">
            <ProductTileCarousel
              id={id}
              name={name}
              onImageLoad={onImageLoad}
              thumbnails={displayedThumbnails}
              lazyLoadImage={index >= lazyIndex}
              isTileVisible={isTileVisible}
              onSlide={onSlide}
              preloadImageSrc={preloadImageSrc}
              video={video}
              styles={styles}
              color={color}
            />
          </Hidden>
          <Hidden onNonDesktop w="100%" className="desktop-image-slider-wrapper">
            {isPlpV3 ? (
              <ProductTileImageV3
                id={id}
                name={name}
                onImageLoad={onImageLoad}
                thumbnails={displayedThumbnails}
                lazyLoadImage={index >= lazyIndex}
                onCarouselArrowClick={onCarouselArrowClick}
                preloadImageSrc={preloadImageSrc}
                styles={styles}
              />
            ) : (
              <ProductTileImageDesktop
                id={id}
                name={name}
                data-qa={desktopTilesQa}
                alt={color?.id}
                colorName={color?.text}
                isParentFocused={isQuickViewHovered}
                isParentHovered={isBoxHovered && !isQuickViewHovered}
                onImageLoad={onImageLoad}
                displayedThumbnails={displayedThumbnails}
                lazyLoadImage={index >= lazyIndex}
                preloadImageSrc={preloadImageSrc}
              />
            )}
          </Hidden>
        </Link>
        {(children || cta) && (
          <Box
            position="absolute"
            onMouseEnter={handleMouseEnterQuickView}
            onMouseLeave={handleMouseLeaveQuickView}
            bottom="0"
            left="0"
            right="0"
            maxHeight="100%"
            overflow="auto"
            zIndex="11"
            sx={styles.addToBagWrapper}
            className={!!children ? 'size-drawer-wrapper' : ''}
          >
            {children ||
              (cta && (
                <Box
                  width="100%"
                  className={isBoxHovered ? undefined : 'sr-only'}
                  sx={isBoxHovered ? { display: 'inline-flex' } : undefined}
                >
                  {cta}
                </Box>
              ))}
          </Box>
        )}
        {!isPlpV3 && <Box sx={styles.bottomGradient} />}
      </Box>
    )
  }
)

export default ProductTileImages
