import { memo, useMemo } from 'react'
import useStyleConfig from 'toro/hooks/useStyleConfig'
import Image from 'toro/components/Image'
import Box from 'toro/components/Box'
import CarouselVideo from 'toro/components/product/CarouselVideo'
import useViewportType from 'toro/hooks/useViewportType'
import { getProductImageSrc } from 'toro/helpers/productImages'
import PropTypes from 'prop-types'

/**
 * Product thumbnail carousel item
 *
 * @param  {Object} data media data
 * @param  {Function} onClick click handler
 * @param  {String} variant common|active
 * @param  {Boolean} isFirstThumbnail first image of slider
 * @param  {Boolean} isLastThumbnail last image of slider
 */

const ProductCarouselThumbnail = ({
  data,
  isSSR,
  onClick,
  variant,
  isQuickView,
  onImageLoad,
  isFirstThumbnail = false,
  isLastThumbnail = false,
  ...props
}) => {
  const { src, alt, type, poster } = data || {}
  const { viewport } = useViewportType()
  const styles = useStyleConfig('ProductCarouselThumbnail', {
    variant,
  })
  let imageSrc = src

  if (type !== 'video') {
    imageSrc = getProductImageSrc(src, viewport, 'pdp', { isThumbnail: true, isQuickView })
  }

  const thumbnailClasses = useMemo(
    () => `${isFirstThumbnail ? 'first' : ''} ${isLastThumbnail ? 'last' : ''}`,
    [isFirstThumbnail, isLastThumbnail]
  )

  return (
    <Box mb={isSSR ? '10px' : '0px'} __css={styles} {...props}>
      {type === 'video' ? (
        <Box onClick={onClick} h={isQuickView ? '76px' : '107.5px'}>
          <CarouselVideo
            size={48}
            objectFit="cover"
            height={isQuickView ? '76px' : '107.5px'}
            width={isQuickView ? '60px' : ''}
            videoSrc={src}
            poster={poster?.src}
            thumbnails={true}
            classes={thumbnailClasses}
          />
        </Box>
      ) : (
        <Box onClick={onClick}>
          <Image
            key={imageSrc}
            src={imageSrc}
            alt={alt}
            w={isQuickView ? '60px' : '100px'}
            h={isQuickView ? '76px' : '107.5px'}
            objectFit="cover"
            style={{ userSelect: 'none' }}
            data-qa={isQuickView ? 'qv_btn_carousel_thmbnl_img' : 'pdp_btn_carousel_pdt_thmbnl_img'}
            className={thumbnailClasses}
            onImageLoad={onImageLoad}
            {...props}
          />
        </Box>
      )}
    </Box>
  )
}
ProductCarouselThumbnail.propTypes = {
  data: PropTypes.object,
  isSSR: PropTypes.bool,
  onClick: PropTypes.func,
  variant: PropTypes.string,
  isQuickView: PropTypes.bool,
  thumbnailsAmount: PropTypes.number,
  selectedColor: PropTypes.object,
  onImageLoad: PropTypes.func,
  isFirstThumbnail: PropTypes.bool,
  isLastThumbnail: PropTypes.bool,
}
ProductCarouselThumbnail.defaultProps = {
  onImageLoad: () => {},
  onClick: () => {},
  data: {},
  thumbnailsAmount: 0,
}

export default memo(ProductCarouselThumbnail)
