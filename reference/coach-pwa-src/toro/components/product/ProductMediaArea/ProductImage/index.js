import Image from 'toro/components/Image'
import Box from 'toro/components/Box'
import { useMemo } from 'react'
import { useRouter } from 'next/router'
import { getProductImageSrc } from 'toro/helpers/productImages'
import useViewportType from 'toro/hooks/useViewportType'
import { get } from 'react-hook-form'
import Tooltip from 'toro/components/Tooltip'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import useHasMounted from 'toro/hooks/useHasMounted'
import PropTypes from 'prop-types'
import ImageZoomDesktop from 'toro/components/ImageZoomDesktop'
import ImageZoomMobile from 'toro/components/ImageZoomMobile'
import Experiment from 'toro/components/Experiment'
import useExperiment from 'toro/hooks/useExperiment'
import { EXPERIMENTS } from 'toro/constants/experiments'
import useHeaderPositionPref from 'toro/hooks/useHeaderPositionPref'
import useImage1To1AspectRatio from 'toro/hooks/useImage1to1AspectRatio'
import getDynamicAssetSrc from 'toro/helpers/getDynamicAssetSrc'
import getPdpV7PngTemplateHeroSrc from 'toro/helpers/getPdpV7PngTemplateHeroSrc'
import usePreference from 'toro/hooks/usePreference_new'
import useTemplate from 'toro/hooks/useTemplate'
import { TemplateName } from 'toro/constants/templates'
import useIsKS from 'toro/helpers/isKS'
import ProductMediaAreaImage from 'toro/components/ProductMediaAreaImage'

/**
 * Renders large product image in PDP media carousel
 *
 * @param  {Boolean} canZoom media is scaleable
 * @param  {String} zoomVariant zoomed media appearance variant
 */

