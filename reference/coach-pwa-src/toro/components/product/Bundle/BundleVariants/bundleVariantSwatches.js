import get from 'lodash/get'
import { useCallback, useMemo } from 'react'
import Box from 'toro/components/Box'
import Image from 'toro/components/Image'
import useViewportType from 'toro/hooks/useViewportType'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import PropTypes from 'prop-types'

function BundleVariantSwatches({ item, selected, onClick: onClickProp, disabled, styles }) {
  const { alt } = get(item, 'media.thumbnail') || {}
  const { isDesktop } = useViewportType()
  const imageSrc1 = get(item, 'image.src')

  const bundleVariantSwatchesStyles = useMemo(
    () => styles.BundleVariantSwatches(selected),
    [selected]
  )

  const onClick = useCallback(() => {
    onClickProp?.(item)
  }, [item, onClickProp])

  if (!item) {
    return null
  }

  return (
    <Box
      cursor="pointer"
      as="button"
      onClick={onClick}
      className={`bundle-color-swatch-btn ${selected ? 'color-swatch-selected' : ''} ${
        disabled ? 'disabled-color' : ''
      }`}
      sx={bundleVariantSwatchesStyles}
      data-qa={selected ? 'cm_link_color_swatch_slctd' : 'cm_link_color_swatch_enbld'}
    >
      <Image
        className="bundle-color-swatch-img"
        cursor="pointer"
        src={imageSrc1}
        alt={alt}
        lazy={!isDesktop}
        sx={styles.BundleVariantSwatchesImage}
      />
    </Box>
  )
}

BundleVariantSwatches.propTypes = {
  item: PropTypes.object,
  selected: PropTypes.bool,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  styles: PropTypes.object,
}

BundleVariantSwatches.defaultProps = {
  onClick: () => {},
}

export default withErrorBoundaryWrapper(BundleVariantSwatches)
