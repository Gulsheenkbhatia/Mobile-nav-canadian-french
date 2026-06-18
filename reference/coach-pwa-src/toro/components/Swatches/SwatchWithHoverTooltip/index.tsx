import { memo, useMemo, useRef } from 'react'
import get from 'lodash/get'
import { SystemStyleObject } from '@chakra-ui/react'
import Box from 'toro/components/Box'
import Image from 'toro/components/Image'
import useViewportType from 'toro/hooks/useViewportType'
import type { Color } from 'toro/components/Swatches'
import { getImageSuffixOptions } from 'toro/helpers/productImages'

type SwatchProps = {
  color: Partial<Color>
  isActive: boolean
  onChange: () => void
  styles: Record<string, SystemStyleObject>
  productIdAttr: string
  lazy?: boolean
  pageType?: 'pdp' | 'plp'
}

const SwatchWithHoverTooltip = ({
  color,
  isActive,
  onChange,
  styles,
  productIdAttr,
  lazy = true,
  pageType = 'pdp',
}: SwatchProps) => {
  const { viewport } = useViewportType()
  const alt = get(color, 'image.alt')
  const swatchRef = useRef(null)

  const imageSrc = useMemo(() => {
    const src = get(color, 'pdpV41SwatchImage.src') || get(color, 'media.thumbnail.src', '')
    const hasParams = src.split('?').length > 1
    return `${src}${hasParams ? '&' : '?'}${
      getImageSuffixOptions(pageType, { isPngPdpSwatch: true })[viewport]
    }`
  }, [color, viewport])

  return (
    <span title={color.text}>
      <Box
        data-testid="swatches_slide_swatch"
        borderRadius="50%"
        className={`${isActive ? 'activeColorSwatch' : ''} ${
          !color.orderable ? 'disabled-color' : ''
        } swatch-wrapper`}
        onClick={onChange}
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
        />
      </Box>
    </span>
  )
}

function shouldSwatchPreventRender(prevProps, nextProps) {
  const isActiveChanged = nextProps.isActive !== prevProps.isActive
  const isColorChanged = get(nextProps, 'color.id') !== get(prevProps, 'color.id')

  return !(isActiveChanged || isColorChanged)
}

export default memo(SwatchWithHoverTooltip, shouldSwatchPreventRender)
