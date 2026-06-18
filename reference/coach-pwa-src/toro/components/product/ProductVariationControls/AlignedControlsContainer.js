import Box from 'toro/components/Box'
import Flex from 'toro/components/Flex'
import clamp from 'toro/helpers/clamp'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import PropTypes from 'prop-types'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import useViewportType from 'toro/hooks/useViewportType'

function getSizeItemsWidth(
  itemsNumber,
  itemsMargin,
  maxItemsInRow,
  label,
  type,
  isDesktop,
  variantType
) {
  // In case of mega PDP maxItemsInRow is the number which tell us the total number of item in a row
  const itemsNumberInRow =
    type === 'mega-pdp-tabs' ? maxItemsInRow : clamp(itemsNumber, 2, maxItemsInRow)
  if (type === 'mega-pdp-tabs' || type === 'mega-pdp-sizes') {
    if (!isDesktop) {
      return 'auto'
    }
  }
  if (label === 'size' || variantType === 'size' || type === 'mega-pdp-tabs') {
    return `calc(${100 / itemsNumberInRow}% - ${itemsMargin})`
  } else if (label === 'Heel Height') {
    return `calc(${100 / 3}% - ${itemsMargin})`
  } else {
    return `calc(${100 / 2}% - ${itemsMargin})`
  }
}

function AlignedControlsContainer({
  itemsMargin,
  maxItemsInRow,
  children,
  label = undefined,
  isSticky = undefined,
  variant = undefined,
  type = undefined,
  variantType,
  style = undefined,
}) {
  const { length } = children
  const { isDesktop } = useViewportType()
  const itemsWidth = getSizeItemsWidth(
    length,
    itemsMargin,
    maxItemsInRow,
    label,
    type,
    isDesktop,
    variantType
  )
  const styles = useMultiStyleConfig('ProductVariationCSS', { variant })
  return (
    <Flex
      {...(isSticky ? { justify: 'flex-start' } : {})}
      sx={styles.btnWrapper}
      className={`controls-btn-wrapper ${
        maxItemsInRow <= 3 ? 'controls-btn-wrapper-grid-large' : ''
      }`}
    >
      {children?.map?.((child) => (
        <Box
          w={itemsWidth}
          mb={itemsMargin}
          mr={itemsMargin}
          key={child?.key}
          className={
            variantType !== 'size'
              ? 'controls-btn-tabs-child'
              : `controls-btn-child ${isSticky ? 'controls-sticky-btn-child' : ''}`
          }
          sx={{ ...styles.btnChild, ...style }}
        >
          {child}
        </Box>
      ))}
    </Flex>
  )
}

AlignedControlsContainer.propTypes = {
  itemsMargin: PropTypes.string,
  maxItemsInRow: PropTypes.number,
  children: PropTypes.array,
  label: PropTypes.string,
  type: PropTypes.oneOf(['mega-pdp-tabs', 'mega-pdp-sizes']),
  variant: PropTypes.string,
}

AlignedControlsContainer.defaultProps = {
  maxItemsInRow: 7,
  variant: '',
}

export default withErrorBoundaryWrapper(AlignedControlsContainer)
