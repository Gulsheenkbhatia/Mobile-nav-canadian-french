import { useCallback, memo, useMemo } from 'react'
import get from 'lodash/get'
import { SystemStyleObject } from '@chakra-ui/react'
import Box from 'toro/components/Box'
import Image from 'toro/components/Image'
import useViewportType from 'toro/hooks/useViewportType'
import type { Color } from 'toro/components/Swatches'
import { getProductImageSrc } from 'toro/helpers/productImages'

type SwatchProps = {
  color: Color
  isActive: boolean
  onChange: () => void
  styles: Record<string, SystemStyleObject>
  lazy?: boolean
}

const Swatch = ({ color, onChange, isActive, styles, lazy = true }: SwatchProps) => {
  const { viewport } = useViewportType()

  const alt = get(color, 'image.alt')

  const imageSrc = useMemo(() => {
    const originalSrc = get(color, 'image.src')
    return getProductImageSrc(originalSrc, viewport, 'plp', { isSwatchImage: true })
  }, [color, viewport])

  const handleKeyPress = useCallback((e) => {
    const code = e.keyCode || e.which

    if (code === 13) {
      onChange()
    }
  }, [])

  return (
    <Box
      data-testid="swatches_slide_swatch"
      borderRadius="50%"
      className={`${!color.orderable ? 'disabled-color' : ''} ${
        isActive ? 'activeColorSwatch' : ''
      }`}
      onClick={onChange}
      sx={get(styles, 'swatchWrapper', {})}
      data-qa="swatches_slide_swatch"
      title={color.text}
    >
      <Image
        lazy={lazy}
        alt={alt}
        tabIndex="0"
        src={imageSrc}
        cursor="pointer"
        sx={get(styles, 'swatchImage')}
        onKeyPress={handleKeyPress}
        fetchpriority="low"
        data-qa="cm_tile_link_pt_colorswatch"
      />
    </Box>
  )
}

export function shouldSwatchPreventRender(prevProps, nextProps) {
  const isActiveChanged = nextProps.isActive !== prevProps.isActive
  const isColorChanged = get(nextProps, 'color.id') !== get(prevProps, 'color.id')

  return !(isActiveChanged || isColorChanged)
}

export default memo(Swatch, shouldSwatchPreventRender)