const ProductImage = ({
  canZoom,
  zoomDisabled = false,
  hasZoomedImage,
  isQuickView,
  src,
  label,
  containerProps,
  onImageLoad,
  setIsZoomed,
  idx,
  imageEditorialCopy,
  isTabbedAdaptivePDP,
  isDynamicAsset,
  isPdpV7PngHero = false,
  is2xZoom = false,
  ...props
}) => {
  const styles = useMultiStyleConfig('ProductImage')
  const { viewport, isDesktop, isMobile } = useViewportType()
  const hasMounted = useHasMounted()
  const editorialCopy = get(imageEditorialCopy, 'copy')
  const editorialPosition = get(imageEditorialCopy, 'position', 'top')
  const router = useRouter()
  const isPdpV41Enabled = useExperiment(EXPERIMENTS.PDP_V4_1)
  const isPDPV5Enabled = useTemplate([TemplateName.pdpv5])
  const isPDPV6 = useTemplate([TemplateName.pdpv6])
  const isKS = useIsKS()
  const {
    fullBleed: { dynamicAssetConfig },
  } = usePreference({
    'Full-Bleed': ['dynamicAssetConfig'],
  })

  const isPDPv3 = useExperiment(EXPERIMENTS.PDP_V3)

  const { isTransparentStickyHeader } = useHeaderPositionPref()

  const isTransparentStickyHeaderOnPDP =
    isTransparentStickyHeader && router.pathname.includes('/product') && isPDPv3 && isMobile

  const is1to1AspectRatioImage = useImage1To1AspectRatio(src)

  const imageSrc = useMemo(() => {
    if (src === undefined) {
      return ''
    }
    if (is2xZoom) {
      return getProductImageSrc(src, viewport, 'pdp', {
        isZoom: true,
      })
    }
    if (isPdpV7PngHero && dynamicAssetConfig?.enable) {
      const pdpV7Src = getPdpV7PngTemplateHeroSrc(src, hasZoomedImage, dynamicAssetConfig)
      if (pdpV7Src) return pdpV7Src
    }
    return isDynamicAsset
      ? getDynamicAssetSrc(src, hasZoomedImage, dynamicAssetConfig)
      : getProductImageSrc(src, viewport, 'pdp', {
          isZoom: hasZoomedImage,
          isQuickView,
          is1to1AspectRatioImage,
          isDynamicAsset,
          isPdpV5: isPDPV5Enabled,
          isPdpV6: isPDPV6 && !isKS,
        })
  }, [viewport, src, hasZoomedImage, isDynamicAsset, is2xZoom, isPdpV7PngHero])

  const imageProps = useMemo(
    () => ({
      src: imageSrc,
      'data-qa': isQuickView ? 'qv_btn_pdt_img' : 'pdp_btn_pdt_img',
      width: '100%',
      objectFit: 'contain',
      noMinW: isDesktop && hasMounted,
      noMinH: isDesktop && hasMounted,
      ...(hasMounted ? { onImageLoad } : {}),
      ...props,
      tabIndex: isDesktop && 0,
    }),
    [isDesktop, isQuickView, hasMounted, imageSrc]
  )

  const imageZoomProps = {
    ...props,
    onImageLoad,
    dataQa: 'm_pdp_btn_pdt_img',
    editorialCopy,
    editorialPosition,
    is2xZoom,
  }

  const renderZoomImage = () => (
    <Box
      className={`pdp-carousel-d${isTransparentStickyHeaderOnPDP ? ' socialProofBottom' : ''} ${
        isPdpV41Enabled ? ' customPaginationBottom' : ''
      }`}
      h="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
      overflow="hidden"
      backgroundColor={isTabbedAdaptivePDP ? 'unset' : undefined}
    >
      <Experiment forIDs={EXPERIMENTS.PDP_V3}>
        {editorialCopy && editorialPosition && isMobile && (
          <Box
            as="span"
            className={`text-body1-s`}
            sx={{ ...styles.imageEditorialCopy, ...styles[`${editorialPosition}PosCopy`] }}
          >
            {editorialCopy}
          </Box>
        )}
      </Experiment>
      {isDesktop ? (
        <ImageZoomDesktop
          src={imageSrc}
          {...imageZoomProps}
          variant={isPDPV5Enabled ? 'pdpv5' : undefined}
        />
      ) : (
        <ImageZoomMobile
          src={imageSrc}
          setIsZoomed={setIsZoomed}
          idx={idx}
          isDynamicAsset={isDynamicAsset}
          isPdpV7PngHero={isPdpV7PngHero}
          pdpV7RawScene7Src={isPdpV7PngHero ? src : undefined}
          {...imageZoomProps}
        />
      )}
    </Box>
  )

  const renderNonZoomImage = () => (
    <Box
      className={`pdp-carousel-d${isTransparentStickyHeaderOnPDP ? ' socialProofBottom' : ''} ${
        isPdpV41Enabled ? ' customPaginationBottom' : ''
      }`}
      h="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
      overflow="hidden"
      backgroundColor={isTabbedAdaptivePDP ? 'unset' : undefined}
    >
      <ProductMediaAreaImage src={imageSrc} idx={idx} {...props} />
    </Box>
  )

  const renderToolTip = () => (
    <Tooltip
      variant="baseStyle"
      placement="top"
      label={label}
      fontSize="xs"
      isDisabled={!isDesktop}
      gutter="-245"
    >
      <Box
        className={`pdp-carousel-d${isTransparentStickyHeaderOnPDP ? ' socialProofBottom' : ''} ${
          isPdpV41Enabled ? ' customPaginationBottom' : ''
        }`}
        h={isDesktop && '100%'}
        backgroundColor={isTabbedAdaptivePDP ? 'unset' : undefined}
        {...containerProps}
        sx={isQuickView ? styles.qvCarousel : styles.pdpCarousel}
      >
        <Image {...imageProps} />
      </Box>
    </Tooltip>
  )

  if (canZoom) return renderZoomImage()

  if (zoomDisabled) return renderNonZoomImage()

  return renderToolTip()
}

ProductImage.propTypes = {
  canZoom: PropTypes.bool,
  zoomDisabled: PropTypes.bool,
  hasZoomedImage: PropTypes.bool,
  isQuickView: PropTypes.bool,
  src: PropTypes.string,
  label: PropTypes.string,
  containerProps: PropTypes.string,
  onImageLoad: PropTypes.func,
  is2xZoom: PropTypes.bool,
  isPdpV7PngHero: PropTypes.bool,
}

export default ProductImage
