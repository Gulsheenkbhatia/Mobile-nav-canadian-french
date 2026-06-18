import { memo, useCallback } from 'react'
import get from 'lodash/get'
import ColorButton from 'toro/components/ColorButton'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import PropTypes from 'prop-types'

function ProductColorControl({ color, selected, disabled, onClick, styles }) {
  const { src, alt } = get(color, 'image') || {}

  const handleClick = useCallback(() => {
    !selected && onClick && onClick(color)
  }, [selected, onClick, color])

  return (
    <ColorButton
      mr="mar"
      mb="mar"
      size="md"
      selected={selected}
      onClick={handleClick}
      ignoreHover
      src={src}
      alt={alt}
      disabled={disabled}
      allowClickOnDisabled
      sx={styles.colorButton}
      data-qa={
        selected
          ? 'cm_link_color_swatch_slctd'
          : disabled
          ? 'cm_link_color_swatch_dsbld'
          : 'cm_link_color_swatch_enbld'
      }
    />
  )
}

ProductColorControl.propTypes = {
  color: PropTypes.object,
  selected: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  styles: PropTypes.object,
}

ProductColorControl.defaultProps = {
  onClick: () => {},
}

export default memo(withErrorBoundaryWrapper(ProductColorControl))
