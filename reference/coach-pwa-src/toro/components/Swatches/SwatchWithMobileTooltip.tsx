import { useMemo, useState, useEffect, useRef } from 'react'
import get from 'lodash/get'
import { SystemStyleObject, useOutsideClick } from '@chakra-ui/react'
import Box from 'toro/components/Box'
import Image from 'toro/components/Image'
import useViewportType from 'toro/hooks/useViewportType'
import type { Color } from 'toro/components/Swatches'
import { getImageSuffixOptions, getProductImageSrc } from 'toro/helpers/productImages'
import Tooltip from 'toro/components/Tooltip'
import useExperiment from 'toro/hooks/useExperiment'
import { EXPERIMENTS } from 'toro/constants/experiments'
import useTemplate from 'toro/hooks/useTemplate'
import { TemplateName } from 'toro/constants/templates'
import usePreference from 'toro/hooks/usePreference_new'
import { useFlockSwatchImageUrl } from 'toro/hooks/useFlockSwatchImageUrl'
import useProductData from 'toro/hooks/useProductData'
import checkShouldUseFlockSwatches from './shouldUseFlockSwatches'

type SwatchProps = {
  color: Partial<Color>
  isActive: boolean
  onChange: () => void
  styles: Record<string, SystemStyleObject>
  showTooltip: boolean
  tooltipProps?: object
  productIdAttr: string
  lazy?: boolean
  pageType?: 'pdp' | 'plp'
}

const SwatchWithMobileTooltip = ({
  color,
  onChange,
  isActive,
  styles,
  tooltipProps,
  productIdAttr,
  lazy = true,
  pageType = 'pdp',
}: SwatchProps) => {
  const { viewport } = useViewportType()
  const isPdpV41Enabled = useExperiment(EXPERIMENTS.PDP_V4_1)
  const isPdpV42Enabled = useExperiment(EXPERIMENTS.PDP_V4_2)
  const isPdpV5Enabled = useTemplate([TemplateName.pdpv5])
  const isPDPv6 = useTemplate([TemplateName.pdpv6])
  const alt = get(color, 'image.alt')
  const swatchRef = useRef(null)

  const {
    pdpPreferences: { enableFlockColorSwatches = false },
  } = usePreference({
    PDPPreferences: ['enableFlockColorSwatches'],
  })

  const colorId = get(color, 'id')
  const masterId = get(color, 'masterId')
  const [categoryId, categoryIdFromPromotionData, additionalCategories] = useProductData([
    'category_id',
    'pickedProps.promotionData.category_id',
    'additionalCategories',
  ])

  const currentCategoryId = categoryIdFromPromotionData || categoryId || additionalCategories

  const shouldUseFlockSwatches = checkShouldUseFlockSwatches(
    enableFlockColorSwatches,
    isPDPv6,
    currentCategoryId
  )

  const flockSwatchUrl = useFlockSwatchImageUrl(masterId, colorId, 'c')

  const originalSrcWithSuffix = useMemo(() => {
    const originalSrc = get(color, 'image.src')

    if (isPdpV41Enabled || isPdpV5Enabled || isPdpV42Enabled || isPDPv6) {
      const src = get(color, 'pdpV41SwatchImage.src') || get(color, 'media.thumbnail.src', '')
      const hasParams = src.split('?').length > 1
      return `${src}${hasParams ? '&' : '?'}${
        getImageSuffixOptions(pageType, { isPngPdpSwatch: true })[viewport]
      }`
    }

    return getProductImageSrc(originalSrc, viewport, pageType, { isSwatchImage: true })
  }, [viewport, color, isPdpV41Enabled, isPdpV5Enabled, isPdpV42Enabled, pageType])

  const imageSrc = shouldUseFlockSwatches && flockSwatchUrl ? flockSwatchUrl : originalSrcWithSuffix

  const customFallbackImageUrl = shouldUseFlockSwatches ? originalSrcWithSuffix : undefined

  const [isOpen, setIsOpen] = useState(isActive)

  useEffect(() => {
    setIsOpen(isActive)
  }, [isActive])

  useEffect(() => {
    if (!isOpen) return
    const timeOut = setTimeout(() => setIsOpen(false), 3000)

    return () => {
      clearTimeout(timeOut)
    }
  }, [isOpen])

  const onSwatchClick = () => {
    onChange()
    isActive && setIsOpen((prevState) => !prevState)
  }

  const onClose = () => {
    setIsOpen(false)
  }

  useOutsideClick({
    ref: swatchRef,
    handler: onClose,
  })

  const isTooltipOpen = isOpen && !isPdpV42Enabled && !isPDPv6

  return (
    <Tooltip
      variant="baseStyle"
      label={color.text}
      fontSize="xs"
      hasArrow
      arrowSize={12}
      placement="top"
      className="adaptive-color-tooltip"
      offset={[0, 10]}
      shouldWrapChildren
      isOpen={isTooltipOpen}
      closeOnClick={false}
      sx={{
        borderRadius: 'var(--spacing-1)',
        border: 'none',
        boxShadow: 'none',
        p: '14px var(--spacing-4)',
        bg: 'var(--color-white-base)',
        fontFamily: 'var(--font-face1-normal)',
        fontSize: 'var(--text-16)',
        fontWeight: 400,
        lineHeight: 'var(--line-height-135)',
        letterSpacing: 'var(--letter-spacing-xs)',
        '& .chakra-tooltip__arrow': {
          bg: 'var(--color-white-base) !important', // need to re-write chakra inline styles
        },
      }}
      {...tooltipProps}
    >
      <Box
        data-testid="swatches_slide_swatch"
        borderRadius="50%"
        className={`swatchWrapper ${isActive ? 'activeColorSwatch' : ''} ${
          !color.orderable ? 'disabled-color' : ''
        }`}
        onClick={onSwatchClick}
        sx={get(styles, 'swatchWrapper', {})}
        ref={swatchRef}
        data-product-id={productIdAttr}
        data-qa="swatches_slide_swatch"
      >
        <Image
          lazy={lazy}
          alt={alt}
          tabIndex="0"
          src={imageSrc}
          cursor="pointer"
          sx={get(styles, 'swatchImage')}
          fetchpriority="low"
          crossOrigin={pageType === 'pdp' ? 'anonymous' : undefined}
          customFallbackImageUrl={customFallbackImageUrl}
        />
      </Box>
    </Tooltip>
  )
}

export default SwatchWithMobileTooltip
