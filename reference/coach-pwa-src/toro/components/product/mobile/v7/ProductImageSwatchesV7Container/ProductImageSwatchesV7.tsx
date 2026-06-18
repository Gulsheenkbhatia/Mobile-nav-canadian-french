import { memo, useMemo } from 'react'
import { useIntl } from 'react-intl'
import get from 'lodash/get'
import Box from 'toro/components/Box'
import Image from 'toro/components/Image'
import useViewportType from 'toro/hooks/useViewportType'
import type { Color } from 'toro/components/Swatches'
import { getImageSuffixOptions } from 'toro/helpers/productImages'
import useStyles from 'toro/hooks/useStyles'

type SwatchProps = {
  color: Color
  isActive: boolean
  onChange: () => void
  productIdAttr: string
  lazy?: boolean
  pageType?: 'pdp' | 'plp'
  isOutOfStock?: boolean
  isInteractionDisabled?: boolean
  isNavigationLinkChild?: boolean
}

const ProductImageSwatchesV7 = ({
  color,
  isActive,
  onChange,
  productIdAttr,
  lazy = true,
  pageType = 'pdp',
  isOutOfStock = false,
  isInteractionDisabled = false,
  isNavigationLinkChild = false,
}: SwatchProps) => {
  const styles = useStyles()
  const { formatMessage } = useIntl()
  const { viewport } = useViewportType()

  const colorLabel = formatMessage({ id: 'pdp.product.colorText', defaultMessage: 'Color' })
  const colorName = color.text?.trim() || color.id
  const accessibleName = `${colorLabel}: ${colorName}`

  const imageSrc = useMemo(() => {
    const src = get(color, 'pdpV41SwatchImage.src') || get(color, 'media.thumbnail.src', '')

    const hasParams = src.includes('?')

    return `${src}${hasParams ? '&' : '?'}${
      getImageSuffixOptions(pageType, {
        isPngPdpSwatch: true,
      })[viewport]
    }`
  }, [color, viewport, pageType])

  const swatchClassName = [
    isOutOfStock ? 'out-of-stock' : '',
    isInteractionDisabled ? 'swatch-non-selectable' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <Box
      as={isNavigationLinkChild ? 'span' : 'button'}
      type={isNavigationLinkChild ? undefined : 'button'}
      aria-label={accessibleName}
      disabled={isNavigationLinkChild ? undefined : isInteractionDisabled}
      aria-disabled={isNavigationLinkChild ? undefined : isInteractionDisabled}
      className={swatchClassName}
      sx={styles.swatchCard}
      onClick={
        isNavigationLinkChild
          ? undefined
          : () => {
              if (isInteractionDisabled) return
              onChange()
            }
      }
      data-product-id={productIdAttr}
    >
      <Image
        lazy={lazy}
        alt={color.text}
        src={imageSrc}
        sx={styles.swatchImage}
        fetchpriority="low"
        crossOrigin="anonymous"
      />

      {isActive && <Box sx={styles.swatchActiveIndicator} />}
    </Box>
  )
}

export default memo(ProductImageSwatchesV7)
